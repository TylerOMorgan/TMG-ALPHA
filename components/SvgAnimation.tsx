import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ECOSYSTEM_SVG_DATA } from "../utils/ecosystemSvgData";
import { PIVOT_INDEX } from "./Manifesto";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  (window as any).ScrollTrigger = ScrollTrigger;
  (window as any).gsap = gsap;
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
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const unfoldedBloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current || !svgWrapperRef.current) return;

    let ctx: gsap.Context | null = null;

    // Pre-cache live unfolding and pulse animation handles (deduped to one per target+name)
    let liveUnfoldingAnims: Animation[] = [];
    let livePulseAnims: Animation[] = [];

    const initAnimationHandles = () => {
      if (!containerRef.current) return;
      liveUnfoldingAnims = getLiveUnfoldingAnimations(containerRef.current);
      livePulseAnims = getLivePulseAnimations(containerRef.current);
    };

    initAnimationHandles();

    // Cache pulse group DOM nodes and track opacity to eliminate redundant DOM writes
    let pulseGroups: HTMLElement[] | null = null;
    let lastPulseOpacity = -1;

    const updatePulseOpacity = (opacity: number) => {
      const rounded = Math.round(opacity * 100) / 100;
      if (rounded === lastPulseOpacity) return;
      lastPulseOpacity = rounded;

      if (!pulseGroups && containerRef.current) {
        pulseGroups = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(".ecosystem-pulse-group")
        );
      }
      if (pulseGroups) {
        const val = rounded.toFixed(2);
        for (let i = 0; i < pulseGroups.length; i++) {
          pulseGroups[i].style.opacity = val;
        }
      }
    };

    // Ensure pulse animations are actively playing in real time
    const ensurePulseRunning = () => {
      if (livePulseAnims.length === 0 && containerRef.current) {
        livePulseAnims = getLivePulseAnimations(containerRef.current);
      }
      for (let i = 0; i < livePulseAnims.length; i++) {
        try {
          if (livePulseAnims[i].playState !== "running") {
            livePulseAnims[i].play();
          }
        } catch {}
      }
    };

    ensurePulseRunning();

    let lastScrubTime = -1;
    let lastBloomOpacity = -1;

    // Scrub unfolding animations cleanly in both directions
    const scrub = (progress: number) => {
      const validProgress =
        typeof progress === "number" && !isNaN(progress) ? progress : 0;
      const clampedProgress = Math.min(Math.max(validProgress, 0), 1);

      // Smooth, continuous mapping from progress [0, 1] to animation time [0ms, 4999ms]
      // using a smooth power curve without abrupt velocity cliffs:
      let time = 0;
      if (clampedProgress > 0) {
        time = Math.min(4999, Math.pow(clampedProgress, 0.8) * 4999);
      }

      // Avoid redundant DOM updates if time hasn't changed
      if (time === 0 && lastScrubTime === 0) {
        return;
      }
      lastScrubTime = time;

      // Lazy handle acquisition if handles were not yet mounted on frame 0
      if (liveUnfoldingAnims.length === 0 && containerRef.current) {
        initAnimationHandles();
      }

      // Scrub ONLY unfolding animations (TMG scale, cards sliding, lines drawing)
      // Iterating pre-cached handles without traversing the DOM subtree
      for (let i = 0; i < liveUnfoldingAnims.length; i++) {
        try {
          if (liveUnfoldingAnims[i].playState !== "paused") {
            liveUnfoldingAnims[i].pause();
          }
          liveUnfoldingAnims[i].currentTime = time;
        } catch {}
      }

      // Pulse flow visibility:
      // Fade in pulses once lines connect (progress 0.55 to 0.75),
      // full intensity through unfolded rest (0.75 to 1.0)
      const pulseOpacity = Math.max(0, Math.min(1, (clampedProgress - 0.55) / 0.20));
      updatePulseOpacity(pulseOpacity);

      // Fade in the wide atmospheric bloom as diagram unfolds
      if (unfoldedBloomRef.current) {
        const bloomOpacity = Math.max(0, Math.min(1, (clampedProgress - 0.10) / 0.30));
        const roundedBloom = Math.round(bloomOpacity * 100) / 100;
        if (roundedBloom !== lastBloomOpacity) {
          lastBloomOpacity = roundedBloom;
          unfoldedBloomRef.current.style.opacity = roundedBloom.toFixed(2);
        }
      }
    };

    const stage = document.getElementById("about-hero-stage");
    if (!stage || !containerRef.current || !svgWrapperRef.current) return;

    ctx = gsap.context(() => {
      const manifesto = stage.querySelector("#about-manifesto") as HTMLElement | null;
      const words = manifesto ? manifesto.querySelectorAll(".word") : [];
      const footerWords = manifesto ? manifesto.querySelectorAll(".footer-word") : [];

      // Initial word visibility split based on pivot index
      const initialVisible = Array.from(words).slice(0, PIVOT_INDEX + 1);
      const toReveal = Array.from(words).slice(PIVOT_INDEX + 1);

      // Set initial states for Manifesto text
      gsap.set(initialVisible, { opacity: 1, color: "#EAEAEA" });
      gsap.set(toReveal, { opacity: 0.1, color: "#4a4a4a" });
      gsap.set(footerWords, { opacity: 0.1, textShadow: "none" });
      if (manifesto) gsap.set(manifesto, { opacity: 1 });

      // Calculate resting Y so logo midpoint aligns exactly with bottom of viewport (half visible)
      let restingY = 0;
      const calculateRestingY = () => {
        if (!containerRef.current || !svgWrapperRef.current) return 0;
        const logo = containerRef.current.querySelector(
          "#Trillex_Main_No_BG_1"
        ) as SVGElement | null;
        if (!logo) return 0;

        const currentY =
          (gsap.getProperty(svgWrapperRef.current, "y") as number) || 0;
        const logoRect = logo.getBoundingClientRect();
        // Compute un-translated center of logo in viewport coordinates
        const logoCenterY = logoRect.top + logoRect.height * 0.5 - currentY;

        // Exactly align logo midpoint with bottom of viewport (window.innerHeight)
        return window.innerHeight - logoCenterY;
      };

      restingY = calculateRestingY();
      gsap.set(svgWrapperRef.current, { y: restingY, force3D: true });

      // Initialize SVG scrub at frame 0 (resting folded apex state)
      scrub(0);

      // Scrub proxy object for GSAP tween
      const scrubProxy = { progress: 0 };

      // Single synchronized master timeline pinning the hero stage
      let transitionStartTime = 5.36;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "about-hero-timeline",
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.5}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            restingY = calculateRestingY();
          },
          onRefresh: () => {
            restingY = calculateRestingY();
            if (tl.time() <= transitionStartTime) {
              gsap.set(svgWrapperRef.current, { y: restingY, force3D: true });
              scrub(0);
            }
          },
        },
      });

      // 1. Text 1 (toReveal) reveals completely word-by-word first
      tl.to(
        toReveal,
        {
          opacity: 1,
          color: "#EAEAEA",
          stagger: 0.15,
          duration: 0.25,
          ease: "none",
        },
        0
      );

      // 2. ONLY AFTER Text 1 is 100% revealed, Text 2 (footerWords: "Established in BKK 2024")
      //    reveals sequentially (matching original sequential timeline: .to(toReveal, ...).to(footerWords, ..., "+=0.1"))
      tl.to(
        footerWords,
        {
          opacity: 1,
          textShadow: "0 0 12px rgba(255,127,80,0.8)",
          stagger: 0.12,
          duration: 0.4,
          ease: "power2.out",
        },
        "+=0.1"
      );

      // Point 1: Text 1 and Text 2 are both 100% revealed
      const point1Time = tl.duration();
      const holdDuration = 0.2;
      transitionStartTime = point1Time + holdDuration;

      // 3. Throughout entire reveal of Text 1 and Text 2 (and Point 1 hold),
      //    SVG apex icon stays anchored stationary at restingY (half visible at viewport bottom).
      //    Only after Point 1, further scrolling transitions apex icon up to center (y: 0).
      tl.set(svgWrapperRef.current, { y: () => restingY }, 0);
      tl.fromTo(
        svgWrapperRef.current,
        { y: () => restingY },
        {
          y: 0,
          duration: 2.4,
          ease: "power2.inOut",
        },
        transitionStartTime
      );

      // 4. Scrub proxy stays at 0 (folded resting apex state) throughout entire reveal of Text 1 & 2.
      //    Only after Point 1, further scrolling unfolds SVG ecosystem diagram.
      tl.set(scrubProxy, { progress: 0 }, 0);
      tl.fromTo(
        scrubProxy,
        { progress: 0 },
        {
          progress: 1,
          duration: 3.8,
          ease: "none",
          onUpdate: () => {
            scrub(scrubProxy.progress);
          },
        },
        transitionStartTime
      );

      // 5. Only after Point 1: Manifesto fades out smoothly as transition begins
      if (manifesto) {
        tl.set(manifesto, { opacity: 1, visibility: "inherit" }, 0);
        tl.fromTo(
          manifesto,
          { opacity: 1, visibility: "inherit" },
          {
            opacity: 0,
            duration: 1.2,
            ease: "power1.out",
            onComplete: () => {
              if (manifesto) manifesto.style.visibility = "hidden";
            },
            onReverseComplete: () => {
              if (manifesto) manifesto.style.visibility = "inherit";
            },
          },
          transitionStartTime
        );
      }
    }, stage);

    const syncLayout = () => {
      initAnimationHandles();
      ensurePulseRunning();
      ScrollTrigger.refresh();
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.resize();
      }
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
      className="absolute inset-0 z-20 w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
    >
      {/* Wide atmospheric ambient gradient bloom behind the unfolded diagram */}
      <div
        ref={unfoldedBloomRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[950px] lg:w-[1200px] h-[350px] md:h-[500px] bg-gradient-to-r from-trillex-orange/10 via-cyan-500/5 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none opacity-0"
      />

      <div
        ref={svgWrapperRef}
        className="w-full max-w-7xl px-8 md:px-12 h-full flex items-center justify-center relative z-10 will-change-transform"
      >
        <div className="relative w-full max-h-[90vh] aspect-[16/9] flex items-center justify-center">
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center pointer-events-none select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain relative z-10"
            dangerouslySetInnerHTML={{ __html: ECOSYSTEM_SVG_DATA }}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(SvgAnimation);
