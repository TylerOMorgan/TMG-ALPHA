import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  SPOTIFY_EYEBROW,
  SPOTIFY_COPY,
  SPOTIFY_CALLOUT,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const SpotifyLogo = () => (
  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1DB954]">
    <svg viewBox="0 0 24 24" fill="black" className="h-2.5 w-2.5">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-.35.105-.72-.09-.825-.44-.105-.35.09-.72.44-.825 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.413.125-.85-.11-.975-.523-.125-.413.11-.85.523-.975 4.267-1.295 11.328-1.047 15.795 1.604.372.221.493.704.272 1.076-.221.372-.704.493-1.076.272z" />
    </svg>
  </span>
);

const GrowthChart: React.FC<{ lineRef: React.RefObject<SVGPathElement | null> }> = ({
  lineRef,
}) => (
  <svg
    viewBox="0 0 600 220"
    preserveAspectRatio="none"
    className="block h-32 w-full md:h-44"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="axp-chart-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1DB954" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
      </linearGradient>
      <filter id="glow-dot" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Grid lines: 4 horizontal */}
    {[40, 85, 130, 175].map((y) => (
      <line
        key={y}
        x1="0"
        y1={y}
        x2="600"
        y2={y}
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />
    ))}
    {/* Grid lines: 5 vertical */}
    {[100, 200, 300, 400, 500].map((x) => (
      <line
        key={x}
        x1={x}
        y1="0"
        x2={x}
        y2="220"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />
    ))}
    {/* Area fill beneath curve */}
    <path
      d="M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25 L600,220 L0,220 Z"
      fill="url(#axp-chart-fill)"
    />
    {/* Dynamic green stroke curve */}
    <path
      ref={lineRef}
      id="axp-chart-line"
      d="M0,205 C90,200 130,190 190,182 C260,172 300,190 360,165 C420,140 470,90 545,45 L600,25"
      fill="none"
      stroke="#19D057"
      strokeWidth="2.5"
    />
    {/* Glowing apex dot */}
    <circle cx="598" cy="25" r="5" fill="#19D057" filter="url(#glow-dot)" />
    <circle cx="598" cy="25" r="9" fill="none" stroke="#19D057" strokeWidth="1" opacity="0.6" />
  </svg>
);

