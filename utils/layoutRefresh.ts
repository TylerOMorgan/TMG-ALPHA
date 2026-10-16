import { ScrollTrigger } from "gsap/ScrollTrigger";

let frame: number | null = null;
const requests = new Set<object>();

// Several sections can finish mounting in the same frame. Recalculate pins
// once after their DOM updates, instead of forcing a layout for each section.
export const requestLayoutRefresh = () => {
  const request = {};
  requests.add(request);
  if (frame === null) {
    frame = requestAnimationFrame(() => {
      frame = null;
      requests.clear();
      ScrollTrigger.refresh();
    });
  }
  return () => {
    requests.delete(request);
    if (requests.size === 0 && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };
};
