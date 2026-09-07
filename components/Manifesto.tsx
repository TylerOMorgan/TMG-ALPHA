
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

const Manifesto: React.FC = () => {
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
      // First part is fully visible white
      gsap.set(initialVisible, { opacity: 1, color: '#EAEAEA' });
      // Rest is dimmed (almost hidden)
      gsap.set(toReveal, { opacity: 0.1, color: '#4a4a4a' });
      
      // Footer Initial State: Dimmed and no glow
      gsap.set(footerWords, { opacity: 0.1, textShadow: "none" });

      // 2. Timeline with Pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center", // Lock when the section center hits viewport center
          end: "+=85%", // Ends right after Established in BKK 2024 is fully revealed
          pin: true,      // Pin the section in place
          scrub: 0.5,     // Smooth scrubbing
          anticipatePin: 1
        }
      });

      // 3. Reveal Animation: Upper text reveals completely first
      tl.to(toReveal, {
        opacity: 1,
        color: '#EAEAEA',
        stagger: 0.15,
        duration: 0.25,
        ease: "none",
      })
      // 4. Footer Reveal: Starts strictly AFTER the entire text above is 100% revealed
      .to(footerWords, {
        opacity: 1,
        textShadow: "0 0 12px rgba(255,127,80,0.8)",
        stagger: 0.12,
        duration: 0.4,
        ease: "power2.out",
      }, "+=0.1");

      // 5. Scroll Teaser: smoothly fades out over the first 80px of scroll
      if (teaserRef.current) {
        gsap.to(teaserRef.current, {
          opacity: 0,
          y: 20,
          ease: "power1.out",
          scrollTrigger: {
            start: 0,
            end: 80,
            scrub: true,
            onUpdate: (self) => {
              if (teaserRef.current) {
                teaserRef.current.style.pointerEvents = self.progress > 0.5 ? 'none' : 'auto';
              }
            }
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about-manifesto" 
      ref={sectionRef} 
      className="relative z-10 w-full min-h-0 flex items-center justify-center bg-trillex-black pt-0 pb-1 sm:pb-2"
    >
      <div className="max-w-7xl px-8 md:px-12 text-center flex flex-col items-center">
        
        {/* About Label: Left aligned and larger */}
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
        
        {/* Added Footer Text with Neon Glow and Scroll Reveal */}
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

      {/* Scroll Teaser - Logo Apex peeking at bottom of viewport on initial load (Point 2) */}
      {typeof document !== 'undefined' && createPortal(
        <div 
          ref={teaserRef} 
          className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto cursor-pointer select-none group"
          onClick={() => window.scrollBy({ top: 350, behavior: 'smooth' })}
          title="Scroll to explore"
          aria-label="Scroll to explore"
        >
          {/* Ambient subtle glow */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 sm:w-36 h-12 bg-gradient-to-r from-trillex-orange/30 via-amber-500/25 to-trillex-orange/30 rounded-full blur-xl pointer-events-none animate-pulse" />
          
          {/* Top apex of logo matching user snippet */}
          <div className="relative w-24 sm:w-28 md:w-32 h-8 sm:h-9 md:h-10 overflow-hidden flex items-start justify-center">
            <Logo className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 text-white/90 group-hover:text-white shrink-0 -mt-1 transition-colors drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Manifesto;
