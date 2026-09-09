import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ECOSYSTEM_SVG_DATA } from "../utils/ecosystemSvgData";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  (window as any).ScrollTrigger = ScrollTrigger;
}

// Helper: collect active Web Animation objects from the container subtree dynamically.
// Dedupes by (target, animationName): React 19's concurrent renderer can leave
// multiple WAAPI clones of the same CSS animation on one element. The clones
// share one style update but only ONE of them actually drives the rendering —
// writing currentTime to all of them leaves stale clones overriding the live
// one (replace composite), freezing the SVG. One handle per (target, name)
// keeps scrub deterministic.
const getLiveAnimations = (container: HTMLElement): Animation[] => {
  let anims: Animation[] = [];
  // 1. Native getAnimations on container subtree (modern browsers)
  if (typeof container.getAnimations === "function") {
    try {
      const found = container.getAnimations({ subtree: true });
      if (found && found.length > 0) anims = found as Animation[];
    } catch {}
  }

  // 2. Query element-level animations (fallback for older browser engines)
  if (anims.length === 0) {
    const found: Animation[] = [];
    try {
      const elements = container.querySelectorAll("*");
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (typeof el.getAnimations === "function") {
          const elAnims = el.getAnimations();
          for (let j = 0; j < elAnims.length; j++) {
            found.push(elAnims[j]);
          }
        }
      }
    } catch {}
    anims = found;
  }

  // 3. Document-level getAnimations fallback (filtered to container subtree)
  if (
    anims.length === 0 &&
    typeof document !== "undefined" &&
    typeof document.getAnimations === "function"
  ) {
    try {
      const docAnims = document.getAnimations();
      for (let i = 0; i < docAnims.length; i++) {
        const target = (docAnims[i].effect as any)?.target;
        if (target && container.contains(target)) {
          anims.push(docAnims[i]);
        }
      }
    } catch {}
  }

  // Dedupe: keep first handle per (target element, animationName) by reference
  const deduped: Animation[] = [];
  for (let i = 0; i < anims.length; i++) {
    let isDupe = false;
    try {
      const t = (anims[i].effect as any)?.target;
      const n = (anims[i] as any).animationName;
      for (let j = 0; j < deduped.length; j++) {
        if (
          (deduped[j].effect as any)?.target === t &&
          (deduped[j] as any).animationName === n
        ) {
          isDupe = true;
          break;
        }
      }
    } catch {
      isDupe = false;
    }
    if (!isDupe) deduped.push(anims[i]);
  }

  return deduped;
};

interface SvgAnimationProps {
  isActive?: boolean;
}

const SvgAnimation: React.FC<SvgAnimationProps> = ({ isActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Link SVG animations to GSAP ScrollTrigger when page is active
  useEffect(() => {
    if (!isActive || !containerRef.current || !sectionRef.current) return;

    let ctx: gsap.Context | null = null;

    // Cache live animation handles (deduped to one per target+name)
    let liveAnims = getLiveAnimations(containerRef.current);
    // Re-collect (and re-dedupe) on every scrub: React 19's concurrent
    // renderer can mint fresh WAAPI clones of the same CSS animations at any
    // time (e.g. after HMR-style re-renders). A stale cached list would keep
    // writing currentTime to orphaned handles while the live clones sit at 0.

    // Scrub all live animations to exact timestamp cleanly in both directions
    const scrub = (progress: number) => {
      const validProgress =
        typeof progress === "number" && !isNaN(progress) ? progress : 0;
      const clampedProgress = Math.min(Math.max(validProgress, 0), 1);
      // Map [0, 1] to [0ms, 4999ms]
      const time = clampedProgress * 4999;

      // Always re-collect: clones come and go, never trust a cached list
      if (containerRef.current) {
        liveAnims = getLiveAnimations(containerRef.current);
      }

      for (let i = 0; i < liveAnims.length; i++) {
        try {
          if (liveAnims[i].playState !== "paused") {
            liveAnims[i].pause();
          }
          liveAnims[i].currentTime = time;
        } catch {}
      }
    };

    // Shared progress proxy for GSAP tween and timer synchronizations
    const proxy = { progress: 0 };

    // Initialize at frame 0 (resting state). The static teaser at the
    // viewport bottom already shows the apex, so the section arrives empty
    // and unfolds as scroll reaches it — one continuous motion.
    scrub(0);

    // Create GSAP ScrollTrigger with smooth scrub using a tween proxy
    ctx = gsap.context(() => {
      // 1. Dedicated Pin Trigger: Pins sectionRef centered in viewport
      const pinST = ScrollTrigger.create({
        id: "svg-pin",
        trigger: sectionRef.current,
        start: "center center",
        end: "+=120%", // Smooth, comfortable scroll distance
        pin: true,
        anticipatePin: 1,
      });

      // 2. Scrub Trigger: ease:none = 1:1 with scroll (no disconnection).
      //    Starts when manifesto pins (so SVG has a head-start by the time it's centered).
      //    Ends at SVG pin end so the fold/unfold plays while SVG is the main focus.
      gsap.to(proxy, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          id: "svg-scrub",
          start: () => {
            const mST = ScrollTrigger.getById("manifesto-trigger");
            return mST ? mST.start : "top center";
          },
          end: () => {
            const pST = ScrollTrigger.getById("svg-pin") || pinST;
            return pST ? pST.end : "+=120%";
          },
          scrub: 0.3,
          invalidateOnRefresh: true,
          onRefresh: () => {
            scrub(proxy.progress);
          },
        },
        onUpdate: () => {
          scrub(proxy.progress);
        },
      });
    }, sectionRef.current);

    // Fast refresh for layout stabilization
    const syncLayout = () => {
      ScrollTrigger.refresh();
      scrub(proxy.progress);
    };

    const rafId = requestAnimationFrame(syncLayout);

    return () => {
      cancelAnimationFrame(rafId);
      if (ctx) ctx.revert();
    };
  }, [isActive]);

  return (
    <section
      id="about-ecosystem-animation"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[500px] max-h-[100vh] py-0 bg-trillex-black flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ minHeight: "100vh", height: "100vh" }}
    >
      {/* Subtle ambient gradient glow in the background matching the brand palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] lg:w-[1100px] h-[300px] md:h-[450px] bg-gradient-to-r from-trillex-orange/10 via-cyan-500/5 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl px-8 md:px-12 h-full flex items-center justify-center relative z-10">
        <div className="relative w-full max-h-[90vh] aspect-[16/9] flex items-center justify-center">
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center pointer-events-none select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
            dangerouslySetInnerHTML={{ __html: ECOSYSTEM_SVG_DATA }}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(SvgAnimation);
