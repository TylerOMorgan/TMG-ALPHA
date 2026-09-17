import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  HERO_EYEBROW,
  HERO_TITLE,
  HERO_COPY_HEAD,
  HERO_COPY_TAIL,
  HERO_STATS,
  EXPLORE_ARTISTS,
  EXPLORE_ROW_2,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const SpotifyBadge: React.FC = () => (
  <span className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-sm">
    <svg viewBox="0 0 24 24" fill="white" className="h-3 w-3 opacity-90">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-.35.105-.72-.09-.825-.44-.105-.35.09-.72.44-.825 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.413.125-.85-.11-.975-.523-.125-.413.11-.85.523-.975 4.267-1.295 11.328-1.047 15.795 1.604.372.221.493.704.272 1.076-.221.372-.704.493-1.076.272z" />
    </svg>
  </span>
);

const ArtistCell: React.FC<{ name: string; image: string }> = ({
  name,
  image,
}) => (
  <div className="group relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-white/5">
    <img
      src={image}
      alt={name}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <span className="absolute bottom-3 left-3.5 font-impact text-base tracking-wide text-white md:text-lg">
      {name}
    </span>
    <SpotifyBadge />
  </div>
);

const ArtistsHero: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current,
          { y: 30 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: gridRef.current,
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
      className="relative w-full bg-trillex-black pt-24 md:pt-28"
    >
      <div className="mx-auto max-w-[1840px] px-5 md:px-10">
        <Eyebrow text={HERO_EYEBROW} tone="dark" />

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <h1
            ref={titleRef}
            className="font-impact text-[19vw] leading-[0.9] text-trillex-paper will-change-transform lg:col-span-8 lg:text-[11.7vw]"
          >
            {HERO_TITLE}
          </h1>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="text-base font-bold text-white md:text-lg">
              {HERO_COPY_HEAD}
            </p>
            <p className="mt-1 text-base font-light text-white/50 md:text-lg">
              {HERO_COPY_TAIL}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-y-8 border-y border-white/15 py-7 md:mt-12 md:grid-cols-4">
          {HERO_STATS.map((s, idx) => (
            <div
              key={s.label}
              className={`md:border-l md:border-white/15 md:pl-10 md:first:border-l-0 md:first:pl-0 ${
                idx % 2 === 1
                  ? "border-l border-white/15 pl-6 md:border-l md:pl-10"
                  : "pr-4 md:pr-0"
              }`}
            >
              <div className="font-impact text-[28px] text-trillex-paper md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2.5 font-mono text-[10px] tracking-[0.22em] text-white/40">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24">
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/40">
            <span>EXPLORE ARTISTS</span>
            <span className="hidden md:inline">
              TWO WORLDS &bull; ONE GROUP
            </span>
          </div>

          <div ref={gridRef} className="space-y-2.5 will-change-transform md:space-y-3.5">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3.5 lg:grid-cols-6">
              {EXPLORE_ARTISTS.map((a) => (
                <ArtistCell key={a.id} name={a.name} image={a.image} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3.5 lg:grid-cols-6">
              {EXPLORE_ROW_2.map((a) => (
                <ArtistCell key={a.id} name={a.name} image={a.image} />
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-4 font-mono text-[10px] tracking-[0.25em] text-white/40">
            <span>CONCEPT ARTIST IMAGERY</span>
            <span>FINAL ROSTER APPROVAL REQUIRED</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ArtistsHero);
