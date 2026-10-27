// Notched pixel border: four offset shadows leave the corners empty.
export const pixelBorder = (color: string, size = 4): string =>
  [
    `-${size}px 0 0 0 ${color}`,
    `${size}px 0 0 0 ${color}`,
    `0 -${size}px 0 0 ${color}`,
    `0 ${size}px 0 0 ${color}`,
  ].join(", ");

// framer-motion easing that moves in discrete jumps, like a sprite
export const stepEase =
  (steps: number) =>
  (t: number): number =>
    Math.floor(t * steps) / steps;
