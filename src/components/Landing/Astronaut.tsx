import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { useTheme } from "@mui/material/styles";

import PixelSprite from "./PixelSprite";
import { spriteRects } from "./pixelArt";

// O outline, W helmet, G shade / neck ring, V visor glass,
// H hair, F skin, D skin shade, E eyes, L closed lips, M open mouth.
// Oval visor stepped on every side and sloping shoulders, so it reads as a
// helmet (not a screen on a stand); the face sits inside the glass.
const HELMET = [
  ".......OOOOOO.......",
  ".....OOWWWWWWOO.....",
  "....OWWWWWWWWWWO....",
  "...OWWWWWWWWWWWWO...",
  "..OWWWOOOOOOOOWWGO..",
  "..OWWOHHHHHHHHOWGO..",
  // face turned slightly toward the dialog on the right: features shifted
  // right, hair and shadow showing on the far (left) side
  ".OWWOHHHFFFFFFFOWGO.",
  ".OWOVDDFFEFFEFFVOWGO",
  ".OWOVDDFFFFDFFFVOWGO",
  ".OWOVDDFFFFFFFFVOWGO",
  ".OWWOVDDFFLLFFVOWWGO", // closed lips, swapped below when talking
  "..OWWOVDDFFFFVOWWGO.",
  "..OWWWOOOOOOOOWWGO..",
  "...OWWWWWWWWWWWGO...",
  "....OOGGGGGGGGOO....",
  "..OOWWWWWWWWWWWWOO..",
  ".OWWWWWWWWWWWWWWWGO.",
];
// same two pixels either way; only the color changes, so the mouth never grows
const MOUTH_ROW = 10;
const OPEN_MOUTH = ".OWWOVDDFFMMFFVOWWGO";

// [row, col, pixels] glare hugging the visor's curved top-left edge, painted
// over the glass and face alike so it reads as reflection on the visor;
// R bright glare, S softer glare
const GLARE: [number, number, string][] = [
  [5, 6, "RRS"],
  [6, 5, "RS"],
  [7, 4, "S"],
];
const GLASS = new Set(["V", "H", "F", "D", "E", "L", "M"]);

const withGlare = (rows: string[]) =>
  rows.map((row, y) => {
    const chars = row.split("");
    GLARE.filter(([glareRow]) => glareRow === y).forEach(([, col, px]) =>
      px.split("").forEach((ch, i) => {
        if (GLASS.has(chars[col + i])) chars[col + i] = ch;
      }),
    );
    return chars.join("");
  });

const CLOSED_ROWS = withGlare(HELMET);
const OPEN_ROWS = withGlare(
  HELMET.map((row, y) => (y === MOUTH_ROW ? OPEN_MOUTH : row)),
);
const WIDTH = HELMET[0].length;
const HEIGHT = HELMET.length;

// muted tones so the face sits behind tinted glass instead of popping out
const SKIN = "#D9B39A";
const SKIN_SHADE = "#B48A72";
const HAIR = "#2E241F";
const LIPS = "#A8705E";
const MOUTH = "#5A2A26";

// mouth flips every few characters and shuts once typing pauses
const CHARS_PER_FLAP = 6;
const SETTLE_AFTER_MS = 250;

export interface AstronautHandle {
  talk: (character: string) => void;
}

const Astronaut = forwardRef<AstronautHandle>((_props, ref) => {
  const theme = useTheme();
  const [isTalking, setIsTalking] = useState(false);
  const typedCount = useRef(0);
  const settleTimer = useRef<number>();

  useImperativeHandle(
    ref,
    () => ({
      talk: (character) => {
        window.clearTimeout(settleTimer.current);
        if (!character.trim()) {
          setIsTalking(false);
          return;
        }
        typedCount.current += 1;
        setIsTalking(
          Math.floor(typedCount.current / CHARS_PER_FLAP) % 2 === 0,
        );
        settleTimer.current = window.setTimeout(
          () => setIsTalking(false),
          SETTLE_AFTER_MS,
        );
      },
    }),
    [],
  );

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  const rects = useMemo(() => {
    const { white, black } = theme.palette.common;
    const { greyAccent, charcoalBlack } = theme.palette.customColors;
    return spriteRects(isTalking ? OPEN_ROWS : CLOSED_ROWS, {
      O: theme.palette.mode === "dark" ? charcoalBlack : black,
      W: white,
      G: greyAccent,
      // theme primary blue: light enough to read as glass, not a dark screen
      V: theme.palette.primary.main,
      R: white,
      S: greyAccent,
      H: HAIR,
      F: SKIN,
      D: SKIN_SHADE,
      E: charcoalBlack,
      L: LIPS,
      M: MOUTH,
    });
  }, [isTalking, theme]);

  return <PixelSprite rects={rects} width={WIDTH} height={HEIGHT} />;
});

Astronaut.displayName = "Astronaut";

export default Astronaut;
