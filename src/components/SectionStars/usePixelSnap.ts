import { RefObject, useEffect } from "react";

const MATRIX = /matrix\(([^)]+)\)/;

// Keeps flying sprites on whole screen pixels. The flight animations move
// smoothly (sub-pixel), so every frame the sprite inside each ship is nudged
// by whatever fraction is left over. Movement turns slightly steppy, which
// suits the pixel style, and the pixels stay sharp.
export const usePixelSnap = (refs: RefObject<HTMLElement>[]) => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const snap = () => {
      for (const { current: el } of refs) {
        const sprite = el?.firstElementChild as HTMLElement | null;
        if (!el || !sprite) continue;
        const match = MATRIX.exec(getComputedStyle(el).transform);
        if (!match) {
          sprite.style.translate = "";
          continue;
        }
        const [a, b, c, d, e, f] = match[1].split(",").map(Number);
        // screen offset to the nearest whole pixel...
        const cx = Math.round(e) - e;
        const cy = Math.round(f) - f;
        // ...turned into the ship's own (rotated) frame
        const det = a * d - b * c || 1;
        const dx = (d * cx - c * cy) / det;
        const dy = (a * cy - b * cx) / det;
        sprite.style.translate = `${dx.toFixed(3)}px ${dy.toFixed(3)}px`;
      }
      frame = requestAnimationFrame(snap);
    };
    snap();
    return () => cancelAnimationFrame(frame);
    // refs are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
