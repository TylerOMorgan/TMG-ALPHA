# Website performance pass — 16 October 2026

The production build loads each page on its first visit and keeps visited pages mounted to preserve form values and record selection. Home's 3D engine and About's SVG no longer load on a direct Artists or Contact visit. Navigation hover and keyboard focus warm the selected destination's code.

## Measured results

Compared the original and optimized production builds locally on the Artists route, before visiting other pages:

| Measurement | Before | After |
| --- | ---: | ---: |
| JavaScript loaded, uncompressed | 1,505,672 bytes | 416,990 bytes |
| JavaScript loaded, gzip (approximately) | 443 KB | 141 KB |
| Initial DOM elements | 2,232 | 1,056 |
| WebGL canvases mounted | 1 | 0 |
| Four Sound ID images | 3,629,536 bytes | 2,886,564 bytes |

JavaScript loaded on this route is **72.3% smaller**. Lossless WebP alternatives save **742,972 bytes** across the four Sound ID images. The PNG fallbacks remain available. Every decoded pixel, image dimension, and color profile matches its original.

These are local production-build measurements, not a live-site Lighthouse score. The existing preloader sequence remains intact.

## Runtime changes

- Count-up animation updates four text nodes instead of rerendering the entire artist roster every frame. Duration, easing, and final values are unchanged.
- Cursor movement uses GSAP quick setters, skips redundant hover transitions, and cleans up click particles and their animations.
- Dropdown spotlights update their own element without a React render on every pointer event.
- Marquees and ambient founder animations pause offscreen and in background tabs, then resume at the same rate. Inactive Home and About pages stop their animation work.
- ScrollTrigger layout refreshes from route loading, sections, font readiness, and resize notifications share a single refresh per frame. Late-loaded routes refresh after mounting.
- Home selects the correct texture immediately and fetches only the viewport's texture. Home's shader, resolution, colors, and motion remain unchanged.
- React and its generated module wrappers stay separate from Three.js. A build regression check ensures shared wrappers cannot accidentally make the 3D bundle eager again.

## Visual and behavior checks

- Production CSS output is unchanged.
- Artists desktop static hero comparison at 1440 × 900: zero pixel difference in the compared content area.
- About's stage, headline, and footer measurements match at 1440 × 900 and 390 × 844. The compared mobile text area is pixel-identical.
- Home's 3D hero renders correctly; the cumulative streams path is unchanged.
- Record selection, artist name, and genre persist after navigating away and back.
- Both alternate About routes render their original variants.
- No browser errors were reported during these checks.

## Repeatable checks

```sh
npm run build
npx tsc --noEmit
npm run test:assets
npm run test:routes
npm run test:performance
python3 scripts/optimize-sound-images.py --check
git diff --check
```

All checks passed. The image-integrity script requires Pillow and can regenerate the alternatives when run without `--check`. The performance suite checks the built import graph, a 130 KB gzip budget for the shared startup JavaScript, layout-refresh cancellation, and offscreen-animation lifecycle behavior.

References: [React lazy loading](https://react.dev/reference/react/lazy), [GSAP quick setters](https://gsap.com/docs/v3/GSAP/gsap.quickSetter/), [ScrollTrigger refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.refresh/).
