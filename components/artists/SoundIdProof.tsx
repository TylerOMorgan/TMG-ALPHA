import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "./Eyebrow";
import {
  SOUND_EYEBROW,
  SOUND_TITLE,
  SOUND_GHOST,
  TIKTOK_VERIFIED_HITS,
} from "../../utils/artistsExperienceData";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  isActive?: boolean;
}

const getTitleLines = (title: string): string[] => {
  const words = title.trim().split(/\s+/);
  let firstLine = words.shift() ?? "";

  while (words.length && `${firstLine} ${words[0]}`.length <= 10) {
    firstLine += ` ${words.shift()}`;
  }

  return words.length ? [firstLine, words.join(" ")] : [firstLine];
};

const SoundIdProof: React.FC<SectionProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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

      // Wobble + cursor tracking mirroring the founder logo behaviour.
      // Tilt lives on wrapper divs so it never fights the scrub tween above.
      const wrappers = tiltRefs.current.filter(Boolean) as HTMLDivElement[];
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      wrappers.forEach((el, i) => {
        gsap.set(el, { transformPerspective: 800 });
        if (!isCoarse) {
          trackers.current[i] = {
            x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" }),
            y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power2.out" }),
            rotX: gsap.quickTo(el, "rotationX", {
              duration: 0.8,
              ease: "power2.out",
            }),
            rotY: gsap.quickTo(el, "rotationY", {
              duration: 0.8,
              ease: "power2.out",
            }),
          };
        }
      });
      if (wrappers.length) {
        gsap.fromTo(
          wrappers,
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
    return () => ctx.revert();
  }, [isActive]);

  // Per-card 3D tilt tracking the cursor (same ±15°/±20px ranges as the founder logo)
  const handleCardMove = (e: React.MouseEvent, idx: number) => {
    const t = trackers.current[idx];
    const el = tiltRefs.current[idx];
    if (!t || !el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    t.rotY(x * 15);
    t.rotX(-y * 15);
    t.x(x * 20);
    t.y(y * 20);
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

      {/* 4 Clickable Verified Hits Cards */}
      <div
        ref={cardsRef}
        className="relative z-10 mx-auto mt-20 sm:mt-24 md:mt-36 lg:mt-44 xl:mt-48 max-w-[1840px] px-4 sm:px-6 md:px-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4"
      >
        {TIKTOK_VERIFIED_HITS.map((card, idx) => (
          <div
            key={card.id}
            ref={(el) => {
              tiltRefs.current[idx] = el;
            }}
            onMouseMove={(e) => handleCardMove(e, idx)}
            onMouseLeave={() => handleCardLeave(idx)}
            className="will-change-transform"
          >
            <a
              href={card.soundUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${card.title} on TikTok`}
              className="group relative block h-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0C0C] will-change-transform transition-all duration-300 hover:-translate-y-2 hover:border-[#00F2FE]/70 hover:shadow-[0_12px_35px_rgba(0,242,254,0.25)] focus:outline-none focus:ring-2 focus:ring-[#00F2FE]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

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
                    <div className="font-impact text-base leading-tight text-white md:text-lg group-hover:text-white transition-colors">
                      {getTitleLines(card.title).map((line, lineIndex) => (
                        <span key={lineIndex} className="block">
                          {line}{" "}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 font-impact text-2xl text-white group-hover:text-[#00F2FE] transition-colors md:text-3xl">
                    {card.metric}
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
