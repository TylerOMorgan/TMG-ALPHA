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

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const rows = rowsRef.current?.children;
      if (!rows || rows.length < 3) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      tl.fromTo(rows[0], { xPercent: 2 }, { xPercent: -3, ease: "none" }, 0);
      tl.fromTo(rows[1], { xPercent: 7 }, { xPercent: -7, ease: "none" }, 0);
      tl.fromTo(rows[2], { xPercent: 2 }, { xPercent: -3, ease: "none" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#EBE7DD] pb-24 pt-16 text-trillex-ink md:pb-32 md:pt-24"
    >
      <div className="relative z-10 mx-auto max-w-[1840px] px-5 md:px-10">
        <Eyebrow text={LANES_EYEBROW} tone="light" />
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="font-impact text-[11vw] leading-[0.98] text-[#040404] lg:col-span-8 lg:text-[6.15vw]">
            {LANES_TITLE}
          </h2>
          <p className="max-w-md text-sm font-light leading-relaxed text-trillex-ink/60 md:text-base lg:col-span-4">
            {LANES_COPY}
          </p>
        </div>
      </div>

      {/* Unified Expandable Interactive Genre Lanes */}
      <div className="relative z-10 mx-auto mt-16 max-w-[1840px] px-5 md:mt-24 md:px-10">
        <div ref={rowsRef} className="relative">
          {/* Lane 01: Left-aligned HARDTEKK with Waveform on top divider */}
          <div className="group relative border-t border-trillex-ink/15 will-change-transform">
            <WaveformLine className="pointer-events-none absolute -top-[26px] right-[4%] hidden w-[340px] text-trillex-signal/60 md:block" />
            <div className="flex cursor-pointer items-center gap-6 py-4 transition-all duration-300 ease-out group-hover:py-7 md:gap-10 md:py-6 md:group-hover:py-9">
              <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-trillex-ink/35 transition-colors group-hover:text-trillex-signal">
                01
              </span>
              <span className="whitespace-nowrap font-impact text-[11vw] leading-none text-trillex-signal transition-colors duration-300 md:text-[6.2vw]">
                HARDTEKK
              </span>
            </div>
          </div>

          {/* Lane 02: Right-aligned BRAZILIAN FUNK */}
          <div className="group relative border-t border-trillex-ink/15 will-change-transform">
            <div className="flex cursor-pointer items-center justify-end gap-6 py-4 transition-all duration-300 ease-out group-hover:py-7 md:gap-10 md:py-6 md:group-hover:py-9">
              <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-trillex-ink/35 transition-colors group-hover:text-trillex-signal">
                02
              </span>
              <span className="whitespace-nowrap font-impact text-[11vw] leading-none text-trillex-ink transition-colors duration-300 group-hover:text-trillex-signal md:text-[6.2vw]">
                BRAZILIAN FUNK
              </span>
            </div>
          </div>

          {/* Lane 03: Left-aligned HOODTRAP */}
          <div className="group relative border-b border-t border-trillex-ink/15 will-change-transform">
            <div className="flex cursor-pointer items-center gap-6 py-4 transition-all duration-300 ease-out group-hover:py-7 md:gap-10 md:py-6 md:group-hover:py-9">
              <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-trillex-ink/35 transition-colors group-hover:text-trillex-signal">
                03
              </span>
              <span className="whitespace-nowrap font-impact text-[11vw] leading-none text-trillex-ink transition-colors duration-300 group-hover:text-trillex-signal md:text-[6.2vw]">
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
