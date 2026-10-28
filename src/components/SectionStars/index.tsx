import { FC, useEffect, useRef } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { seededRandom } from "../Landing/pixelArt";
import DockingSoyuz from "./DockingSoyuz";
import SputnikFlight from "./SputnikFlight";
import SpacePopup from "./SpacePopup";

const blink = keyframes`
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.9; }
`;

const PIXEL_COUNT = 120;
const DAY_GREY = "#9AA0A8";
const DAY_SIZE_SCALE = 3;
const TINTS = ["#9AD4FF", "#A8F0E0", "#FFE9A8", "#FFC9D9"];
const DAY_COLORS = ["#FF8FA3", "#FFC94D", "#7FB2FF", "#B18CFF"];

const LAYER_DEPTHS = [0.08, 0.16, 0.24];

const PIXELS = (() => {
  const random = seededRandom(29);
  return Array.from({ length: PIXEL_COUNT }, (_, i) => ({
    left: `${(random() * 100).toFixed(2)}%`,
    top: `${(random() * 100).toFixed(2)}%`,
    size: random() < 0.75 ? 2 : 4,
    tint: i % 4 === 1 ? TINTS[Math.floor(i / 4) % TINTS.length] : undefined,
    dayColor:
      i % 4 === 2
        ? [...DAY_COLORS, null][Math.floor(i / 4) % (DAY_COLORS.length + 1)]
        : undefined,
    isDim: random() < 0.4,
    delay: `${(random() * 8).toFixed(2)}s`,
    duration: `${(3 + random() * 5).toFixed(2)}s`,
  }));
})();

interface Props {
  withShips?: boolean;
}

const SectionStars: FC<Props> = ({ withShips = true }) => {
  const theme = useTheme();
  const { white } = theme.palette.common;
  const { greyAccent, tealAccent } = theme.palette.customColors;
  const isDarkMode = theme.palette.mode === "dark";
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const { top, height } = root.getBoundingClientRect();
      const progress = Math.min(
        Math.max(window.innerHeight - top, 0),
        height + window.innerHeight,
      );
      root.style.setProperty("--section-y", String(Math.round(progress)));
      const inSections = top < window.innerHeight * 0.5;
      root.style.setProperty("--sputnik-opacity", inSections ? "1" : "0");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Box
      ref={rootRef}
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -1,
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important", transform: "none !important" },
        },
      }}
    >
      {LAYER_DEPTHS.map((depth, layer) => (
        <Box
          key={depth}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "-100vh",
            height: "calc(100% + 100vh)",
            transform: `translate3d(0, calc(var(--section-y, 0) * ${depth} * 1px), 0)`,
            willChange: "transform",
          }}
        >
          {PIXELS.map((pixel, i) =>
            i % LAYER_DEPTHS.length !== layer ||
            (!isDarkMode && i % 2 === 1) ? null : (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  left: pixel.left,
                  top: pixel.top,
                  width: isDarkMode ? pixel.size : pixel.size * DAY_SIZE_SCALE,
                  height: isDarkMode ? pixel.size : pixel.size * DAY_SIZE_SCALE,
                  background: isDarkMode
                    ? (pixel.tint ?? (pixel.isDim ? greyAccent : white))
                    : pixel.dayColor !== undefined
                      ? (pixel.dayColor ?? tealAccent)
                      : pixel.isDim
                        ? greyAccent
                        : DAY_GREY,
                  opacity: 0.25,
                  animation: `${blink} ${pixel.duration} steps(2, jump-none) ${pixel.delay} infinite`,
                }}
              />
            ),
          )}
        </Box>
      ))}

      {withShips && (
        <Box
          data-space-layer
          sx={{
            position: "fixed",
            inset: 0,
            overflow: "hidden",
            opacity: "var(--sputnik-opacity, 0)",
            transition: "opacity 0.6s ease",
            "@media (prefers-reduced-motion: reduce)": { display: "none" },
          }}
        >
          <DockingSoyuz />
          <SputnikFlight />
        </Box>
      )}
      {withShips && <SpacePopup />}
    </Box>
  );
};

export default SectionStars;
