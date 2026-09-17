import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  WORK_EYEBROW,
  WORK_PILLARS,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const WorkWithUs: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const items = pillarsRef.current?.children;
      if (!items || !items.length) return;
      gsap.fromTo(
        items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          stagger: 0.15,
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 85%",
            end: "top 45%",
            scrub: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#E58A1E] py-16 text-black md:py-24"
    >
      <div className="mx-auto max-w-[1840px] px-4 sm:px-6 md:px-10">
        <Eyebrow text={WORK_EYEBROW} tone="onSignal" />
        <h2 className="mt-6 font-impact text-[9.5vw] leading-[1.0] text-[#2B1704] sm:mt-8 sm:text-[8vw] md:text-[6.15vw]">
          <span className="block">MOVE FAST.</span>
          <span className="block">COMMUNICATE</span>
          <span className="block">CLEARLY. BUILD THE</span>
          <span className="block">RECORD TOGETHER.</span>
        </h2>

        <div
          ref={pillarsRef}
          className="mt-12 grid grid-cols-1 border-y border-black/25 py-6 sm:mt-16 sm:grid-cols-3 sm:py-8 md:mt-24 md:py-10"
        >
          {WORK_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.index}
              className={`border-t border-black/25 pt-6 will-change-transform sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0 sm:first:border-l-0 sm:first:pl-0 ${
                idx !== 0 ? "mt-6 sm:mt-0" : ""
              }`}
            >
              <div className="font-mono text-[10px] tracking-[0.2em] text-black/50">
                {pillar.index}
              </div>
              <div className="mt-3 font-impact text-xl text-black md:text-2xl">
                {pillar.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(WorkWithUs);
