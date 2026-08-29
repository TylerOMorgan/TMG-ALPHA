
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Artists from './components/pages/Artists';

gsap.registerPlugin(ScrollTrigger);

const getPageFromHash = (): string => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  if (['demo-submission', 'demo-submissions', 'demo', 'demos', 'general-inquiry', 'general-enquiry', 'inquiry', 'enquiry', 'general', 'contact', 'contact-form', 'email-ticker'].includes(hash)) {
    return 'contact';
  }
  if (hash === 'about') {
    return 'about';
  }
  if (['artists', 'artist', 'roster'].includes(hash)) {
    return 'artists';
  }
  return 'home';
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>(getPageFromHash);
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  
  // Track if it's the first load
  const isInitialLoad = useRef(true);
  
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Hash & Popstate Navigation Listener
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setActivePage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Global Navigation Listener
  useEffect(() => {
    const handleNav = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail.page) {
          setActivePage(customEvent.detail.page);
          if (customEvent.detail.page === 'home') {
            window.history.pushState(null, '', window.location.pathname);
          } else if (customEvent.detail.page === 'about') {
            window.history.pushState(null, '', '#about');
          } else if (customEvent.detail.page === 'artists') {
            window.history.pushState(null, '', '#artists');
          } else if (customEvent.detail.page === 'contact') {
            if (!window.location.hash.includes('demo')) {
              window.history.pushState(null, '', '#general-inquiry');
            }
          }
        }
        if (customEvent.detail.section) setScrollToSection(customEvent.detail.section);
    };
    window.addEventListener('trillex-navigate', handleNav);
    return () => window.removeEventListener('trillex-navigate', handleNav);
  }, []);

  // Effect 1: Handle Page Change -> Scroll Top & Preloader
  useEffect(() => {
    // Trigger preloader when switching to Home
    if (activePage === 'home') {
        setLoading(true);
    }

    // Always force scroll to top when changing pages
    window.scrollTo(0, 0);
    
    // Refresh ScrollTrigger after DOM updates.
    const timer = requestAnimationFrame(() => {
       ScrollTrigger.refresh();
       // Double refresh for safety on complex layouts
       setTimeout(() => ScrollTrigger.refresh(), 200);
    });

    return () => cancelAnimationFrame(timer);
  }, [activePage]); 

  // Effect 2: Handle Targeted Section Scrolling (Optimized)
  useEffect(() => {
    if (scrollToSection) {
        let rafId: number;
        let timeoutId: ReturnType<typeof setTimeout>;
        let attempts = 0;
        const maxAttempts = 120; // Approx 2 seconds at 60fps

        const checkElement = () => {
            const element = document.getElementById(scrollToSection);
            
            if (element) {
                // Element found! 
                // Delay to ensure layout stability (WebGL context, fonts, etc)
                timeoutId = setTimeout(() => {
                    const event = new CustomEvent('trillex-scroll-to', { 
                        detail: { targetId: scrollToSection } 
                    });
                    window.dispatchEvent(event);
                    setScrollToSection(null); // Reset target
                }, 600);
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    rafId = requestAnimationFrame(checkElement);
                } else {
                    // Stop trying if timed out
                    setScrollToSection(null);
                }
            }
        };

        rafId = requestAnimationFrame(checkElement);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(timeoutId);
        };
    }
  }, [scrollToSection, activePage]);

  // Preloader Animation Logic
  useEffect(() => {
    if (!loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
            setLoading(false);
            isInitialLoad.current = false; // Subsequent loads will be faster
        }
      });
      const counter = { val: 0 };
      
      // Determine duration based on load type
      const counterDuration = isInitialLoad.current ? 2.2 : 0;
      const exitDuration = isInitialLoad.current ? 1.1 : 1.0;

      // Pulsing Glow Effect for Logo (runs independently)
      if (logoRef.current) {
        gsap.fromTo(logoRef.current, 
            { filter: "drop-shadow(0 0 0px rgba(255, 127, 80, 0))" },
            {
            filter: "drop-shadow(0 0 15px rgba(255, 127, 80, 0.6))",
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: "sine.inOut"
            }
        );
      }

      // 1. Counter 0 -> 100
      tl.to(counter, {
        val: 100,
        duration: counterDuration,
        ease: "none",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.floor(counter.val).toString().padStart(2, '0');
          }
        }
      });

      // Logo fill sync with counter
      if (logoRef.current) {
        gsap.set(logoRef.current, { backgroundPosition: "0% 0%" });

        tl.to(logoRef.current, {
            backgroundPosition: "0% 100%",
            duration: counterDuration,
            ease: "none"
        }, "<");
      }

      // 2. Curtain Reveal (Exit)
      if (preloaderRef.current) {
        tl.to(preloaderRef.current, {
            yPercent: -100,
            duration: exitDuration,
            ease: "power4.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, [loading]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'artists':
        return <Artists />;
      case 'contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      {/* Preloader Overlay */}
      {loading && (
        <div 
            ref={preloaderRef}
            className="fixed inset-0 z-[10000] bg-trillex-black flex items-center justify-center overflow-hidden"
        >
            <div className="text-center relative flex flex-col items-center justify-center w-full">
            <div 
                ref={logoRef}
                className="font-display font-bold text-[15vw] md:text-[12vw] leading-none tracking-tighter mb-6 select-none"
                style={{ 
                WebkitTextStroke: '1px #FF7F50', 
                color: 'transparent',
                backgroundImage: 'linear-gradient(0deg, #FF7F50 50%, transparent 50%)',
                backgroundSize: '100% 200%',
                backgroundPosition: '0% 0%', 
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
                }}
            >
                TRILLEX
            </div>
            
            <div ref={counterRef} className="text-trillex-orange font-mono text-xl md:text-2xl font-bold animate-pulse">
                00
            </div>
            </div>
        </div>
      )}

      {/* 
        Cursor moved OUTSIDE of SmoothScroll 
        This prevents Lenis transforms from breaking 'fixed' positioning 
      */}
      <Cursor />

      {/* Main Content */}
      <SmoothScroll>
        <Navigation activePage={activePage} onNavigate={setActivePage} />
        
        <main className="relative w-full bg-trillex-black min-h-screen">
          {renderPage()}
        </main>
      </SmoothScroll>
    </>
  );
};

export default App;
