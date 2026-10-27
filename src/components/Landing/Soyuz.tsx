import { FC, useMemo } from "react";

import { useTheme } from "@mui/material/styles";

import PixelSprite from "./PixelSprite";
import { spriteRects } from "./pixelArt";

// Simplified early Soyuz (1969) in profile, nose to the left, on a chunky
// low-res grid: orbital module, bell-shaped descent module, service module with a
// nozzle, and two small solar panel wings.
// "active" (Soyuz 4) has a docking probe; "passive" (Soyuz 5) a docking cup.
// Hull is a top-to-bottom gradient: W white, V near-white, L light grey,
// M shade / strut. P panel, N panel line.
// 11x11 chunky grid; the centerline (NOSE_ROW) carries the probe / cup
const BODY = [
  "......PPP..",
  "......NNN..",
  ".......M...",
  ".....WWWWW.",
  ".WW.WVVVVV.",
  ".VVVVVVVVVM",
  ".LL.LLLLLL.",
  ".....MMMMM.",
  ".......M...",
  "......NNN..",
  "......PPP..",
];
const NOSE_ROW = 5;

// geometry other components need (in sprite units)
export const ORBITAL_TOP_ROW = 4; // top of the orbital module
export const ORBITAL_CENTER_COL = 1.5; // its center, counted from the nose
export const PROBE_DEPTH = 1; // how far the probe reaches into the cup

const withNose = (variant: Variant) =>
  BODY.map((row, y) => {
    const chars = row.split("");
    if (variant === "active" && y === NOSE_ROW) {
      // probe sticking out of the nose
      chars[0] = "L";
    }
    if (variant === "passive" && (y === NOSE_ROW - 1 || y === NOSE_ROW + 1)) {
      // cup: two lips with a gap between them for the probe
      chars[0] = "M";
    }
    return chars.join("");
  });

type Variant = "active" | "passive";

const ROWS: Record<Variant, string[]> = {
  active: withNose("active"),
  passive: withNose("passive"),
};

export const SOYUZ_WIDTH = BODY[0].length;
export const SOYUZ_HEIGHT = BODY.length;

const PANEL = "#9AA0A8";
const PANEL_LINE = "#4A5058";
const SHADE = "#7C828B";
const NEAR_WHITE = "#ECEEF0";

interface Props {
  variant?: Variant;
}

const Soyuz: FC<Props> = ({ variant = "active" }) => {
  const theme = useTheme();

  const rects = useMemo(() => {
    const { white } = theme.palette.common;
    const { greyAccent } = theme.palette.customColors;
    return spriteRects(ROWS[variant], {
      W: white,
      V: NEAR_WHITE,
      L: greyAccent,
      M: SHADE,
      P: PANEL,
      N: PANEL_LINE,
    });
  }, [theme, variant]);

  return (
    <PixelSprite rects={rects} width={SOYUZ_WIDTH} height={SOYUZ_HEIGHT} />
  );
};

export default Soyuz;
