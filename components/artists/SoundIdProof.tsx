import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import { MOUSE_TRACKING_MOTION } from "../../utils/mouseTrackingMotion";
import { getSoundTitleLines } from "../../utils/soundIdPresentation";
import {
  SOUND_EYEBROW,
  SOUND_GHOST,
  TIKTOK_VERIFIED_HITS,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const SoundIdProof: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackers = useRef<
    {
      x: (v: number) => void;
      y: (v: number) => void;
      rotX: (v: number) => void;
      rotY: (v: number) => void;
    }[]
  >([]);

  useEffect(() => {
    trackers.current = [];
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

      // Scroll, entrance, and hover transforms each own a separate element.
      const wrappers = tiltRefs.current.filter(Boolean) as HTMLDivElement[];
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (canHover) {
        wrappers.forEach((el, i) => {
          gsap.set(el, { transformPerspective: MOUSE_TRACKING_MOTION.perspective });
          trackers.current[i] = {
            x: gsap.quickTo(el, "x", { ...MOUSE_TRACKING_MOTION.tween }),
            y: gsap.quickTo(el, "y", { ...MOUSE_TRACKING_MOTION.tween }),
            rotX: gsap.quickTo(el, "rotationX", { ...MOUSE_TRACKING_MOTION.tween }),
            rotY: gsap.quickTo(el, "rotationY", { ...MOUSE_TRACKING_MOTION.tween }),
          };
        });
      }
      const entrances = entryRefs.current.filter(Boolean) as HTMLDivElement[];
      if (entrances.length) {
        gsap.fromTo(
          entrances,
          { scale: 0.85, opacity: 0, rotation: -6 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.8)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
            },
          },
        );
      }
    }, sectionRef);
    return () => {
      trackers.current = [];
      ctx.revert();
    };
  }, [isActive]);

  // The link's hit area never moves, so pointer position cannot feed
  // back into the animated bounds or repeatedly toggle hover at card edges.
  const handleCardMove = (e: React.MouseEvent<HTMLAnchorElement>, idx: number) => {
    const t = trackers.current[idx];
    if (!t) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(
      -1,
      Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2),
    );
    t.rotY(x * MOUSE_TRACKING_MOTION.rotation);
    t.rotX(-y * MOUSE_TRACKING_MOTION.rotation);
    t.x(x * MOUSE_TRACKING_MOTION.offset);
    t.y(y * MOUSE_TRACKING_MOTION.offset);
  };

  const handleCardLeave = (idx: number) => {
    const t = trackers.current[idx];
    if (!t) return;
    t.rotY(0);
    t.rotX(0);
    t.x(0);
    t.y(0);
  };

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
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 className="font-impact text-[8.5vw] leading-[0.98] tracking-tight text-trillex-paper sm:text-[6.5vw] md:text-[5vw] lg:text-[4vw] xl:text-[64px] 2xl:text-[76px]">
            <span className="block">ONE SOUND,</span>
            <span className="block">MILLIONS OF</span>
            <span className="block">VIDEOS.</span>
          </h2>
        </div>
      </div>

      {/* Supplied Sound ID visuals link to the corresponding TikTok sounds. */}
      <div
        ref={cardsRef}
        className="relative z-10 mx-auto mt-20 sm:mt-24 md:mt-36 lg:mt-44 xl:mt-48 max-w-[1840px] px-4 sm:px-6 md:px-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4"
      >
        {TIKTOK_VERIFIED_HITS.map((card, idx) => (
          <div key={card.id} className="will-change-transform">
            <a
              href={card.soundUrl || card.image}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${card.title} ${card.soundUrl ? "on TikTok" : "Sound ID visual"}`}
              onMouseEnter={(e) => handleCardMove(e, idx)}
              onMouseMove={(e) => handleCardMove(e, idx)}
              onMouseLeave={() => handleCardLeave(idx)}
              className="sound-id-link group relative block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={{ "--sound-accent": card.accentColor } as React.CSSProperties}
            >
              <div
                ref={(el) => {
                  entryRefs.current[idx] = el;
                }}
                className="pointer-events-none h-full will-change-transform"
              >
                <div
                  ref={(el) => {
                    tiltRefs.current[idx] = el;
                  }}
                  data-card-tilt
                  className="sound-id-card h-full overflow-hidden rounded-xl border bg-[#0C0C0C] will-change-transform transition-[border-color,box-shadow] duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />

                    {/* Top Right: loader animation plays only on this card's hover; corner stays empty otherwise */}
                    <img
                      src="/tiktok-loading.svg"
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="absolute right-3 top-3 hidden h-11 w-11 group-hover:block"
                    />
                  </div>

                  {/* Bottom row: title bottom-left, metric bottom-right */}
                  <div className="border-t border-white/10 p-3.5 bg-[#0C0C0C]">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1 font-mono text-[9px] tracking-wide text-white/60">
                          {card.artist}
                        </div>
                        <div className="font-impact text-base leading-tight text-white md:text-lg group-hover:text-white transition-colors">
                          {getSoundTitleLines(card.title).map((line, lineIndex) => (
                            <span key={lineIndex} className="block whitespace-nowrap">
                              {line}{" "}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="sound-id-metric shrink-0 font-impact text-2xl transition-colors duration-300 md:text-3xl">
                        {card.metric}
                      </div>
                    </div>
                    <p className="mt-3 font-mono text-[8px] tracking-wide text-white/50">
                      {card.caption}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(SoundIdProof);
