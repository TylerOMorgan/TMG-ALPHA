
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo from './Logo';

gsap.registerPlugin(ScrollTrigger);

// Optimization: Define static data outside component to avoid re-splitting on every render
const TEXT = "Founded with a clear vision, Trillex Music Group runs on global scale, transparency, and precise execution. Our systems support artists with clear communication and fast action. We move with discipline and honesty, setting a higher standard for how a modern music company should operate.";
const WORDS = TEXT.split(' ');
// Find the index of "on" in "...runs on" to set as the split point for the animation
const PIVOT_INDEX = WORDS.findIndex((word, i) => word === 'on' && WORDS[i-1] === 'runs');

const FOOTER_TEXT = "Established in BKK 2024";
const FOOTER_WORDS = FOOTER_TEXT.split(' ');

const Manifesto: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !sectionRef.current || !footerRef.current) return;

    const ctx = gsap.context(() => {
      const words = textRef.current!.querySelectorAll('.word');
      const footerWords = footerRef.current!.querySelectorAll('.footer-word');
      
      // Separate words based on the pivot point
      const initialVisible = Array.from(words).slice(0, PIVOT_INDEX + 1);
      const toReveal = Array.from(words).slice(PIVOT_INDEX + 1);

      // 1. Initial State:
      gsap.set(initialVisible, { opacity: 1, color: '#EAEAEA' });
      gsap.set(toReveal, { opacity: 0.1, color: '#4a4a4a' });
      gsap.set(footerWords, { opacity: 0.1, textShadow: "none" });

      // 2. Timeline with Pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "manifesto-trigger",
          trigger: sectionRef.current,
          start: "center center",
          end: "+=85%",
          pin: true,
          scrub: 0.5,
        }
      });

      // 3. Reveal Animation
      tl.to(toReveal, {
        opacity: 1,
        color: '#EAEAEA',
        stagger: 0.15,
        duration: 0.25,
        ease: "none",
      })
      .to(footerWords, {
        opacity: 1,
        textShadow: "0 0 12px rgba(255,127,80,0.8)",
        stagger: 0.12,
        duration: 0.4,
        ease: "power2.out",
      }, "+=0.1");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Teaser visibility: GSAP ticker reads lenis.scroll every frame (most reliable)
  useEffect(() => {
    if (!teaserRef.current) return;
    const FADE_END = 80;

    const update = () => {
      if (!teaserRef.current) return;
      const lenis = (window as any).lenis;
      const scroll = lenis ? lenis.scroll : window.scrollY;
      const progress = Math.min(scroll / FADE_END, 1);
      const opacity = 1 - progress;
      teaserRef.current.style.opacity = String(opacity);
      teaserRef.current.style.transform = `translateY(${progress * 20}px)`;
      teaserRef.current.style.pointerEvents = opacity < 0.5 ? 'none' : 'auto';
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <section 
      id="about-manifesto" 
      ref={sectionRef} 
      className="relative z-10 w-full min-h-0 flex items-center justify-center bg-trillex-black pt-0 pb-1 sm:pb-2"
    >
      <div className="w-full max-w-7xl px-8 md:px-12 text-center flex flex-col items-center">
        
        {/* About Label */}
        <div className="w-full flex justify-start mb-4 sm:mb-6">
            <span className="text-trillex-orange text-xl font-mono font-bold tracking-widest uppercase">
                About
            </span>
        </div>

        <div 
          ref={textRef} 
          className="text-[22px] sm:text-[28px] md:text-[40px] lg:text-[48px] font-zalando font-extrabold italic leading-tight flex flex-wrap justify-center gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 tracking-normal"
        >
          {WORDS.map((word, i) => (
            <span key={i} className="word transition-colors duration-200 will-change-[opacity,color]">
              {word}
            </span>
          ))}
        </div>
        
        {/* Footer Text with Neon Glow and Scroll Reveal */}
        <div 
            ref={footerRef}
            className="mt-6 sm:mt-8 text-trillex-orange text-lg md:text-2xl font-sans font-medium tracking-wider flex gap-x-2 flex-wrap justify-center relative z-20"
        >
             {FOOTER_WORDS.map((word, i) => (
                <span key={i} className="footer-word will-change-[opacity,text-shadow]">
                    {word}
                </span>
             ))}
        </div>
      </div>

      {/* Scroll Teaser — visible on load, disappears on first scroll */}
      {isActive && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        >
          <div 
            ref={teaserRef} 
            className="relative flex flex-col items-center pointer-events-auto cursor-pointer select-none group"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => window.scrollBy({ top: 350, behavior: 'smooth' })}
            title="Scroll to explore"
            aria-label="Scroll to explore"
          >
            {/* Ambient glow: orange left, green right */}
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-55px',
                width: 'clamp(500px, 60vw, 850px)',
                height: 'clamp(110px, 14vw, 160px)',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                background: 'linear-gradient(to right, rgba(255,127,80,0.20), rgba(6,182,212,0.05), rgba(52,211,153,0.20))',
                borderRadius: '9999px',
                filter: 'blur(48px)',
              }}
            />

            {/* Logo apex peeking at bottom */}
            <div 
              style={{
                position: 'relative',
                width: 'clamp(256px, 30vw, 320px)',
                height: 'clamp(32px, 4vw, 40px)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                clipPath: 'inset(-100px -100px 0px -100px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  transform: 'translateX(17.93%)',
                }}
              >
                <Logo 
                  className="text-white/70 group-hover:text-white/90 shrink-0 transition-colors duration-200" 
                  style={{
                    width: 'clamp(96px, 12vw, 128px)',
                    height: 'clamp(96px, 12vw, 128px)',
                    marginTop: '-4px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Manifesto;
