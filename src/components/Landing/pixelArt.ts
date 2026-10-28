export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}

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

export const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
