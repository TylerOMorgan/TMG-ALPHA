import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ECOSYSTEM_SVG_DATA } from "../utils/ecosystemSvgData";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  (window as any).ScrollTrigger = ScrollTrigger;
}

// Helper: detect pulse animations
const isPulseAnimation = (anim: Animation): boolean => {
  try {
    const name = (anim as any).animationName || "";
    if (typeof name === "string" && name.toLowerCase().includes("pulse")) {
      return true;
    }
    const target = (anim.effect as any)?.target;
    if (target) {
      if (typeof target.id === "string" && target.id.toLowerCase().includes("pulse")) {
        return true;
      }
      if (typeof target.className === "string" && target.className.toLowerCase().includes("pulse")) {
        return true;
      }
      if (target.closest && target.closest(".ecosystem-pulse-group")) {
        return true;
      }
    }
  } catch {}
  return false;
};

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

// Filter live animations to only those driving the unfolding/folding diagram
const getLiveUnfoldingAnimations = (container: HTMLElement): Animation[] => {
  return getLiveAnimations(container).filter((anim) => !isPulseAnimation(anim));
};

// Filter live animations to pulse animations
const getLivePulseAnimations = (container: HTMLElement): Animation[] => {
  return getLiveAnimations(container).filter((anim) => isPulseAnimation(anim));
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

    // Cache live unfolding animation handles (deduped to one per target+name)
    let liveUnfoldingAnims = getLiveUnfoldingAnimations(containerRef.current);

    // Cache pulse group DOM nodes
    let pulseGroups: HTMLElement[] | null = null;
    const updatePulseOpacity = (opacity: number) => {
      if (!pulseGroups || pulseGroups.length === 0) {
        if (containerRef.current) {
          pulseGroups = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(".ecosystem-pulse-group")
          );
        }
      }
      if (pulseGroups) {
        const val = opacity.toFixed(3);
        for (let i = 0; i < pulseGroups.length; i++) {
          pulseGroups[i].style.opacity = val;
        }
      }
    };

    // Ensure pulse animations are actively playing in real time
    const ensurePulseRunning = () => {
      if (!containerRef.current) return;
      const pulseAnims = getLivePulseAnimations(containerRef.current);
      for (let i = 0; i < pulseAnims.length; i++) {
        try {
          if (pulseAnims[i].playState !== "running") {
            pulseAnims[i].play();
          }
        } catch {}
      }
    };

    // Scrub unfolding animations cleanly in both directions (Option 3)
    const scrub = (progress: number) => {
      const validProgress =
        typeof progress === "number" && !isNaN(progress) ? progress : 0;
      const clampedProgress = Math.min(Math.max(validProgress, 0), 1);
      // Map [0, 1] to [0ms, 4999ms]
      const time = clampedProgress * 4999;

      // Always re-collect live unfolding animations to handle WAAPI clone lifecycle
      if (containerRef.current) {
        liveUnfoldingAnims = getLiveUnfoldingAnimations(containerRef.current);
      }

      // Scrub ONLY unfolding animations (TMG scale, cards sliding, lines drawing)
      for (let i = 0; i < liveUnfoldingAnims.length; i++) {
        try {
          if (liveUnfoldingAnims[i].playState !== "paused") {
            liveUnfoldingAnims[i].pause();
          }
          liveUnfoldingAnims[i].currentTime = time;
        } catch {}
      }

      // Pulse flow visibility:
      // When folding/unfolding (<78%), pulses are hidden.
      // Once lines connect (78% -> 90%), pulses smoothly fade in.
      // Above 90%, pulses are fully visible and flowing continuously.
      // When scrolling back up, pulses fade out cleanly so lines fold back cleanly.
      const pulseOpacity = Math.max(0, Math.min(1, (clampedProgress - 0.78) / 0.12));
      updatePulseOpacity(pulseOpacity);

      // Keep pulse animations flowing in real-time
      ensurePulseRunning();
    };

    // Shared progress proxy for GSAP tween
    const proxy = { progress: 0 };

    // Initialize at frame 0 (resting folded state)
    scrub(0);

    // Create synchronized pin & scrub trigger
    ctx = gsap.context(() => {
      gsap.to(proxy, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          id: "svg-ecosystem-scrub",
          trigger: sectionRef.current,
          start: "center center",
          end: "+=130%",
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => {
            scrub(proxy.progress);
          },
          onRefresh: () => {
            scrub(proxy.progress);
          },
        },
      });
    }, sectionRef.current);

    // Layout refresh
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
