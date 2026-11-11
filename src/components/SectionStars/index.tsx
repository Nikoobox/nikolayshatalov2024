import { FC, useEffect, useRef } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { seededRandom } from "../Landing/pixelArt";
import DockingSoyuz from "./DockingSoyuz";
import SputnikFlight from "./SputnikFlight";
import SoyuzHail from "./SoyuzHail";
import SpacePopup from "./SpacePopup";

const blink = keyframes`
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.9; }
`;

const PIXEL_COUNT = 180;
const DAY_GREY = "#9AA0A8";
const DAY_SIZE_SCALE = 3;
const TINTS = ["#9AD4FF", "#A8F0E0", "#FFE9A8", "#FFC9D9"];
const DAY_COLORS = ["#FF8FA3", "#FFC94D", "#7FB2FF", "#B18CFF"];

const LAYER_DEPTHS = [0.08, 0.16, 0.24];

const SCROLL_TIMELINE = "(animation-timeline: view())";
const TIMELINE_NAME = "--section-stars";

const DRIFT = Object.fromEntries(
  LAYER_DEPTHS.map((depth) => [
    depth,
    keyframes`
      from { transform: translate3d(0, 0, 0); }
      to { transform: translate3d(0, ${depth * 100}%, 0); }
    `,
  ]),
);

const outline = (color: string) =>
  [
    `drop-shadow(1px 0 0 ${color})`,
    `drop-shadow(-1px 0 0 ${color})`,
    `drop-shadow(0 1px 0 ${color})`,
    `drop-shadow(0 -1px 0 ${color})`,
  ].join(" ");

const DAY_OUTLINE = outline("#C4C9CF");
const NIGHT_OUTLINE = outline("#4A5058");

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
    const jsParallax =
      !CSS.supports("animation-timeline: view()") &&
      window.matchMedia("(pointer: fine)").matches;

    let frame = 0;
    let lastProgress = -1;
    let lastVisible: boolean | undefined;
    const update = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const { top, height } = root.getBoundingClientRect();
      const progress = Math.min(
        Math.max(window.innerHeight - top, 0),
        height + window.innerHeight,
      );
      const rounded = Math.round(progress);
      if (jsParallax && rounded !== lastProgress) {
        lastProgress = rounded;
        root
          .querySelectorAll<HTMLElement>(":scope > [data-depth]")
          .forEach((layer) => {
            const offset = Math.round(rounded * Number(layer.dataset.depth));
            layer.style.transform = `translate3d(0, ${offset}px, 0)`;
          });
      }
      const inSections = top < window.innerHeight * 0.5;
      if (inSections !== lastVisible) {
        lastVisible = inSections;
        root.style.setProperty("--sputnik-opacity", inSections ? "1" : "0");
      }
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
        viewTimelineName: TIMELINE_NAME,
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important", transform: "none !important" },
        },
      }}
    >
      {LAYER_DEPTHS.map((depth, layer) => (
        <Box
          key={depth}
          data-depth={depth}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "-100vh",
            height: "calc(100% + 100vh)",
            willChange: "transform",
            [`@supports ${SCROLL_TIMELINE}`]: {
              animation: `${DRIFT[depth]} linear both`,
              animationTimeline: TIMELINE_NAME,
              animationRange: "cover",
            },
          }}
        >
          {PIXELS.map((pixel, i) =>
            i % LAYER_DEPTHS.length !== layer ||
            (!isDarkMode && i % 4 === 3) ? null : (
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
            "& svg": { filter: isDarkMode ? NIGHT_OUTLINE : DAY_OUTLINE },
            "@media (prefers-reduced-motion: reduce)": { display: "none" },
          }}
        >
          <DockingSoyuz />
          <SputnikFlight />
          <SoyuzHail />
        </Box>
      )}
      {withShips && <SpacePopup />}
    </Box>
  );
};

export default SectionStars;
