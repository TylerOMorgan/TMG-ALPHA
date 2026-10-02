import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Eyebrow from "./Eyebrow";
import {
  SPOTIFY_EYEBROW,
  SPOTIFY_PROOF_RECORDS,
  SelectableProofRecord,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

const toTitleCase = (value: string): string =>
  value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

interface SectionProps {
  isActive?: boolean;
}

const SpotifyLogo = () => (
  <img
    src="/spotify-for-artists.png"
    alt="Spotify for Artists"
    className="h-6 w-6 rounded-full object-cover"
  />
);

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Snap to each calendar day, including the record's start and end dates.
const dailyPointAtProgress = (
  start: string,
  end: string,
  t: number,
): { date: string; progress: number } => {
  const parse = (s: string): { day: number; mon: number } | null => {
    const m = s
      .trim()
      .toUpperCase()
      .match(/^(\d{1,2})\s+([A-Z]{3})$/);
    if (!m) return null;
    const mon = MONTHS.indexOf(m[2]);
    if (mon < 0) return null;
    return { day: parseInt(m[1], 10), mon };
  };
  const s = parse(start);
  const e = parse(end);
  if (!s || !e) return { date: start, progress: 0 };
  let span = 0;
  {
    let d = s.day;
    let m = s.mon;
    while (d !== e.day || m !== e.mon) {
      d++;
      span++;
      if (d > MONTH_DAYS[m]) {
        d = 1;
        m = (m + 1) % 12;
      }
      if (span > 366) break;
    }
  }
  const offset = Math.round(Math.max(0, Math.min(1, t)) * span);
  let d = s.day;
  let m = s.mon;
  for (let i = 0; i < offset; i++) {
    d++;
    if (d > MONTH_DAYS[m]) {
      d = 1;
      m = (m + 1) % 12;
    }
  }
  return { date: `${d} ${MONTHS[m]}`, progress: span > 0 ? offset / span : 0 };
};

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
  // Calibrate the axis and hover counts to the curve's peak for each record.
  const streamsAtY = (y: number) =>
    ((220 - y) / (220 - record.apexY)) * record.peakDaily;
  const tickStep = Math.max(5000, Math.ceil(record.peakDaily / 4 / 5000) * 5000);
  const yAxisTicks = Array.from(
    { length: Math.floor(streamsAtY(0) / tickStep) + 1 },
    (_, index) => {
      const count = index * tickStep;
      return {
        count,
        y: 220 - (count / record.peakDaily) * (220 - record.apexY),
      };
    },
  );

  const calculateHoverData = (
    clientX: number,
    rect: DOMRect,
    path: SVGPathElement | null,
  ): HoverPoint => {
    const pointerX = Math.max(
      0,
      Math.min(600, ((clientX - rect.left) / rect.width) * 600),
    );
    const { date: dateLabel, progress: t } = dailyPointAtProgress(
      record.startDate,
      record.endDate,
      pointerX / 600,
    );
    const relX = t * 600;

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
        targetY = 205 - (205 - record.apexY) * Math.pow(t, 2.2);
      }
    } else {
      targetY = 205 - (205 - record.apexY) * Math.pow(t, 2.2);
    }

    const dailyStreams = Math.round(
      Math.max(0, Math.min(record.peakDaily, streamsAtY(targetY))),
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
    <div className="flex w-full gap-2 sm:gap-3">
      <div
        className="relative w-9 shrink-0 font-mono text-[9px] tabular-nums text-white/50 sm:w-11 sm:text-[10px]"
        role="img"
        aria-label={`Daily streams axis: ${yAxisTicks.map(({ count }) => count.toLocaleString()).join(", ")}`}
      >
        {yAxisTicks.map(({ count, y }) => (
          <span
            key={count}
            aria-hidden="true"
            className="absolute right-0 -translate-y-1/2"
            style={{ top: `${(y / 220) * 100}%` }}
          >
            {count === 0 ? "0" : `${count / 1000}K`}
          </span>
        ))}
      </div>
      <div
        className="relative min-w-0 flex-1 cursor-crosshair select-none touch-pan-y"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleMouseLeave}
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
          {yAxisTicks.map(({ count, y }) => (
            <line
              key={count}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="rgba(255,255,255,0.07)"
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
        </svg>

        {/* Apex marker: HTML overlay stays perfectly round (SVG stretches) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{
            left: `${(record.apexX / 600) * 100}%`,
            top: `${(record.apexY / 220) * 100}%`,
          }}
        >
          <span className="block h-2.5 w-2.5 rounded-full bg-[#19D057] shadow-[0_0_10px_#19D057]" />
          <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#19D057]/60" />
        </div>

        {/* Hover marker: HTML overlay stays perfectly round */}
        {hover && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(hover.x / 600) * 100}%`,
              top: `${(hover.y / 220) * 100}%`,
            }}
          >
            <span className="block h-2.5 w-2.5 rounded-full bg-[#19D057] shadow-[0_0_10px_#19D057]" />
            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#19D057]/75" />
          </div>
        )}

        {/* Floating Readout Tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-30 flex w-[190px] max-w-full flex-col gap-0.5 rounded border border-[#19D057]/40 bg-[#0B0D0B]/95 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-75"
            style={{
              left: `clamp(0px, calc(${(hover.x / 600) * 100}% - 95px), calc(100% - 190px))`,
              top: `${(hover.y / 220) * 100}%`,
              transform: `translateY(${hover.y < 65 ? "16px" : "calc(-100% - 14px)"})`,
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

  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<number | null>(null);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });

  // Mouse and pen drag the track; touch retains native swipe scrolling.
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const onStripPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    suppressClickRef.current = false;
    handleManualScroll();
    if (e.pointerType === "touch" || !e.isPrimary || e.button !== 0) return;
    const el = e.currentTarget;
    el.scrollTo({ left: el.scrollLeft, behavior: "instant" });
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const onStripPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const delta = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(delta) <= 6) return;
      d.moved = true;
      suppressClickRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.style.scrollSnapType = "none";
      setIsDragging(true);
    }
    e.preventDefault();
    e.currentTarget.scrollLeft = d.scrollLeft - delta;
  };

  const endStripDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;
    e.currentTarget.style.removeProperty("scroll-snap-type");
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    updateScrollEdges();
  };

  const updateScrollEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const position = scrollTargetRef.current ?? el.scrollLeft;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = position > 1;
    const right = position < maxScroll - 1;
    setScrollEdges((previous) =>
      previous.left === left && previous.right === right
        ? previous
        : { left, right },
    );
  };

  // Keep controls accurate after resizing the finite track.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      scrollTargetRef.current = null;
      updateScrollEdges();
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isActive]);

  const handleRecordScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    if (
      scrollTargetRef.current !== null &&
      Math.abs(el.scrollLeft - scrollTargetRef.current) <= 1
    ) {
      scrollTargetRef.current = null;
    }
    updateScrollEdges();
  };

  const handleManualScroll = () => {
    scrollTargetRef.current = null;
    updateScrollEdges();
  };

  // Advance to the adjacent card, clamping the final step to the track's end.
  const scrollRecords = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const cards = Array.from(el.children).filter(
      (child) => child.tagName === "BUTTON",
    ) as HTMLElement[];
    const stops = [
      ...new Set(cards.map((card) => Math.min(card.offsetLeft, maxScroll))),
    ];
    const current = scrollTargetRef.current ?? el.scrollLeft;
    const target =
      dir === 1
        ? stops.find((stop) => stop > current + 1) ?? maxScroll
        : stops.reverse().find((stop) => stop < current - 1) ?? 0;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scrollTargetRef.current = target;
    el.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
    updateScrollEdges();
  };

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
        </div>

        {/* Selectable Records / Artists Navigation Strip */}
        <div className="mt-10 sm:mt-12 md:mt-14">
          <div className="mb-3 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/50 sm:text-[10px] sm:tracking-[0.25em]">
            <span>SELECT RECORD</span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRecords(-1)}
                aria-label="Scroll records left"
                aria-controls="spotify-record-strip"
                title="Previous record"
                disabled={!scrollEdges.left}
                data-hoverable="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-colors enabled:hover:border-[#1DB954] enabled:hover:bg-[#1DB954]/15 enabled:hover:text-[#19D057] enabled:active:bg-[#1DB954]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19D057] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/20"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollRecords(1)}
                aria-label="Scroll records right"
                aria-controls="spotify-record-strip"
                title="Next record"
                disabled={!scrollEdges.right}
                data-hoverable="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-colors enabled:hover:border-[#1DB954] enabled:hover:bg-[#1DB954]/15 enabled:hover:text-[#19D057] enabled:active:bg-[#1DB954]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19D057] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/20"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
          </div>

          <div className="relative">
            <div
              ref={scrollerRef}
              id="spotify-record-strip"
              onScroll={handleRecordScroll}
              onWheel={handleManualScroll}
              onPointerDown={onStripPointerDown}
              onKeyDown={handleManualScroll}
              onPointerMove={onStripPointerMove}
              onPointerUp={endStripDrag}
              onPointerCancel={endStripDrag}
              onLostPointerCapture={endStripDrag}
              onPointerLeave={(e) => {
                if (!dragRef.current?.moved) endStripDrag(e);
              }}
              onDragStart={(e) => e.preventDefault()}
              onClickCapture={(e) => {
                if (suppressClickRef.current && e.detail !== 0) {
                  e.preventDefault();
                  e.stopPropagation();
                  suppressClickRef.current = false;
                }
              }}
              className={`relative flex select-none snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              {SPOTIFY_PROOF_RECORDS.map((record) => {
                const isSelected = record.id === selectedId;
                return (
                  <button
                    key={record.id}
                    onClick={() => setSelectedId(record.id)}
                    aria-pressed={isSelected}
                    className={`group relative flex h-[154px] w-[478px] max-w-[85vw] shrink-0 snap-start cursor-[inherit] flex-col justify-between overflow-hidden rounded-xl border-2 p-3 text-left transition-all duration-300 sm:p-4 ${
                      isSelected
                        ? "border-[#1DB954] bg-[#0E150F]"
                        : "border-white/10 bg-[#0B0D0B]/80 hover:border-white/30 hover:bg-[#121412]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black sm:h-12 sm:w-12">
                        <img
                          src={record.image}
                          alt={record.title}
                          loading="lazy"
                          draggable={false}
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
                          className={`font-impact text-xs sm:text-sm md:text-base mt-0.5 leading-snug line-clamp-2 ${
                            isSelected ? "text-white" : "text-white/80"
                          }`}
                        >
                          {toTitleCase(record.title)}
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
        </div>

        {/* Selected Card Deep-Dive Showcase */}
        <div className="mt-6 sm:mt-8">
          <div className="relative mx-auto w-full rounded-2xl border border-white/15 bg-[#0B0D0B] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.8)] sm:p-7 md:p-8">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-[12px] tracking-[0.18em] text-white/60 sm:text-[13px] sm:tracking-[0.2em]">
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
                {activeRecord.spotifyUrl && (
                  <a
                    href={activeRecord.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Listen to ${activeRecord.title} on Spotify`}
                    className="absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#1DB954] hover:bg-[#1DB954]/25 hover:shadow-[0_0_16px_rgba(29,185,84,0.6)] active:scale-95"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4 text-white"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-.35.105-.72-.09-.825-.44-.105-.35.09-.72.44-.825 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.413.125-.85-.11-.975-.523-.125-.413.11-.85.523-.975 4.267-1.295 11.328-1.047 15.795 1.604.372.221.493.704.272 1.076-.221.372-.704.493-1.076.272z" />
                    </svg>
                  </a>
                )}
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
                      <svg
                        viewBox="0 0 24 24"
                        fill="#1DB954"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.216.353-.674.467-1.027.25-2.822-1.724-6.376-2.115-10.562-1.158-.403.092-.806-.157-.899-.56-.092-.403.158-.806.56-.899 4.588-1.047 8.528-.601 11.678 1.34.353.216.467.674.25 1.027zm1.472-3.273c-.272.443-.853.582-1.296.31-3.23-1.986-8.156-2.56-11.977-1.4-.35.105-.72-.09-.825-.44-.105-.35.09-.72.44-.825 4.38-1.33 9.805-.688 13.511 1.588.443.272.582.853.31 1.296zm.129-3.41c-3.874-2.3-10.274-2.513-13.99-1.385-.413.125-.85-.11-.975-.523-.125-.413.11-.85.523-.975 4.267-1.295 11.328-1.047 15.795 1.604.372.221.493.704.272 1.076-.221.372-.704.493-1.076.272z" />
                      </svg>
                      <span>OPEN IN SPOTIFY ↗</span>
                    </a>
                  )}
                </div>

                <div className="w-full border-y border-white/10 py-3.5">
                  <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-8 text-center sm:gap-16">
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
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="mt-1">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[8.5px] tracking-[0.18em] text-white/50 sm:text-[9px] sm:tracking-[0.2em]">
                    <span>STREAM VELOCITY</span>
                    <span className="text-[#19D057]">
                      <span className="hidden [@media(hover:none)]:inline">TAP FOR DAILY DATA</span>
                      <span className="[@media(hover:none)]:hidden">HOVER FOR DAILY DATA</span>
                    </span>
                  </div>
                  <DynamicGrowthChart key={activeRecord.id} record={activeRecord} lineRef={lineRef} />
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
