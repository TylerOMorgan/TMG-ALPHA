import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import { getSoundTitleLines } from "../../utils/soundIdPresentation";
import {
  SOUND_EYEBROW,
  SOUND_TITLE,
  SOUND_GHOST,
  PROOF_CARDS,
} from "../../utils/artists2ExperienceData";

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

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-[#050505] pb-24 pt-24 sm:pt-28 md:pb-32 md:pt-36 lg:pt-40"
    >
      <div className="relative z-10 mx-auto max-w-[1840px] px-4 sm:px-6 md:px-10">
        <Eyebrow text={SOUND_EYEBROW} tone="dark" />
        <div className="mt-5 flex flex-col gap-6 sm:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 className="font-impact text-[8vw] leading-[0.98] tracking-tight text-trillex-paper sm:text-[6.8vw] md:text-[5.5vw] lg:text-[4.6vw] xl:text-[72px] 2xl:text-[84px]">
            <span className="block">ONE SOUND,</span>
            <span className="block">MILLIONS OF</span>
            <span className="block">VIDEOS.</span>
          </h2>
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
          {PROOF_CARDS.map((card) => (
            <div
              key={card.id}
              className="sound-id-card group relative overflow-hidden rounded-xl border bg-[#0C0C0C] will-change-transform transition-all duration-300"
              style={{ "--sound-accent": card.accentColor } as React.CSSProperties}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                />

              </div>
              <div className="px-3.5 py-3.5">
                <div className="font-mono text-[9px] tracking-[0.2em] text-white/50">
                  {card.eyebrow}
                </div>
                <div className="mt-1 font-impact text-base leading-tight text-white md:text-lg">
                  {getSoundTitleLines(card.title).map((line) => (
                    <span key={line} className="block whitespace-nowrap">{line}</span>
                  ))}
                </div>
              </div>

              {/* Display Metrics & Footnotes */}
              <div className="border-t border-white/10 p-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-impact text-2xl text-[var(--sound-accent)] md:text-3xl">
                    {card.metric}
                  </div>
                  <div className="text-right font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/40 uppercase">
                    {card.caption}
                  </div>
                </div>
                <a href={card.soundUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${card.title} on TikTok`} className="mt-3 inline-block font-mono text-[9px] text-white/70 hover:text-white">
                  LISTEN ON TIKTOK ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SoundIdProof);
