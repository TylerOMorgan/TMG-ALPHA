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

const ArtistCell: React.FC<{
  name: string;
  image: string;
  objectPosition?: string;
}> = ({ name, image, objectPosition = "center center" }) => (
  <div className="group relative w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px] shrink-0 aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-white/5">
    <img
      src={image}
      alt={name}
      loading="lazy"
      decoding="async"
      style={{ objectPosition }}
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <span className="absolute bottom-3 left-3.5 font-impact text-sm tracking-wide text-white sm:text-base md:text-lg">
      {name}
    </span>
    <SpotifyBadge />
  </div>
);

const ArtistsHero: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Triple items for seamless scroll-driven marquee across any screen resolution
  const row1Items = [
    ...EXPLORE_ARTISTS,
    ...EXPLORE_ARTISTS,
    ...EXPLORE_ARTISTS,
  ];
  const row2Items = [
    ...EXPLORE_ROW_2,
    ...EXPLORE_ROW_2,
    ...EXPLORE_ROW_2,
  ];

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const r1Travel = isMobile ? -180 : -320;
      const r2Travel = isMobile ? 180 : 320;
      const r1Start = isMobile ? 0 : -30;
      const r2Start = isMobile ? -60 : -120;

      gsap.to(titleRef.current, {
        yPercent: isMobile ? 8 : 14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Row 1 marquee scrub (moves left as user scrolls down)
      if (row1Ref.current) {
        gsap.fromTo(
          row1Ref.current,
          { x: r1Start },
          {
            x: r1Start + r1Travel,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }

      // Row 2 marquee scrub (starts slightly offset left, moves right as user scrolls down)
      if (row2Ref.current) {
        gsap.fromTo(
          row2Ref.current,
          { x: r2Start },
          {
            x: r2Start + r2Travel,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
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
      className="relative w-full bg-trillex-black pb-12 pt-28 sm:pt-32 md:pb-16 md:pt-36"
    >
      <div className="mx-auto max-w-[1840px] px-4 sm:px-6 md:px-10">
        <Eyebrow text={HERO_EYEBROW} tone="dark" />

        <div className="mt-4 flex flex-col gap-6 lg:mt-6 lg:flex-row lg:items-end lg:justify-between">
          <h1
            ref={titleRef}
            className="font-impact text-[18vw] leading-[0.88] tracking-tight text-trillex-paper will-change-transform sm:text-[14vw] md:text-[11vw] lg:text-[104px] xl:text-[124px] 2xl:text-[140px]"
          >
            {HERO_TITLE}
          </h1>
          <div className="max-w-md pb-1 text-left lg:max-w-[340px] lg:pb-3 lg:shrink-0 xl:max-w-[380px]">
            <p className="text-sm font-bold leading-snug text-white sm:text-base md:text-lg">
              {HERO_COPY_HEAD}
            </p>
            <p className="mt-1 text-sm font-light leading-snug text-white/60 sm:text-base md:text-lg">
              {HERO_COPY_TAIL}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-y-6 border-y border-white/15 py-6 sm:mt-10 sm:py-7 md:mt-12 md:grid-cols-4">
          {HERO_STATS.map((s, idx) => (
            <div
              key={s.label}
              className={`md:border-l md:border-white/15 md:pl-10 md:first:border-l-0 md:first:pl-0 ${
                idx % 2 === 1
                  ? "border-l border-white/15 pl-5 sm:pl-6 md:border-l md:pl-10"
                  : "pr-3 sm:pr-4 md:pr-0"
              }`}
            >
              <div className="font-impact text-2xl text-trillex-paper sm:text-3xl md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 font-mono text-[9px] tracking-[0.18em] text-white/50 sm:mt-2.5 sm:text-[10px] sm:tracking-[0.22em]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 md:mt-24">
          <div className="mb-3.5 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/50 sm:text-[10px] sm:tracking-[0.25em]">
            <span>EXPLORE ARTISTS</span>
            <span>TWO WORLDS &bull; ONE GROUP</span>
          </div>

          <div
            ref={marqueeRef}
            className="-mx-4 overflow-hidden space-y-2.5 will-change-transform sm:-mx-6 md:-mx-10 md:space-y-3.5"
          >
            <div
              ref={row1Ref}
              className="flex gap-2.5 will-change-transform md:gap-3.5"
            >
              {row1Items.map((a, idx) => (
                <ArtistCell
                  key={`${a.id}-r1-${idx}`}
                  name={a.name}
                  image={a.image}
                  objectPosition={a.objectPosition}
                />
              ))}
            </div>
            <div
              ref={row2Ref}
              className="flex gap-2.5 will-change-transform md:gap-3.5"
            >
              {row2Items.map((a, idx) => (
                <ArtistCell
                  key={`${a.id}-r2-${idx}`}
                  name={a.name}
                  image={a.image}
                  objectPosition={a.objectPosition}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-3.5 font-mono text-[8.5px] tracking-[0.18em] text-white/45 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-4 sm:text-[10px] sm:tracking-[0.25em]">
            <span>CONCEPT ARTIST IMAGERY</span>
            <span>FINAL ROSTER APPROVAL REQUIRED</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ArtistsHero);

