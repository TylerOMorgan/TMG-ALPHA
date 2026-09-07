import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  (window as any).ScrollTrigger = ScrollTrigger;
}

// Module-level SVG cache to avoid re-fetching 7.5MB asset on page re-visits
let cachedSvgContent: string | null = null;
let fetchPromise: Promise<string> | null = null;

const processSvg = (rawSvg: string): string => {
  let processed = rawSvg
    // Ensure SVG root has a unique ID for scoped styling
    .replace(/<svg\b(?![^>]*\bid=)/i, '<svg id="trillex-ecosystem-svg"')
    // Replace infinite loops with paused single iterations
    .replace(/5s\s+linear\s+infinite/g, "5s linear both paused")
    .replace(/5s\s+linear\s+both(?! paused)/g, "5s linear both paused");

  // Ensure scoped paused rule exists inside SVG <style> to prevent idle autoplay
  if (!processed.includes("animation-play-state: paused !important;")) {
    processed = processed.replace(
      /<style>/i,
      "<style>\n#trillex-ecosystem-svg * {\n  animation-play-state: paused !important;\n}\n"
    );
  }

  return processed;
};

const fetchSvg = async (): Promise<string> => {
  if (cachedSvgContent) return cachedSvgContent;
  if (!fetchPromise) {
    const urls = [
      "/Trillex%20Website%20SVG%20Animations.svg",
      "/Trillex Website SVG Animations.svg"
    ];
    fetchPromise = (async () => {
      let lastErr: any = null;
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            cachedSvgContent = processSvg(text);
            return cachedSvgContent;
          }
        } catch (err) {
          lastErr = err;
        }
      }
      fetchPromise = null;
      throw lastErr || new Error("Failed to load ecosystem SVG from known paths");
    })().catch(err => {
      fetchPromise = null;
      throw err;
    });
  }
  return fetchPromise;
};

// Start preloading immediately in browser environments
if (typeof window !== "undefined") {
  fetchSvg().catch(() => {});
}

// Helper: collect active Web Animation objects from the container subtree dynamically
const getLiveAnimations = (container: HTMLElement): Animation[] => {
  // 1. Native getAnimations on container subtree (modern browsers)
  if (typeof container.getAnimations === "function") {
    try {
      const anims = container.getAnimations({ subtree: true });
      if (anims && anims.length > 0) return anims;
    } catch {}
  }

  // 2. Query element-level animations (fallback for older browser engines)
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
    if (found.length > 0) return found;
  } catch {}

  // 3. Document-level getAnimations fallback (filtered to container subtree)
  if (typeof document !== "undefined" && typeof document.getAnimations === "function") {
    try {
      const docAnims = document.getAnimations();
      for (let i = 0; i < docAnims.length; i++) {
        const target = (docAnims[i].effect as any)?.target;
        if (target && container.contains(target)) {
          found.push(docAnims[i]);
        }
      }
    } catch {}
  }

  return found;
};

const SvgAnimation: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(() => cachedSvgContent);

  // 1. Fetch SVG text if not yet loaded from cache
  useEffect(() => {
    let isMounted = true;
    if (!svgContent) {
      fetchSvg()
        .then(content => {
          if (isMounted) {
            setSvgContent(content);
          }
        })
        .catch(err => {
          console.error("Failed to load ecosystem SVG:", err);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [svgContent]);

  // 2. Link SVG animations to GSAP ScrollTrigger
  useEffect(() => {
    if (!svgContent || !containerRef.current || !sectionRef.current) return;

    let ctx: gsap.Context | null = null;

    // Force layout recalc to ensure browser creates CSS Animation instances
    void containerRef.current.offsetHeight;

    // Scrub all live animations to exact timestamp cleanly in both directions
    const scrub = (progress: number) => {
      const validProgress = typeof progress === "number" && !isNaN(progress) ? progress : 0;
      const clampedProgress = Math.min(Math.max(validProgress, 0), 1);
      // Map [0, 1] to [0ms, 4999ms]
      const time = clampedProgress * 4999;

      if (!containerRef.current) return;
      const liveAnims = getLiveAnimations(containerRef.current);
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

    // Initialize at frame 0
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

      // 2. Scrub Trigger: Begins unfolding immediately from Manifesto unpin (Scroll Position 1)
      gsap.to(proxy, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          id: "svg-scrub",
          start: () => {
            const mST = ScrollTrigger.getById("manifesto-trigger");
            return mST ? mST.end : "top center";
          },
          end: () => {
            const pST = ScrollTrigger.getById("svg-pin") || pinST;
            return pST ? pST.end : "+=120%";
          },
          scrub: 0.5, // 0.5s smooth easing
          invalidateOnRefresh: true,
          onRefresh: () => {
            // Re-sync animations when ScrollTrigger recalculates pins or layout
            scrub(proxy.progress);
          }
        },
        onUpdate: () => {
          scrub(proxy.progress);
        }
      });
    }, sectionRef.current);

    // Helper to safely refresh ScrollTrigger without resetting ongoing scroll progress
    const syncLayout = () => {
      ScrollTrigger.refresh();
      scrub(proxy.progress);
    };

    // Staggered refreshes for layout stabilization with Lenis & preloader
    const rafId = requestAnimationFrame(syncLayout);
    const timer1 = setTimeout(syncLayout, 150);
    const timer2 = setTimeout(syncLayout, 600);
    const timer3 = setTimeout(syncLayout, 2500); // sync with preloader curtain reveal

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (ctx) ctx.revert();
    };
  }, [svgContent]);

  return (
    <section 
      id="about-ecosystem-animation"
      ref={sectionRef}
      className="relative w-full pt-0 sm:pt-2 md:pt-4 pb-16 sm:pb-24 md:pb-32 bg-trillex-black flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Subtle ambient gradient glow in the background matching the brand palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] lg:w-[1100px] h-[300px] md:h-[450px] bg-gradient-to-r from-trillex-orange/10 via-cyan-500/5 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="relative w-full aspect-[16/9] flex items-center justify-center">
          {svgContent ? (
            <div 
              ref={containerRef}
              className="w-full h-full flex items-center justify-center pointer-events-none select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center pointer-events-none select-none" />
          )}
        </div>
      </div>
    </section>
  );
};

export default SvgAnimation;
