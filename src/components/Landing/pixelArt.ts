export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}

// Rows of letters -> rects (one unit per letter); runs of the same letter
// merge into one rect. Letters missing from `colors` are transparent.
export const spriteRects = (
  rows: string[],
  colors: Record<string, string>,
): PixelRect[] => {
  const rects: PixelRect[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x;
      while (end < row.length && row[end] === ch) end++;
      if (colors[ch]) rects.push({ x, y, w: end - x, h: 1, c: colors[ch] });
      x = end;
    }
  });
  return rects;
};

// Small deterministic RNG so star fields look the same on every render.
export const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
