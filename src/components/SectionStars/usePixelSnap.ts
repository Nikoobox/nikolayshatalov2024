import { RefObject, useEffect } from "react";

const MATRIX = /matrix\(([^)]+)\)/;

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
        const cx = Math.round(e) - e;
        const cy = Math.round(f) - f;
        const det = a * d - b * c || 1;
        const dx = (d * cx - c * cy) / det;
        const dy = (a * cy - b * cx) / det;
        sprite.style.translate = `${dx.toFixed(3)}px ${dy.toFixed(3)}px`;
      }
      frame = requestAnimationFrame(snap);
    };
    snap();
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
