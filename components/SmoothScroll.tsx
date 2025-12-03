
import React, { useEffect } from 'react';
import Lenis from 'lenis';
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
      touchMultiplier: 2,
    });

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

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
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                force: true, // Force scroll even if user is interacting
                immediate: false
            });
        }
    };

    window.addEventListener('trillex-scroll-to', handleScrollTo);

    return () => {
      window.removeEventListener('trillex-scroll-to', handleScrollTo);
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <div className="w-full min-h-screen">{children}</div>;
};

export default SmoothScroll;