const SpotifyProof: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const cards = fanRef.current?.children;
      if (!cards || cards.length < 3) return;
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "center 35%",
          scrub: true,
        },
      });
      // cards[0]: Left background card (ARTIST ()
      tl.fromTo(
        cards[0],
        { y: isMobile ? 160 : 220, rotation: -7, x: -20 },
        { y: isMobile ? 80 : 120, rotation: -4, x: isMobile ? -45 : -110, ease: "none" },
        0,
      );
      // cards[1]: Right background card (GROWTH 02)
      tl.fromTo(
        cards[1],
        { y: isMobile ? 140 : 190, rotation: 5, x: 20 },
        { y: isMobile ? 50 : 60, rotation: 2.5, x: isMobile ? 45 : 90, ease: "none" },
        0,
      );
      // cards[2]: Center foreground card (MIMIMI HARDTEKK)
      tl.fromTo(
        cards[2],
        { y: isMobile ? 80 : 120, scale: 0.96 },
        { y: 0, scale: 1, ease: "none" },
        0,
      );

      if (lineRef.current) {
        const len = lineRef.current.getTotalLength();
        gsap.fromTo(
          lineRef.current,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "center 40%",
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
      className="relative w-full overflow-hidden bg-trillex-black pb-24 pt-16 sm:pb-28 sm:pt-20 md:pb-40 md:pt-28"
    >
      <div className="relative z-10 mx-auto max-w-[1840px] px-4 sm:px-6 md:px-10">
        <Eyebrow text={SPOTIFY_EYEBROW} tone="dark" />
        <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-6 sm:gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="font-impact text-[9.5vw] leading-[0.98] text-trillex-paper sm:text-[8.5vw] lg:col-span-8 lg:text-[6.15vw]">
            <span className="block">MOMENTUM</span>
            <span className="block whitespace-nowrap">YOU CAN SEE.</span>
          </h2>
          <p className="max-w-md text-sm font-light leading-relaxed text-white/60 sm:text-base lg:col-span-4">
            {SPOTIFY_COPY}
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-[1600px] px-4 sm:mt-14 sm:px-6 md:mt-20 md:px-10">
        <div
          ref={fanRef}
          className="relative mx-auto min-h-[420px] w-full max-w-[980px] will-change-transform sm:min-h-[480px] md:min-h-[540px]"
        >
          {/* Back Left Card: ARTIST ( */}
          <div className="absolute inset-x-[2%] top-0 z-0 rounded-xl border border-white/10 bg-[#0B0D0B]/95 p-4 will-change-transform sm:inset-x-[4%] sm:p-5 md:p-6">
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-white/50 sm:text-[10px] sm:tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <SpotifyLogo /> SPOTIFY FOR ARTISTS
              </span>
            </div>
            <div className="mt-5 font-impact text-xl text-white/70 sm:mt-7 sm:text-2xl md:text-3xl">
              ARTIST (
            </div>
            {/* SVG curve for Left background card */}
            <div className="mt-3 h-20 overflow-hidden sm:mt-4 sm:h-24 md:h-28">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="h-full w-full opacity-60">
                <defs>
                  <linearGradient id="bg-chart-left" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1DB954" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,110 C80,105 140,95 200,80 C260,60 320,30 400,15 L400,120 L0,120 Z" fill="url(#bg-chart-left)" />
                <path d="M0,110 C80,105 140,95 200,80 C260,60 320,30 400,15" fill="none" stroke="#1DB954" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Back Right Card: GROWTH 02 */}
          <div className="absolute inset-x-[2%] top-0 z-10 ml-auto w-[90%] rounded-xl border border-white/10 bg-[#0B0D0B]/95 p-4 will-change-transform sm:inset-x-[4%] sm:w-[86%] sm:p-5 md:p-6">
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-white/50 sm:text-[10px] sm:tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <SpotifyLogo /> SPOTIFY FOR ARTISTS
              </span>
              <span className="hidden md:inline">SVG MOTION STUDY</span>
            </div>
            <div className="mt-5 text-right font-impact text-xl text-white/70 sm:mt-7 sm:text-2xl md:text-3xl">
              GROWTH 02
            </div>
            {/* SVG curve for Right background card */}
            <div className="mt-3 h-20 overflow-hidden sm:mt-4 sm:h-24 md:h-28">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="h-full w-full opacity-60">
                <defs>
                  <linearGradient id="bg-chart-right" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1DB954" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,115 C100,110 180,100 240,65 C300,30 350,15 400,10 L400,120 L0,120 Z" fill="url(#bg-chart-right)" />
                <path d="M0,115 C100,110 180,100 240,65 C300,30 350,15 400,10" fill="none" stroke="#1DB954" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Center Foreground Card: MIMIMI HARDTEKK */}
          <div className="absolute inset-x-0 top-0 z-20 mx-auto w-full max-w-[760px] rounded-xl border border-white/10 bg-[#0B0D0B] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)] will-change-transform sm:p-5 md:p-7">
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-white/60 sm:text-[10px] sm:tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <SpotifyLogo /> SPOTIFY FOR ARTISTS
              </span>
              <span className="hidden sm:inline">DATED PROOF SNAPSHOT</span>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h3 className="font-impact text-xl tracking-tight text-white sm:text-2xl md:text-3xl">
                MIMIMI HARDTEKK
              </h3>
              <div className="flex gap-5 sm:gap-6 text-left sm:text-right">
                <div>
                  <div className="font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                    SPOTIFY STREAMS
                  </div>
                  <div className="font-impact text-lg text-white sm:text-xl">6M+</div>
                </div>
                <div>
                  <div className="font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                    DAILY AT SNAPSHOT
                  </div>
                  <div className="font-impact text-lg text-white sm:text-xl">54K</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 text-right font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                BREAKOUT MOMENT
              </div>
              <GrowthChart lineRef={lineRef} />
            </div>
          </div>
        </div>

        {/* Proof Callout Block (Bottom-Right) with 180px orange accent bar */}
        <div className="mt-10 flex justify-end sm:mt-12 md:mr-[8%] md:mt-16">
          <div className="w-full max-w-[340px] text-left">
            <div className="h-[2px] w-[180px] bg-trillex-signal" />
            <h4 className="mt-3 text-sm sm:text-base font-bold text-white">
              {SPOTIFY_CALLOUT.title}
            </h4>
            <p className="mt-1 text-xs font-light leading-relaxed text-white/60">
              {SPOTIFY_CALLOUT.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(SpotifyProof);
