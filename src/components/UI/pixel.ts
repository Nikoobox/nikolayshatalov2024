export const pixelBorder = (color: string, size = 4): string =>
  [
    `-${size}px 0 0 0 ${color}`,
    `${size}px 0 0 0 ${color}`,
    `0 -${size}px 0 0 ${color}`,
    `0 ${size}px 0 0 ${color}`,
  ].join(", ");

export const stepEase =
  (steps: number) =>
  (t: number): number =>
    Math.floor(t * steps) / steps;
