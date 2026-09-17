import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  RECORDS_TITLE,
  RECORDS,
  RECORDS_EYEBROW,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const RecordsRail: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !desktop) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;
      const getTravel = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 100);
      gsap.to(track, {
        x: () => -getTravel(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${getTravel()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      className="relative w-full overflow-hidden bg-[#EBE7DD]"
    >
      <div ref={pinRef}>
        <div className="mx-auto max-w-[1840px] px-4 pb-20 pt-16 sm:px-6 sm:pt-20 md:px-10 md:pb-32 md:pt-32 lg:pt-36">
          <Eyebrow text={RECORDS_EYEBROW} tone="light" />
          <h2 className="mt-5 max-w-[16ch] font-impact text-[9.5vw] leading-[1.0] text-trillex-ink sm:mt-6 sm:text-[8vw] md:text-[5.6vw]">
            {RECORDS_TITLE}
          </h2>

          <div className="mt-10 sm:mt-12 md:mt-16">
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-4 will-change-transform [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:snap-none md:gap-7 md:overflow-visible"
            >
              {RECORDS.map((record) => (
                <div
                  key={record.index}
                  className="w-[78vw] shrink-0 snap-start sm:w-[48vw] md:w-[420px] md:shrink-0"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[4px] bg-trillex-ink/5">
                    <img
                      src={record.image}
                      alt={record.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />
                    <span className="absolute left-3 top-2.5 font-mono text-[10px] tracking-[0.2em] text-white/85">
                      {record.index}
                    </span>
                    <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] text-trillex-signal">
                      {record.lane}
                    </span>
                  </div>
                  <div className="mt-3.5 font-impact text-lg uppercase leading-snug text-trillex-ink md:text-xl">
                    {record.title}
                  </div>
                  <div className="mt-3 border-t border-trillex-ink/15 pt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-trillex-ink/40">
                    APPROVED PROOF CANDIDATE
                  </div>
                </div>
              ))}
              {/* End spacer for right settling */}
              <div
                className="hidden w-[60px] shrink-0 md:block"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(RecordsRail);
