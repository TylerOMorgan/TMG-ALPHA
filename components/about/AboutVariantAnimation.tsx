import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ECOSYSTEM_SVG_DATA } from "../../utils/ecosystemSvgData";
import { PIVOT_INDEX } from "../Manifesto";
import { createBowSubmersion } from "../../utils/bowSubmersion";

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

  return anims;
};

// Filter live animations to only those driving the unfolding/folding diagram
const getLiveUnfoldingAnimations = (container: HTMLElement): Animation[] => {
  return getLiveAnimations(container).filter((anim) => !isPulseAnimation(anim));
};

// Filter live animations to pulse animations
const getLivePulseAnimations = (container: HTMLElement): Animation[] => {
  return getLiveAnimations(container).filter((anim) => isPulseAnimation(anim));
};

interface AboutVariantAnimationProps {
  isActive?: boolean;
  variant: "waterline" | "submersion";
}

const AboutVariantAnimation: React.FC<AboutVariantAnimationProps> = ({ isActive = true, variant }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const unfoldedBloomRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<SVGSVGElement>(null);
  const surfaceRef = useRef<SVGPathElement>(null);
  const wakeRef = useRef<SVGGElement>(null);
  const wakePathsRef = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!isActive || !containerRef.current || !svgWrapperRef.current) return;

    let ctx: gsap.Context | null = null;
    let submersion: ReturnType<typeof createBowSubmersion> | null = null;
    let disposed = false;

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

      // Query live unfolding animations dynamically on every scrub frame
      // This prevents newly spawned browser animation instances (e.g. in Brave / mobile
      // layer re-rasterization) from remaining stuck at currentTime = 0
      if (containerRef.current) {
        const unfoldingAnims = getLiveUnfoldingAnimations(containerRef.current);
        for (let i = 0; i < unfoldingAnims.length; i++) {
          try {
            if (unfoldingAnims[i].playState !== "paused") {
              unfoldingAnims[i].pause();
            }
            unfoldingAnims[i].currentTime = time;
          } catch {}
        }
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
      if (manifesto) gsap.set(manifesto, { autoAlpha: 1, y: 0 });

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const bow = { progress: 0 };
      submersion = variant === "submersion" && !reducedMotion ? createBowSubmersion(stage) : null;
      const geometry = { width: 0, height: 0, x: 0, top: 0, logoHeight: 0 };
      const logo = containerRef.current?.querySelector("#Trillex_Main_No_BG_1");

      // Cache the bow and stationary glyph positions only on layout refresh.
      const measureBow = () => {
        if (!logo || !svgWrapperRef.current) return;
        const stageRect = stage.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();
        const currentY = Number(gsap.getProperty(svgWrapperRef.current, "y")) || 0;
        geometry.width = stageRect.width;
        geometry.height = stageRect.height;
        waterRef.current?.setAttribute("viewBox", `0 0 ${geometry.width} ${geometry.height}`);
        geometry.x = logoRect.left + logoRect.width / 2 - stageRect.left;
        geometry.top = logoRect.top - stageRect.top - currentY;
        geometry.logoHeight = logoRect.height;
        submersion?.measure(geometry.x, geometry.top + geometry.logoHeight * 0.12, restingY);
      };

      const renderCrossing = () => {
        if (variant === "submersion") {
          submersion?.render(bow.progress);
          return;
        }
        const { width, height, x, top, logoHeight } = geometry;
        const tip = top + restingY * (1 - bow.progress) + logoHeight * 0.12;
        const spread = Math.min(width * 0.17, height * 0.16);
        const contour = (offset: number) => {
          const crest = tip + offset;
          const edge = crest + spread;
          return `M -20 ${edge} C ${x * 0.40} ${edge + 8}, ${x * 0.74} ${crest + 28}, ${x} ${crest} C ${x + (width - x) * 0.26} ${crest + 28}, ${x + (width - x) * 0.60} ${edge + 8}, ${width + 20} ${edge}`;
        };
        surfaceRef.current?.setAttribute("d", `${contour(0)} L ${width + 20} ${height + 20} L -20 ${height + 20} Z`);
        wakePathsRef.current.forEach((path, i) => {
          path?.setAttribute("d", contour(i * (8 + bow.progress * 9)));
        });
      };

      // Calculate resting Y so logo midpoint aligns exactly with bottom of viewport (half visible)
      let restingY = 0;
      const calculateRestingY = () => {
        if (!containerRef.current || !svgWrapperRef.current) return 0;
        if (!logo) return 0;

        const currentY =
          (gsap.getProperty(svgWrapperRef.current, "y") as number) || 0;
        const logoRect = logo.getBoundingClientRect();
        const stageTop = stage.getBoundingClientRect().top;
        const logoTopUnconstrained = logoRect.top - stageTop - currentY;
        const logoCenterY = logoRect.top + logoRect.height * 0.5 - stageTop - currentY;
        const isMobile = window.innerWidth < 768;

        // Exactly align logo midpoint with bottom of viewport so icon is half visible (resting folded apex state)
        let targetY = window.innerHeight - logoCenterY;

        // Clamp in short/compact viewports: ensure the top edge of the logo cannot exceed
        // the bottom boundary of the manifesto footer (+ 40px safety buffer on mobile, 50px on desktop)
        if (manifesto) {
          const footer =
            (manifesto.querySelector(".manifesto-footer") as HTMLElement | null) ||
            manifesto;
          const footerRect = footer.getBoundingClientRect();
          const buffer = isMobile ? 40 : 50;
          const manifestoY = Number(gsap.getProperty(manifesto, "y")) || 0;
          const minSafeY = footerRect.bottom - stageTop - manifestoY + buffer - logoTopUnconstrained;
          if (targetY < minSafeY) {
            targetY = minSafeY;
          }
        }

        return targetY;
      };

      // The SVG itself moves during unfolding; always measure its folded pose.
      scrub(0);
      restingY = calculateRestingY();
      gsap.set(svgWrapperRef.current, { y: restingY, force3D: true });
      measureBow();
      renderCrossing();
      if (variant === "waterline") gsap.set(wakeRef.current, { opacity: 0 });

      // Scrub proxy object for GSAP tween
      const scrubProxy = { progress: 0 };

      // One reversible timeline owns the entire pinned sequence.
      const tl = gsap.timeline({
        scrollTrigger: {
          id: `about-${variant}-timeline`,
          trigger: stage,
          start: "top top",
          end: () =>
            `+=${window.innerHeight * (window.innerWidth < 768 ? 1.8 : 3.2)}`,
          pin: true,
          scrub: window.innerWidth < 768 ? true : 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            scrub(0);
            restingY = calculateRestingY();
            measureBow();
          },
          onRefresh: () => {
            renderCrossing();
            scrub(scrubProxy.progress);
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
      const holdDuration = 0.35;
      const transitionStartTime = point1Time + holdDuration;
      const crossingDuration = reducedMotion ? 0 : variant === "waterline" ? 3.2 : 3.6;
      const submergedTime = transitionStartTime + crossingDuration;
      const unfoldStartTime = transitionStartTime + crossingDuration * (variant === "waterline" ? 1 : 0.72);

      // Preserve the first two prototypes: spatial waterline or anchored ink.
      tl.set(svgWrapperRef.current, { y: () => restingY }, 0);
      if (reducedMotion) {
        tl.set(svgWrapperRef.current, { y: 0 }, transitionStartTime);
      } else {
        tl.fromTo(svgWrapperRef.current, { y: () => restingY }, {
          y: 0,
          duration: crossingDuration,
          ease: "sine.inOut",
        }, transitionStartTime);
        tl.fromTo(bow, { progress: 0 }, {
          progress: 1,
          duration: crossingDuration,
          ease: "sine.inOut",
          onUpdate: renderCrossing,
        }, transitionStartTime);
        if (variant === "waterline") {
          if (manifesto) {
            tl.fromTo(manifesto, { y: 0 }, {
              y: () => geometry.height * 0.52,
              duration: crossingDuration,
              ease: "sine.inOut",
            }, transitionStartTime);
          }
          tl.to(wakeRef.current, { opacity: 1, duration: 0.6, ease: "sine.out" }, transitionStartTime);
          tl.to(wakeRef.current, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, unfoldStartTime - 0.35);
        }
      }
      if (manifesto) {
        // All ink is already submerged here. Reverse restores it before
        // the glyphs refract back into their original positions.
        tl.set(manifesto, { autoAlpha: 0 }, submergedTime);
      }

      // 4. Reveal the diagram into the calm space behind the bow.
      tl.set(scrubProxy, { progress: 0 }, 0);
      tl.fromTo(
        scrubProxy,
        { progress: 0 },
        {
          progress: 1,
          duration: 3.4,
          ease: "none",
          onUpdate: () => {
            scrub(scrubProxy.progress);
          },
        },
        unfoldStartTime
      );
      // A brief fully unfolded rest before the pin releases into Services.
      tl.to({}, { duration: 0.45 });
    }, stage);

    const syncLayout = () => {
      ensurePulseRunning();
      ScrollTrigger.refresh();
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.resize();
      }
    };

    const rafId = requestAnimationFrame(syncLayout);
    document.fonts.ready.then(() => { if (!disposed) syncLayout(); });
    let stageWidth = stage.clientWidth;
    let stageHeight = stage.clientHeight;
    const resizeObserver = new ResizeObserver(() => {
      if (disposed || (stage.clientWidth === stageWidth && stage.clientHeight === stageHeight)) return;
      stageWidth = stage.clientWidth;
      stageHeight = stage.clientHeight;
      syncLayout();
    });
    resizeObserver.observe(stage);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (ctx) ctx.revert();
      submersion?.dispose();
    };
  }, [isActive, variant]);

  return (
    <>
      {variant === "waterline" && (
        <svg
          ref={waterRef}
          className="about-bow-water absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 15 }}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="about-wake-light" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#eaeaea" stopOpacity="0" />
              <stop offset="0.34" stopColor="#eaeaea" stopOpacity="0.06" />
              <stop offset="0.5" stopColor="#eaeaea" stopOpacity="0.26" />
              <stop offset="0.66" stopColor="#eaeaea" stopOpacity="0.06" />
              <stop offset="1" stopColor="#eaeaea" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path ref={surfaceRef} fill="#050505" style={{ filter: "blur(2px)" }} />
          <g ref={wakeRef} fill="none" stroke="url(#about-wake-light)" strokeWidth="0.8">
            {[1, 0.45, 0.18].map((opacity, i) => (
              <path key={i} ref={(path) => { wakePathsRef.current[i] = path; }} opacity={opacity} />
            ))}
          </g>
        </svg>
      )}
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
          className="w-full max-w-7xl px-2 sm:px-6 md:px-12 h-full flex items-center justify-center relative z-10 will-change-transform"
        >
          <div className="relative w-full max-h-[90vh] aspect-[16/9] flex items-center justify-center scale-[1.3] sm:scale-100 origin-center transition-transform duration-300">
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center pointer-events-none select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain relative z-10"
              dangerouslySetInnerHTML={{ __html: ECOSYSTEM_SVG_DATA }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default React.memo(AboutVariantAnimation);
