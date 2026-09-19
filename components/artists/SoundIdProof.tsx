import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  SOUND_EYEBROW,
  SOUND_TITLE,
  SOUND_COPY,
  SOUND_GHOST,
  TIKTOK_VERIFIED_HITS,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

// Authentic TikTok SVG Logo Icon with dual-color offset effect
const TikTokIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
  </svg>
);

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
        { yPercent: 20, opacity: 0.25 },
        {
          yPercent: -10,
          opacity: 0.7,
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
          { y: 30 },
          {
            y: -10,
            ease: "none",
            stagger: 0.04,
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
      className="relative w-full overflow-hidden bg-[#050505] pb-20 pt-20 sm:pb-24 sm:pt-22 md:pb-28 md:pt-24 lg:pt-28"
    >
      {/* Giant 5M+ background ghost watermark with parallax */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[36%] select-none text-center font-impact text-[28vw] leading-none text-white/[0.04] will-change-transform md:text-[22vw]"
      >
        {SOUND_GHOST}
      </div>

      <div className="relative z-10 mx-auto max-w-[1840px] px-4 pt-1 sm:px-6 sm:pt-2 md:px-10 md:pt-2">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Eyebrow text={SOUND_EYEBROW} tone="dark" />
          <span className="flex items-center gap-1.5 rounded-full border border-[#00F2FE]/40 bg-black/60 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.16em] text-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.25)]">
            <TikTokIcon className="h-3 w-3 fill-[#00F2FE]" />
            <span>TIKTOK VERIFIED</span>
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 className="font-impact text-[8.5vw] leading-[0.98] tracking-tight text-trillex-paper sm:text-[6.5vw] md:text-[5vw] lg:text-[4vw] xl:text-[64px] 2xl:text-[76px]">
            <span className="block">ONE SOUND.</span>
            <span className="block">MILLIONS OF</span>
            <span className="block">VIDEOS.</span>
          </h2>
          <p className="max-w-md text-xs sm:text-sm font-light leading-relaxed text-white/60 sm:text-base lg:max-w-[340px] lg:shrink-0 xl:max-w-[400px]">
            {SOUND_COPY}
          </p>
        </div>
      </div>

      {/* 4 Clickable Verified Hits Cards */}
      <div
        ref={cardsRef}
        className="relative z-10 mx-auto mt-20 sm:mt-24 md:mt-36 lg:mt-44 xl:mt-48 max-w-[1840px] px-4 sm:px-6 md:px-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4"
      >
          {TIKTOK_VERIFIED_HITS.map((card, idx) => (
            <a
              key={card.id}
              href={card.soundUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${card.title} on TikTok`}
              className="group relative block overflow-hidden rounded-xl border border-white/10 bg-[#0C0C0C] will-change-transform transition-all duration-300 hover:-translate-y-2 hover:border-[#00F2FE]/70 hover:shadow-[0_12px_35px_rgba(0,242,254,0.25)] focus:outline-none focus:ring-2 focus:ring-[#00F2FE]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Top Left: Clear TikTok Branding Badge with dual-glow accents */}
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 font-mono text-[8.5px] tracking-[0.14em] text-white backdrop-blur-md transition-colors group-hover:border-[#00F2FE]/60">
                  <span className="flex items-center -space-x-1">
                    <span className="h-2 w-2 rounded-full bg-[#00F2FE]" />
                    <span className="h-2 w-2 rounded-full bg-[#FE2C55] opacity-90" />
                  </span>
                  <span className="font-semibold text-white/90">
                    TIKTOK SOUND
                  </span>
                </span>

                {/* Top Right: External link indicator icon */}
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 border border-white/15 text-white/70 backdrop-blur-md transition-all group-hover:scale-110 group-hover:text-[#00F2FE] group-hover:border-[#00F2FE]/60">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <div className="font-mono text-[9px] tracking-[0.2em] text-white/60">
                    {card.artist}
                  </div>
                  <div className="mt-1 font-impact text-base leading-tight text-white md:text-lg group-hover:text-white transition-colors">
                    {card.title}
                  </div>
                </div>
              </div>

              {/* Display Metrics & Click Prompt */}
              <div className="border-t border-white/10 p-3.5 bg-[#0C0C0C]">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-impact text-2xl text-white group-hover:text-[#00F2FE] transition-colors md:text-3xl">
                    {card.metric}
                  </div>
                  <div className="text-right font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/50 uppercase">
                    {card.caption}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[8px] tracking-[0.15em] text-[#00F2FE]/80 group-hover:text-[#00F2FE] uppercase transition-colors">
                  <span>{card.tag}</span>
                  <span className="flex items-center gap-1 font-bold">
                    <span>{card.subtext || "OPEN SOUND"}</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
    </section>
  );
};

export default React.memo(SoundIdProof);
