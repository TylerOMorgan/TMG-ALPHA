import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
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

// Maps chart progress t (0..1) to a real calendar date between start
// ("1 SEP") and end ("30 SEP"), so hover reads "1 SEP" … "30 SEP".
const dateAtProgress = (start: string, end: string, t: number): string => {
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
  if (!s || !e) return start;
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
  let offset = Math.round(t * span);
  let d = s.day;
  let m = s.mon;
  for (let i = 0; i < offset; i++) {
    d++;
    if (d > MONTH_DAYS[m]) {
      d = 1;
      m = (m + 1) % 12;
    }
  }
  return `${d} ${MONTHS[m]}`;
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
    const dateLabel = dateAtProgress(record.startDate, record.endDate, t);
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

        {/* Interactive hover tracking guideline (dots render as HTML overlay below so they stay round) */}
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
          </g>
        )}
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

  const scrollerRef = useRef<HTMLDivElement>(null);
  const copyCount = SPOTIFY_PROOF_RECORDS.length;

  const byId = useMemo(
    () => Object.fromEntries(SPOTIFY_PROOF_RECORDS.map((r) => [r.id, r])),
    [],
  );
  // User-reorderable record sequence (drag the grip handle to rearrange)
  const [order, setOrder] = useState<string[]>(() =>
    SPOTIFY_PROOF_RECORDS.map((r) => r.id),
  );
  const ordered = order.map((id) => byId[id]).filter(Boolean);

  // Tripled track for a seamless infinite loop; we rest in the middle copy
  const loopRecords = [...ordered, ...ordered, ...ordered];

  // Drag-to-reorder state (grip handle; mouse + touch via pointer events)
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropPos, setDropPos] = useState<{ at: number; px: number } | null>(
    null,
  );
  const dragRef = useRef<{
    id: string;
    startX: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const onGripPointerDown = (e: React.PointerEvent, id: string) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = { id, startX: e.clientX, moved: false };
    setDraggingId(id);
  };

  const onStripPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    const el = scrollerRef.current;
    if (!d || !el) return;
    if (Math.abs(e.clientX - d.startX) > 6) d.moved = true;
    if (!d.moved) return;
    const kids = Array.from(el.children).filter(
      (k) => k.tagName === "BUTTON",
    ) as HTMLElement[];
    const mid = kids.slice(copyCount, copyCount * 2);
    if (mid.length === 0) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left + el.scrollLeft;
    let at = 0;
    for (let i = 0; i < mid.length; i++) {
      if (x >= mid[i].offsetLeft + mid[i].offsetWidth / 2) at = i + 1;
      else break;
    }
    const last = mid[mid.length - 1];
    const px =
      at < mid.length ? mid[at].offsetLeft : last.offsetLeft + last.offsetWidth;
    setDropPos({ at, px });
  };

  const endStripDrag = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d?.moved) {
      suppressClickRef.current = true;
      const id = d.id;
      setOrder((prev) => {
        const without = prev.filter((x) => x !== id);
        const at = Math.max(
          0,
          Math.min(dropPos?.at ?? without.length, without.length),
        );
        without.splice(at, 0, id);
        return without;
      });
    }
    setDraggingId(null);
    setDropPos(null);
  };

  const oneCopyWidth = () => {
    const el = scrollerRef.current;
    if (!el || el.children.length <= copyCount) return 0;
    return (el.children[copyCount] as HTMLElement).offsetLeft;
  };

  // Start in the middle copy so both directions can scroll forever
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = () => {
      const w = oneCopyWidth();
      if (w > 0) el.scrollLeft = w;
    };
    center();
    const raf = requestAnimationFrame(center);
    window.addEventListener("resize", center);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", center);
    };
  }, []);

  // Seamless wrap: at an edge copy, jump one copy over (identical view)
  const handleLoopScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = oneCopyWidth();
    if (w <= 0) return;
    if (el.scrollLeft <= 2) {
      el.scrollLeft += w;
    } else if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
      el.scrollLeft -= w;
    }
  };

  // Infinite scroller: pre-jump past the edge, then glide (no visible snap)
  const scrollRecords = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = reduce ? "auto" : "smooth";
    const w = oneCopyWidth();
    if (w > 0) {
      if (dir === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollLeft -= w;
      } else if (dir === -1 && el.scrollLeft <= 4) {
        el.scrollLeft += w;
      }
    }
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior });
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
                data-hoverable="true"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:border-[#1DB954] hover:text-[#1DB954]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRecords(1)}
                aria-label="Scroll records right"
                data-hoverable="true"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:border-[#1DB954] hover:text-[#1DB954]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </span>
          </div>

          <div className="relative">
            <div
              ref={scrollerRef}
              onScroll={handleLoopScroll}
              onPointerMove={onStripPointerMove}
              onPointerUp={endStripDrag}
              onPointerCancel={endStripDrag}
              className={`relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden ${draggingId ? "select-none" : ""}`}
            >
              {loopRecords.map((record, copyIdx) => {
                const isSelected = record.id === selectedId;
                const inMainCopy =
                  copyIdx >= copyCount && copyIdx < copyCount * 2;
                const cardKey = `${record.id}-${copyIdx}`;
                return (
                  <button
                    key={cardKey}
                    onClick={() => {
                      if (suppressClickRef.current) {
                        suppressClickRef.current = false;
                        return;
                      }
                      setSelectedId(record.id);
                    }}
                    aria-hidden={!inMainCopy}
                    tabIndex={inMainCopy ? undefined : -1}
                    aria-pressed={isSelected}
                    className={`group relative flex h-[154px] w-[478px] max-w-[85vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 sm:p-4 ${draggingId === record.id ? "opacity-40" : ""} ${
                      isSelected
                        ? "border-[#1DB954] bg-[#0E150F] shadow-[0_0_25px_rgba(29,185,84,0.3)] ring-1 ring-[#1DB954]"
                        : "border-white/10 bg-[#0B0D0B]/80 hover:border-white/30 hover:bg-[#121412]"
                    }`}
                  >
                    <span
                      title="Drag to reorder"
                      aria-hidden="true"
                      onPointerDown={(e) => onGripPointerDown(e, record.id)}
                      className="absolute right-2 top-2 z-10 flex h-6 w-6 cursor-grab touch-none items-center justify-center rounded-md border border-white/10 bg-black/50 text-white/40 opacity-60 backdrop-blur-sm transition-all hover:text-white hover:opacity-100 active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>
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
              {dropPos && draggingId && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1 top-1 z-20 w-[3px] -translate-x-1/2 rounded-full bg-[#1DB954] shadow-[0_0_12px_#1DB954]"
                  style={{ left: `${dropPos.px}px` }}
                />
              )}
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
