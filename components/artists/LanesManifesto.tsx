import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  LANES_EYEBROW,
  LANES_TITLE,
  LANES_COPY,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const WaveformLine: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 340 52"
    fill="none"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M0 26 H96 L108 26 L116 10 L126 42 L136 18 L148 34 L160 22 L172 30 L186 8 L200 46 L214 24 L228 26 H258 L266 12 L278 40 L290 20 L300 30 L310 26 H340"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const LanesManifesto: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const lane1Ref = useRef<HTMLDivElement>(null);
  const lane2Ref = useRef<HTMLDivElement>(null);
  const lane3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Lane 01 & 03: Enter from left (start shifted left, move right)
      if (lane1Ref.current) {
        tl.fromTo(
          lane1Ref.current,
          { xPercent: isMobile ? -8 : -14 },
          { xPercent: isMobile ? 2 : 4, ease: "none" },
          0
        );
      }

      // Lane 02: Enter from right (starts shifted right, moves left)
      if (lane2Ref.current) {
        tl.fromTo(
          lane2Ref.current,
          { xPercent: isMobile ? 8 : 14 },
          { xPercent: isMobile ? -2 : -4, ease: "none" },
          0
        );
      }

      // Lane 03: Enter from left (starts shifted left, moves right)
      if (lane3Ref.current) {
        tl.fromTo(
          lane3Ref.current,
          { xPercent: isMobile ? -8 : -14 },
          { xPercent: isMobile ? 2 : 4, ease: "none" },
          0
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      className="relative w-full overflow-hidden bg-[#EBE7DD] pb-24 pt-16 text-trillex-ink md:pb-32 md:pt-24"
    >
      <div className="relative z-10 mx-auto max-w-[1840px] px-4 sm:px-6 md:px-10">
        <Eyebrow text={LANES_EYEBROW} tone="light" />
        <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-6 sm:gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="font-impact text-[9.5vw] leading-[0.98] text-[#040404] sm:text-[8.5vw] lg:col-span-8 lg:text-[6.15vw]">
            {LANES_TITLE}
          </h2>
          <p className="max-w-md text-sm font-light leading-relaxed text-trillex-ink/70 sm:text-base lg:col-span-4">
            {LANES_COPY}
          </p>
        </div>
      </div>

      {/* Unified Expandable Interactive Genre Lanes */}
      <div className="relative z-10 mx-auto mt-12 max-w-[1840px] px-4 sm:mt-16 sm:px-6 md:mt-24 md:px-10">
        <div ref={rowsRef} className="relative">
          {/* Lane 01: Left-aligned HARDTEKK with Waveform on top divider */}
          <div className="group relative border-t border-trillex-ink/15">
            <WaveformLine className="pointer-events-none absolute -top-[26px] right-[4%] hidden w-[340px] text-trillex-signal/60 md:block" />
            <div
              ref={lane1Ref}
              className="flex cursor-pointer items-center gap-4 py-3.5 will-change-transform transition-all duration-300 ease-out group-hover:py-6 sm:gap-6 sm:py-4 md:gap-10 md:py-6 md:group-hover:py-9"
            >
              <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-trillex-ink/40 transition-colors group-hover:text-trillex-signal sm:text-xs">
                01
              </span>
              <span className="whitespace-nowrap font-impact text-[8.5vw] leading-none text-trillex-signal transition-colors duration-300 sm:text-[9.5vw] md:text-[6.2vw]">
                HARDTEKK
              </span>
            </div>
          </div>

          {/* Lane 02: Right-aligned BRAZILIAN FUNK */}
          <div className="group relative border-t border-trillex-ink/15">
            <div
              ref={lane2Ref}
              className="flex cursor-pointer items-center justify-end gap-4 py-3.5 will-change-transform transition-all duration-300 ease-out group-hover:py-6 sm:gap-6 sm:py-4 md:gap-10 md:py-6 md:group-hover:py-9"
            >
              <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-trillex-ink/40 transition-colors group-hover:text-trillex-signal sm:text-xs">
                02
              </span>
              <span className="whitespace-nowrap font-impact text-[8.5vw] leading-none text-trillex-ink transition-colors duration-300 group-hover:text-trillex-signal sm:text-[9.5vw] md:text-[6.2vw]">
                BRAZILIAN FUNK
              </span>
            </div>
          </div>

          {/* Lane 03: Left-aligned HOODTRAP */}
          <div className="group relative border-b border-t border-trillex-ink/15">
            <div
              ref={lane3Ref}
              className="flex cursor-pointer items-center gap-4 py-3.5 will-change-transform transition-all duration-300 ease-out group-hover:py-6 sm:gap-6 sm:py-4 md:gap-10 md:py-6 md:group-hover:py-9"
            >
              <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-trillex-ink/40 transition-colors group-hover:text-trillex-signal sm:text-xs">
                03
              </span>
              <span className="whitespace-nowrap font-impact text-[8.5vw] leading-none text-trillex-ink transition-colors duration-300 group-hover:text-trillex-signal sm:text-[9.5vw] md:text-[6.2vw]">
                HOODTRAP
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LanesManifesto);
