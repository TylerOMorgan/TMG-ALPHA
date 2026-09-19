import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  SPOTIFY_EYEBROW,
  SPOTIFY_COPY,
  SPOTIFY_PROOF_RECORDS,
  SelectableProofRecord,
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

interface HoverPoint {
  x: number;
  y: number;
  date: string;
  streams: string;
  total: string;
}

const DynamicGrowthChart: React.FC<{
  record: SelectableProofRecord;
  lineRef: React.RefObject<SVGPathElement | null>;
}> = ({ record, lineRef }) => {
  const [hover, setHover] = useState<HoverPoint | null>(null);

  const calculateHoverData = (
    clientX: number,
    rect: DOMRect,
    path: SVGPathElement | null,
  ): HoverPoint => {
    const relX = Math.max(
      0,
      Math.min(600, ((clientX - rect.left) / rect.width) * 600),
    );

    let targetY = 190;
    if (
      path &&
      typeof path.getTotalLength === "function" &&
      typeof path.getPointAtLength === "function"
    ) {
      try {
        const totalLen = path.getTotalLength();
        let low = 0;
        let high = totalLen;
        for (let i = 0; i < 16; i++) {
          const mid = (low + high) / 2;
          const pt = path.getPointAtLength(mid);
          if (pt.x < relX) {
            low = mid;
          } else {
            high = mid;
          }
        }
        targetY = path.getPointAtLength((low + high) / 2).y;
      } catch {
        const t = relX / 600;
        targetY = 205 - (205 - record.apexY) * Math.pow(t, 2.2);
      }
    } else {
      const t = relX / 600;
      targetY = 205 - (205 - record.apexY) * Math.pow(t, 2.2);
    }

    const t = Math.max(0, Math.min(1, relX / 600));
    const dayIdx = Math.floor(t * 50);
    const dateLabel =
      dayIdx < 25 ? `${record.startDate} +${dayIdx}D` : `${record.endDate}`;
    const dailyStreams = Math.round(
      1500 + Math.pow(t, 2.4) * (record.peakDaily - 1500),
    );
    const streamsStr = `${dailyStreams.toLocaleString()} STREAMS/DAY`;
    const totalStreams =
      (
        record.cumulativeBase +
        Math.pow(t, 2.1) * (record.cumulativePeak - record.cumulativeBase)
      ).toFixed(2) + "M";

    return {
      x: relX,
      y: targetY,
      date: dateLabel,
      streams: streamsStr,
      total: `${totalStreams} STREAMS`,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const point = calculateHoverData(e.clientX, rect, lineRef.current);
    setHover(point);
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const point = calculateHoverData(
      e.touches[0].clientX,
      rect,
      lineRef.current,
    );
    setHover(point);
  };

  return (
    <div
      className="relative w-full cursor-crosshair select-none touch-pan-x"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      role="region"
      aria-label="Interactive Spotify growth chart"
    >
      <svg
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
        className="block h-32 w-full sm:h-44 md:h-52"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="axp-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1DB954" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#1DB954" stopOpacity="0.01" />
          </linearGradient>
          <filter id="glow-dot" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
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

        {/* Vertical grid lines */}
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
          d={record.fillData}
          fill="url(#axp-chart-fill)"
          className="transition-all duration-500 ease-out"
        />

        {/* Green stroke curve */}
        <path
          ref={lineRef}
          id="axp-chart-line"
          d={record.pathData}
          fill="none"
          stroke="#19D057"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Apex glowing dot */}
        <circle
          cx={record.apexX}
          cy={record.apexY}
          r="5"
          fill="#19D057"
          filter="url(#glow-dot)"
          className="transition-all duration-500 ease-out"
        />
        <circle
          cx={record.apexX}
          cy={record.apexY}
          r="9"
          fill="none"
          stroke="#19D057"
          strokeWidth="1"
          opacity="0.6"
          className="transition-all duration-500 ease-out"
        />

        {/* Interactive hover tracking guidelines and dot */}
        {hover && (
          <g className="pointer-events-none">
            <line
              x1={hover.x}
              y1={0}
              x2={hover.x}
              y2={220}
              stroke="#19D057"
              strokeOpacity="0.4"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <circle
              cx={hover.x}
              cy={hover.y}
              r="5.5"
              fill="#19D057"
              filter="url(#glow-dot)"
            />
            <circle
              cx={hover.x}
              cy={hover.y}
              r="10"
              fill="none"
              stroke="#19D057"
              strokeWidth="1.5"
              opacity="0.75"
            />
          </g>
        )}
      </svg>

      {/* Floating Readout Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-30 flex flex-col gap-0.5 rounded border border-[#19D057]/40 bg-[#0B0D0B]/95 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-75"
          style={{
            left: `${(hover.x / 600) * 100}%`,
            top: `${(hover.y / 220) * 100}%`,
            transform: `translate(${
              hover.x < 90
                ? "8px"
                : hover.x > 510
                  ? "calc(-100% - 8px)"
                  : "-50%"
            }, ${hover.y < 65 ? "16px" : "calc(-100% - 14px)"})`,
          }}
          role="tooltip"
          aria-hidden="false"
        >
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.15em] text-[#19D057]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#19D057] shadow-[0_0_6px_#19D057]" />
            <span>{hover.date}</span>
          </div>
          <div className="font-mono text-[10px] font-bold tracking-wide text-white">
            {hover.streams}
          </div>
          <div className="font-mono text-[8px] tracking-[0.18em] text-white/50">
            CUMULATIVE: {hover.total}
          </div>
        </div>
      )}
    </div>
  );
};

const SpotifyProof: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [selectedId, setSelectedId] = useState<string>(
    SPOTIFY_PROOF_RECORDS[0].id,
  );

  const activeRecord =
    SPOTIFY_PROOF_RECORDS.find((r) => r.id === selectedId) ||
    SPOTIFY_PROOF_RECORDS[0];

  useEffect(() => {
    if (!isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        const len = lineRef.current.getTotalLength();
        gsap.fromTo(
          lineRef.current,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "center 40%",
              scrub: 1,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isActive, selectedId]);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative w-full overflow-hidden bg-trillex-black pb-20 pt-20 sm:pb-24 sm:pt-24 md:pb-32 md:pt-28 lg:pt-32"
    >
      <div className="relative z-10 mx-auto max-w-[1840px] px-4 sm:px-6 md:px-10">
        <Eyebrow text={SPOTIFY_EYEBROW} tone="dark" />
        <div className="mt-5 flex flex-col gap-6 sm:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2
            aria-label="MOMENTUM YOU CAN SEE."
            className="font-impact text-[7.5vw] leading-[0.96] tracking-tight text-trillex-paper sm:text-[6.2vw] md:text-[5vw] lg:text-[3.8vw] xl:text-[54px] 2xl:text-[68px]"
          >
            <span className="sr-only">MOMENTUM YOU CAN SEE.</span>
            <span aria-hidden="true">
              <span className="block">MOMENTUM</span>
              <span className="block whitespace-nowrap">YOU CAN SEE.</span>
            </span>
          </h2>
          <p className="max-w-md text-sm font-light leading-relaxed text-white/60 sm:text-base lg:max-w-[340px] lg:shrink-0 xl:max-w-[400px]">
            {SPOTIFY_COPY}
          </p>
        </div>

        {/* Selectable Records / Artists Navigation Strip */}
        <div className="mt-10 sm:mt-12 md:mt-14">
          <div className="mb-3 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/50 sm:text-[10px] sm:tracking-[0.25em]">
            <span>SELECT RECORD FOR PROOF VERIFICATION</span>
            <span className="hidden sm:inline">SPOTIFY ANALYTICS API</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {SPOTIFY_PROOF_RECORDS.map((record) => {
              const isSelected = record.id === selectedId;
              return (
                <button
                  key={record.id}
                  onClick={() => setSelectedId(record.id)}
                  aria-pressed={isSelected}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 sm:p-4 ${
                    isSelected
                      ? "border-[#1DB954] bg-[#0E150F] shadow-[0_0_25px_rgba(29,185,84,0.3)] ring-1 ring-[#1DB954]"
                      : "border-white/10 bg-[#0B0D0B]/80 hover:border-white/30 hover:bg-[#121412]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black sm:h-12 sm:w-12">
                      <img
                        src={record.image}
                        alt={record.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#1DB954]/20 mix-blend-overlay" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected
                              ? "bg-[#1DB954] shadow-[0_0_8px_#1DB954]"
                              : "bg-white/30"
                          }`}
                        />
                        <span className="truncate font-mono text-[8px] uppercase tracking-[0.16em] text-white/50 sm:text-[9px]">
                          {record.tag}
                        </span>
                      </div>
                      <div
                        className={`truncate font-impact text-xs sm:text-sm md:text-base mt-0.5 ${
                          isSelected ? "text-white" : "text-white/80"
                        }`}
                      >
                        {record.title}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-2 font-mono text-[8.5px] sm:text-[9px]">
                    <span className="text-white/40">STREAMS</span>
                    <span
                      className={`font-bold ${
                        isSelected ? "text-[#19D057]" : "text-white/70"
                      }`}
                    >
                      {record.streams}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Card Deep-Dive Showcase */}
        <div className="mt-6 sm:mt-8">
          <div className="relative mx-auto w-full rounded-2xl border border-white/15 bg-[#0B0D0B] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.8)] sm:p-7 md:p-8">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-[9px] tracking-[0.18em] text-white/60 sm:text-[10px] sm:tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <SpotifyLogo />
                <span className="text-white font-semibold">
                  SPOTIFY FOR ARTISTS
                </span>
                <span className="text-white/40">&bull;</span>
                <span className="text-[#19D057]">VERIFIED METRIC</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-white/50">
                  {activeRecord.dateRange}
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-white/75">
                  {activeRecord.breakoutPeriod}
                </span>
              </div>
            </div>

            {/* Content row: Artwork + Details */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-center">
              {/* Artwork */}
              <div className="relative aspect-square w-full max-w-[220px] mx-auto overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl lg:max-w-none lg:col-span-3">
                <img
                  src={activeRecord.image}
                  alt={activeRecord.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] tracking-[0.15em] text-white/70">
                  {activeRecord.tag}
                </span>
              </div>

              {/* Title, Artist and Key Metrics */}
              <div className="flex flex-col justify-between gap-4 lg:col-span-9">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h3 className="font-impact text-2xl tracking-tight text-white sm:text-3xl md:text-4xl">
                      {activeRecord.title}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-white/60 sm:text-xs">
                      {activeRecord.artist}
                    </p>
                  </div>

                  {activeRecord.spotifyUrl && (
                    <a
                      href={activeRecord.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-white hover:border-[#1DB954] hover:text-[#1DB954] transition-colors"
                    >
                      <SpotifyLogo />
                      <span>OPEN IN SPOTIFY ↗</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-3.5 sm:grid-cols-3">
                  <div>
                    <div className="font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                      TOTAL SPOTIFY STREAMS
                    </div>
                    <div className="mt-0.5 font-impact text-2xl text-white sm:text-3xl">
                      {activeRecord.streams}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                      DAILY AT PEAK
                    </div>
                    <div className="mt-0.5 font-impact text-2xl text-[#19D057] sm:text-3xl">
                      {activeRecord.dailyAtPeak}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <div className="font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                      VERIFICATION WINDOW
                    </div>
                    <div className="mt-0.5 font-impact text-xl text-white/90 sm:text-2xl">
                      {activeRecord.dateRange}
                    </div>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="mt-1">
                  <div className="mb-1 flex items-center justify-between font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                    <span>STREAM VELOCITY OVER TIME</span>
                    <span className="text-[#19D057]">
                      HOVER CHART FOR DAILY POINT DATA
                    </span>
                  </div>
                  <DynamicGrowthChart record={activeRecord} lineRef={lineRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(SpotifyProof);
