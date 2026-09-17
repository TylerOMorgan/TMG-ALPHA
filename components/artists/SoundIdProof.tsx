import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  SOUND_EYEBROW,
  SOUND_TITLE,
  SOUND_COPY,
  SOUND_GHOST,
  PROOF_CARDS,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const SoundIdProof: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ghostRef.current,
        { yPercent: 40, opacity: 0.35 },
        {
          yPercent: -5,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      const cards = cardsRef.current?.children;
      if (cards && cards.length) {
        gsap.fromTo(
          cards,
          { y: 70 },
          {
            y: -25,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  const getCardStyle = (idx: number) => {
    switch (idx) {
      case 0:
        return "border-t-2 border-trillex-signal/70 shadow-[0_0_25px_rgba(222,138,30,0.2)]";
      case 1:
        return "border-t-2 border-purple-500/80 shadow-[0_0_25px_rgba(168,85,247,0.3)] lg:-translate-y-3";
      case 2:
        return "border-t-2 border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.25)]";
      case 3:
        return "border-t-2 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.2)] lg:rotate-[1.5deg]";
      default:
        return "";
    }
  };

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-[#050505] pb-24 pt-20 md:pb-32 md:pt-28"
    >
      <div className="relative z-10 mx-auto max-w-[1840px] px-4 sm:px-6 md:px-10">
        <Eyebrow text={SOUND_EYEBROW} tone="dark" />
        <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-6 sm:gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="font-impact text-[9.5vw] leading-[1.0] text-trillex-paper sm:text-[8vw] lg:col-span-8 lg:text-[5.85vw]">
            <span className="block">ONE SOUND.</span>
            <span className="block">MILLIONS OF</span>
            <span className="block">VIDEOS.</span>
          </h2>
          <p className="max-w-md text-sm font-light leading-relaxed text-white/60 sm:text-base lg:col-span-4">
            {SOUND_COPY}
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-[1840px] px-4 sm:mt-10 sm:px-6 md:px-10">
        {/* Giant 5M+ background ghost watermark with parallax */}
        <div
          ref={ghostRef}
          aria-hidden="true"
          className="pointer-events-none select-none text-center font-impact text-[34vw] leading-[0.85] text-white/[0.05] will-change-transform md:text-[26vw]"
        >
          {SOUND_GHOST}
        </div>

        {/* 4 Landscape Proof Cards */}
        <div
          ref={cardsRef}
          className="relative z-10 -mt-[14vw] grid grid-cols-1 gap-4 sm:grid-cols-2 md:-mt-[9vw] md:gap-5 lg:grid-cols-4"
        >
          {PROOF_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className={`group relative overflow-hidden rounded-xl border border-white/10 bg-[#0C0C0C] will-change-transform transition-all duration-300 ${getCardStyle(
                idx,
              )}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />

                {/* Top Left Badges: TikTok dual-color pills on 0 & 1, Cyan dot on 2 & 3 */}
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.15em] text-white/80 backdrop-blur-md">
                  {idx <= 1 ? (
                    <span className="flex items-center -space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FE2C55] opacity-90" />
                    </span>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE]" />
                  )}
                  <span>{card.pill}</span>
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <div className="font-mono text-[9px] tracking-[0.2em] text-white/50">
                    {card.eyebrow}
                  </div>
                  <div className="mt-1 font-impact text-base leading-tight text-white md:text-lg">
                    {card.title}
                  </div>
                </div>
              </div>

              {/* Display Metrics & Footnotes */}
              <div className="border-t border-white/10 p-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-impact text-2xl text-white md:text-3xl">
                    {card.metric}
                  </div>
                  <div className="text-right font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/40 uppercase">
                    {card.caption}
                  </div>
                </div>
                {idx === 0 && (
                  <div className="mt-2 border-t border-white/5 pt-1.5 font-mono text-[7.5px] tracking-[0.12em] text-white/30 uppercase">
                    DATED PROOF BASELINES &bull; REFRESH EVERY SOURCE BEFORE PUBLIC USE
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SoundIdProof);
