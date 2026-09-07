
import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      autoResize: true,
    });

    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Custom Event Listener for programmatic scrolling via Lenis
    const handleScrollTo = (e: Event) => {
        const customEvent = e as CustomEvent;
        const targetId = customEvent.detail.targetId;
        const elem = document.getElementById(targetId);
        
        if (elem) {
            // Calculate offset to center the element in the viewport
            // Offset = -(ViewportHeight - ElementHeight) / 2
            const offset = -(window.innerHeight - elem.offsetHeight) / 2;
            
            lenis.scrollTo(elem, {
                offset: offset,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                force: true, // Force scroll even if user is interacting
                immediate: false
            });
        }
    };

    window.addEventListener('trillex-scroll-to', handleScrollTo);

    return () => {
      window.removeEventListener('trillex-scroll-to', handleScrollTo);
      gsap.ticker.remove(update);
      lenis.destroy();
      if (typeof window !== 'undefined' && (window as any).lenis === lenis) {
        delete (window as any).lenis;
      }
    };
  }, []);

  return <div className="w-full min-h-screen">{children}</div>;
};

export default SmoothScroll;

