import { RefObject, useEffect } from "react";

const SHIP_SELECTOR = "[data-space-info]";
const LAYER_SELECTOR = "[data-space-layer]";
const MIN_OPACITY = 0.3;

type Box = [x: number, y: number, w: number, h: number];

interface Target {
  container: HTMLElement;
  shadow: HTMLElement;
  lastPath: string;
}

interface Ship {
  svg: SVGSVGElement;
  rect: DOMRect;
}

const pixelCache = new WeakMap<SVGSVGElement, Box[]>();
const targets = new Set<Target>();
let frame = 0;

const shipPixels = (svg: SVGSVGElement) => {
  let pixels = pixelCache.get(svg);
  if (!pixels) {
    pixels = Array.from(svg.querySelectorAll("rect")).map((rect) => [
      rect.x.baseVal.value,
      rect.y.baseVal.value,
      rect.width.baseVal.value,
      rect.height.baseVal.value,
    ]);
    pixelCache.set(svg, pixels);
  }
  return pixels;
};

const isVisible = (el: HTMLElement | null) =>
  !el || Number(getComputedStyle(el).opacity) > MIN_OPACITY;

const overlaps = (a: DOMRect, b: DOMRect) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const r = (n: number) => Math.round(n * 10) / 10;

const shipPath = (svg: SVGSVGElement, area: DOMRect) => {
  const ctm = svg.getScreenCTM();
  if (!ctm) return "";
  const { a, b, c, d } = ctm;
  const e = ctm.e - area.left;
  const f = ctm.f - area.top;
  const isFlipped = a * d - b * c < 0;
  const point = (x: number, y: number) =>
    `${r(a * x + c * y + e)} ${r(b * x + d * y + f)}`;

  return shipPixels(svg)
    .map(([x, y, w, h]) => {
      const corners = [
        point(x, y),
        point(x + w, y),
        point(x + w, y + h),
        point(x, y + h),
      ];
      if (isFlipped) corners.reverse();
      return `M${corners.join("L")}Z`;
    })
    .join("");
};

const visibleShips = (): Ship[] =>
  Array.from(document.querySelectorAll<HTMLElement>(SHIP_SELECTOR)).flatMap(
    (ship) => {
      const svg = ship.querySelector("svg");
      if (!svg) return [];
      const rect = ship.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return [];
      if (!isVisible(ship) || !isVisible(ship.closest(LAYER_SELECTOR))) {
        return [];
      }
      return [{ svg, rect }];
    },
  );

const applyPath = (target: Target, path: string) => {
  if (path === target.lastPath) return;
  target.lastPath = path;
  target.shadow.style.visibility = path ? "visible" : "hidden";
  target.shadow.style.clipPath = path ? `path("${path}")` : "";
};

const tick = () => {
  const ships = visibleShips();
  targets.forEach((target) => {
    if (!ships.length) return applyPath(target, "");
    const area = target.container.getBoundingClientRect();
    const path = ships
      .filter(({ rect }) => overlaps(rect, area))
      .map(({ svg }) => shipPath(svg, area))
      .join("");
    applyPath(target, path);
  });
  frame = targets.size ? requestAnimationFrame(tick) : 0;
};

const useShipContrast = (
  containerRef: RefObject<HTMLElement>,
  shadowRef: RefObject<HTMLElement>,
  isActive: boolean,
) => {
  useEffect(() => {
    const container = containerRef.current;
    const shadow = shadowRef.current;
    if (!container || !shadow || !isActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target: Target = { container, shadow, lastPath: "" };
    targets.add(target);
    if (!frame) frame = requestAnimationFrame(tick);

    return () => {
      applyPath(target, "");
      targets.delete(target);
      if (!targets.size && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
  }, [containerRef, shadowRef, isActive]);
};

export default useShipContrast;
