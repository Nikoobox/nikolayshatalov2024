import { FC, useMemo } from "react";

import { useTheme } from "@mui/material/styles";

import PixelSprite from "./PixelSprite";
import { PixelRect } from "./pixelArt";

const WIDTH = 9;
const HEIGHT = 9;
const CENTER = { x: 6, y: 3 };
const RADIUS = 2.2;

type Tone = "highlight" | "body" | "shadow" | "antenna";

const buildPixels = () => {
  const pixels = new Map<string, Tone>();
  const set = (x: number, y: number, tone: Tone) =>
    pixels.set(`${x},${y}`, tone);

  for (let x = 0; x <= 3; x++) set(x, 3, "antenna");
  for (let x = 0; x <= 3; x++) set(x, 4 + Math.floor((3 - x) / 2), "antenna");
  for (let i = 0; i <= 3; i++) set(4 - i, 5 + i, "antenna");
  for (let y = 6; y < HEIGHT; y++) set(6, y, "antenna");

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const dx = x - CENTER.x;
      const dy = y - CENTER.y;
      if (Math.hypot(dx, dy) > RADIUS) continue;
      const light = -(dx + dy) / Math.SQRT2;
      set(x, y, light > 1.2 ? "highlight" : light < -1.3 ? "shadow" : "body");
    }
  }

  return [...pixels].map(([key, tone]) => {
    const [x, y] = key.split(",").map(Number);
    return { x, y, tone };
  });
};

const PIXELS = buildPixels();

const SHADOW = "#7C828B";
const ANTENNA = "#9AA0A8";

const Sputnik: FC = () => {
  const theme = useTheme();

  const rects = useMemo(() => {
    const colors: Record<Tone, string> = {
      highlight: theme.palette.common.white,
      body: theme.palette.customColors.greyAccent,
      shadow: SHADOW,
      antenna: ANTENNA,
    };
    return PIXELS.map(({ x, y, tone }): PixelRect => ({
      x,
      y,
      w: 1,
      h: 1,
      c: colors[tone],
    }));
  }, [theme]);

  return <PixelSprite rects={rects} width={WIDTH} height={HEIGHT} />;
};

export default Sputnik;
