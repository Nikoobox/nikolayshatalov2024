const TRANSLATE = /translate\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px\)/;

const hasTransform = (animation: Animation) =>
  (animation.effect as KeyframeEffect | null)
    ?.getKeyframes()
    .some((frame) => frame.transform) ?? false;

export interface Point {
  x: number;
  y: number;
}

export const predictCenter = (
  el: HTMLElement | null,
  msAhead: number,
): Point | null => {
  if (!el) return null;
  const animation = el.getAnimations().filter(hasTransform).at(-1);
  const effect = animation?.effect as KeyframeEffect | null | undefined;
  if (!animation || !effect) return null;

  const timing = effect.getTiming();
  const duration = Number(timing.duration);
  if (!duration) return null;
  const local =
    Number(animation.currentTime ?? 0) - Number(timing.delay ?? 0) + msAhead;
  const progress = Math.min(Math.max(local / duration, 0), 1);

  const frames = effect.getKeyframes().flatMap((frame) => {
    const match = TRANSLATE.exec(String(frame.transform));
    return match
      ? [{ offset: Number(frame.computedOffset), x: +match[1], y: +match[2] }]
      : [];
  });
  if (!frames.length) return null;

  let i = 0;
  while (i < frames.length - 2 && frames[i + 1].offset < progress) i++;
  const from = frames[i];
  const to = frames[Math.min(i + 1, frames.length - 1)];
  const span = to.offset - from.offset;
  const k =
    span > 0 ? Math.min(Math.max((progress - from.offset) / span, 0), 1) : 0;

  return {
    x: from.x + (to.x - from.x) * k,
    y: from.y + (to.y - from.y) * k,
  };
};

export const closestApproach = (
  el: HTMLElement | null,
  points: Array<Point & { msAhead: number }>,
) => {
  let closest = Infinity;
  for (const point of points) {
    const other = predictCenter(el, point.msAhead);
    if (other) {
      closest = Math.min(
        closest,
        Math.hypot(other.x - point.x, other.y - point.y),
      );
    }
  }
  return closest;
};

export const KEEP_APART = 260;

export const IS_PHONE = window.matchMedia("(max-width: 599px)").matches;
