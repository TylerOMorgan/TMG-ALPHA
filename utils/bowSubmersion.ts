interface SubmergedGlyph {
  element: HTMLElement;
  x: number;
  y: number;
  height: number;
  depth: number;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** Second prototype: anchored letters refract into depth as the bow passes. */
export const createBowSubmersion = (stage: HTMLElement) => {
  const anchors = Array.from(stage.querySelectorAll<HTMLElement>(".submerge-anchor"));
  let glyphs: SubmergedGlyph[] = [];
  let bowX = 0;
  let bowTop = 0;
  let travel = 0;
  let pressureLead = 0;
  let spread = 0;
  let halfWidth = 1;

  const lateralDelay = (x: number) =>
    Math.pow(Math.min(1, Math.abs(x - bowX) / halfWidth), 1.4) * spread;

  const measure = (x: number, top: number, restingY: number) => {
    const stageRect = stage.getBoundingClientRect();
    bowX = x;
    bowTop = top;
    travel = restingY;
    halfWidth = stageRect.width / 2;
    spread = Math.min(115, stageRect.width * 0.12);
    glyphs = [];

    // Shape ink against the original text so kerning and line breaks stay fixed.
    for (const anchor of anchors) {
      const source = anchor.querySelector<HTMLElement>(".submerge-source");
      const text = source?.firstChild;
      if (!text || text.nodeType !== Node.TEXT_NODE) continue;
      const anchorRect = anchor.getBoundingClientRect();
      const range = document.createRange();
      const ink = anchor.querySelectorAll<HTMLElement>(".submerge-glyph");
      let offset = 0;
      for (const element of ink) {
        const length = element.textContent?.length || 0;
        range.setStart(text, offset);
        range.setEnd(text, offset + length);
        offset += length;
        const rect = range.getBoundingClientRect();
        element.style.left = `${rect.left - anchorRect.left}px`;
        glyphs.push({
          element,
          x: rect.left + rect.width / 2 - stageRect.left,
          y: anchorRect.top + anchorRect.height / 2 - stageRect.top,
          height: anchorRect.height,
          depth: -1,
        });
      }
      anchor.dataset.submergeReady = "true";
    }
    pressureLead = Math.max(0, ...glyphs.map((glyph) =>
      bowTop - glyph.y + lateralDelay(glyph.x) + glyph.height * 1.8,
    ));
  };

  const render = (progress: number) => {
    const p = clamp(progress);
    const front = bowTop + travel * (1 - p) - pressureLead * p * p;
    for (const glyph of glyphs) {
      const band = Math.max(38, glyph.height * 1.8);
      const depth = p === 0 ? 0 : smooth((glyph.y - front - lateralDelay(glyph.x)) / band);
      if (Math.abs(depth - glyph.depth) < 0.002) continue;
      glyph.depth = depth;
      if (depth === 0) {
        glyph.element.style.transform = "none";
        glyph.element.style.opacity = "1";
        glyph.element.style.filter = "none";
        glyph.element.style.willChange = "auto";
        continue;
      }
      if (depth === 1) {
        glyph.element.style.opacity = "0";
        glyph.element.style.willChange = "auto";
        continue;
      }
      const side = (glyph.x - bowX) / halfWidth;
      const bend = Math.sin(depth * Math.PI);
      const drift = side * 9 * bend;
      const sink = depth * glyph.height * 0.42;
      const fold = depth * 68;
      const roll = side * bend * 5;
      const compression = 1 - depth * 0.40;
      glyph.element.style.transform = `perspective(500px) translate3d(${drift.toFixed(2)}px, ${sink.toFixed(2)}px, 0) rotateX(${fold.toFixed(2)}deg) rotateZ(${roll.toFixed(2)}deg) scaleY(${compression.toFixed(3)})`;
      glyph.element.style.opacity = (1 - smooth((depth - 0.12) / 0.88)).toFixed(3);
      glyph.element.style.filter = `blur(${(depth * depth * 2.8).toFixed(2)}px)`;
      glyph.element.style.willChange = "transform, opacity";
    }
  };

  const dispose = () => {
    anchors.forEach((anchor) => { delete anchor.dataset.submergeReady; });
    glyphs.forEach(({ element }) => { element.removeAttribute("style"); });
  };
  return { measure, render, dispose };
};
