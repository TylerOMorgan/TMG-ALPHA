import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  HERO_EYEBROW,
  HERO_TITLE,
  HERO_STATS,
  EXPLORE_ARTISTS,
  EXPLORE_ROW_2,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const SpotifyButton: React.FC<{ url?: string; name: string }> = ({
  url,
  name,
}) => (
  <a
    href={url || "https://open.spotify.com"}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    aria-label={`Listen to ${name} on Spotify`}
    className="absolute bottom-2.5 right-2.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#1DB954] hover:bg-[#1DB954]/25 hover:shadow-[0_0_16px_rgba(29,185,84,0.6)] active:scale-95 group/btn z-10"
  >
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white transition-colors duration-300 group-hover/btn:text-[#1DB954]"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-.35.105-.72-.09-.825-.44-.105-.35.09-.72.44-.825 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.413.125-.85-.11-.975-.523-.125-.413.11-.85.523-.975 4.267-1.295 11.328-1.047 15.795 1.604.372.221.493.704.272 1.076-.221.372-.704.493-1.076.272z" />
    </svg>
  </a>
);

const ArtistCell: React.FC<{
  name: string;
  image: string;
  spotifyUrl?: string;
  objectPosition?: string;
}> = ({ name, image, spotifyUrl, objectPosition = "center center" }) => (
  <div className="group relative w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px] shrink-0 aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] group-hover:-translate-y-1 group-hover:border-white/30 select-none">
    <img
      src={image}
      alt={name}
      loading="lazy"
      decoding="async"
      style={{ objectPosition }}
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
    <span className="absolute bottom-2.5 left-3 sm:bottom-3 sm:left-3.5 font-impact text-sm tracking-wide text-white sm:text-base md:text-lg pointer-events-none pr-11 sm:pr-12 truncate max-w-[85%]">
      {name}
    </span>
    <SpotifyButton url={spotifyUrl} name={name} />
  </div>
);

const ArtistsHero: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Quadruple items to ensure seamless infinite auto-scroll across any resolution
  const row1Items = [
    ...EXPLORE_ARTISTS,
    ...EXPLORE_ARTISTS,
    ...EXPLORE_ARTISTS,
    ...EXPLORE_ARTISTS,
  ];
  const row2Items = [
    ...EXPLORE_ROW_2,
    ...EXPLORE_ROW_2,
    ...EXPLORE_ROW_2,
    ...EXPLORE_ROW_2,
  ];

  useEffect(() => {
    if (!isActive) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Subtle parallax on the ARTISTS title
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

      // Continuous bidirectional marquee animations
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Row 1 moves smoothly right-to-left
        const tween1 = gsap.to(row1Ref.current, {
          xPercent: -50,
          duration: isMobile ? 26 : 38,
          ease: "none",
          repeat: -1,
        });

        // Row 2 moves smoothly left-to-right (opposite direction)
        const tween2 = gsap.fromTo(
          row2Ref.current,
          { xPercent: -50 },
          {
            xPercent: 0,
            duration: isMobile ? 28 : 40,
            ease: "none",
            repeat: -1,
          },
        );

        // Pause on hover with smooth deceleration
        const container = marqueeRef.current;
        if (container) {
          const onEnter = () => {
            gsap.to([tween1, tween2], { timeScale: 0, duration: 0.35 });
          };
          const onLeave = () => {
            gsap.to([tween1, tween2], { timeScale: 1, duration: 0.35 });
          };

          container.addEventListener("mouseenter", onEnter);
          container.addEventListener("mouseleave", onLeave);

          return () => {
            container.removeEventListener("mouseenter", onEnter);
            container.removeEventListener("mouseleave", onLeave);
          };
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative w-full bg-trillex-black pb-12 pt-32 sm:pt-36 md:pb-16 md:pt-44 lg:pt-48"
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
          </div>

          <div
            ref={marqueeRef}
            className="-mx-4 overflow-hidden space-y-2.5 will-change-transform sm:-mx-6 md:-mx-10 md:space-y-3.5 cursor-grab active:cursor-grabbing"
          >
            <div
              ref={row1Ref}
              className="flex w-fit gap-2.5 will-change-transform md:gap-3.5"
            >
              {row1Items.map((a, idx) => (
                <ArtistCell
                  key={`${a.id}-r1-${idx}`}
                  name={a.name}
                  image={a.image}
                  spotifyUrl={a.spotifyUrl}
                  objectPosition={a.objectPosition}
                />
              ))}
            </div>
            <div
              ref={row2Ref}
              className="flex w-fit gap-2.5 will-change-transform md:gap-3.5"
            >
              {row2Items.map((a, idx) => (
                <ArtistCell
                  key={`${a.id}-r2-${idx}`}
                  name={a.name}
                  image={a.image}
                  spotifyUrl={a.spotifyUrl}
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

