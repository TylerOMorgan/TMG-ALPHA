import type gsap from "gsap";

// Resume just before the section enters view. Hidden sections and tabs need no
// frame-by-frame work; pausing retains each animation's position and time scale.
export const pauseWhenOffscreen = (
  element: HTMLElement,
  animations: gsap.core.Animation[],
) => {
  let inView = true;
  const sync = () => {
    const paused = !inView || document.hidden;
    animations.forEach((animation) => animation.paused(paused));
  };
  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { rootMargin: "100px" });
  observer?.observe(element);
  document.addEventListener("visibilitychange", sync);
  sync();
  return () => {
    observer?.disconnect();
    document.removeEventListener("visibilitychange", sync);
  };
};
