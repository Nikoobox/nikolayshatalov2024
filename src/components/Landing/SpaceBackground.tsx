import { FC, useEffect, useRef } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { seededRandom } from "./pixelArt";

const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
`;

const shoot = keyframes`
  0% { transform: translate(0, 0); opacity: 0; }
  2% { opacity: 1; }
  24% { transform: translate(-1040px, 520px); opacity: 0; }
  100% { transform: translate(-1040px, 520px); opacity: 0; }
`;

const STAR_COUNT = 110;

const SHOOTING_STARS = [
  { left: "78%", top: 70, duration: "30s", delay: "0s" },
  { left: "52%", top: 140, duration: "38s", delay: "15s" },
];

const BLUE_STAR = "#9AD4FF";
const BLUE_STAR_EVERY = 15;

const blueTwinkle = keyframes`
  0%, 100% { background: #FFFFFF; opacity: 1; }
  50% { background: ${BLUE_STAR}; opacity: 0.7; }
`;

const STAR_TINTS = ["#9AD4FF", "#A8F0E0", "#FFE9A8", "#FFC9D9"];
const TINT_EVERY = 5;

const STARS = (() => {
  const random = seededRandom(11);
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const roll = random();
    return {
      isBlue: i % BLUE_STAR_EVERY === 3,
      tint:
        i % TINT_EVERY === 1
          ? STAR_TINTS[Math.floor(i / TINT_EVERY) % STAR_TINTS.length]
          : undefined,
      left: `${(random() * 100).toFixed(2)}%`,
      top: `${(random() * 98).toFixed(2)}%`,
      size: roll > 0.7 ? 2 : 4,
      isSparkle: roll < 0.06,
      isDim: random() < 0.25,
      twinkles: random() < 0.5,
      delay: `${(random() * 3).toFixed(2)}s`,
      duration: `${(1.6 + random() * 2.4).toFixed(2)}s`,
    };
  });
})();

const CONSTELLATION: [number, number][] = [
  [72, 74],
  [77, 71],
  [81.5, 75],
  [85.5, 79],
  [86.5, 87],
  [93, 88],
  [93.5, 80],
];
const CONSTELLATION_LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 3],
];

const ditherMask = (inner: string, outer: string) =>
  `radial-gradient(closest-side, #000 0 ${inner}, rgba(0, 0, 0, 0.5) ${inner} ${outer}, transparent ${outer})`;

const DEPTH = { nebula: 0.6, far: 0.45, mid: 0.3, near: 0.15 };
const STAR_LAYERS = [DEPTH.near, DEPTH.mid, DEPTH.far];

const parallaxLayer = (depth: number) =>
  ({
    position: "absolute",
    inset: 0,
    transform: `translate3d(0, calc(var(--parallax-y, 0) * ${depth} * 1px), 0)`,
    willChange: "transform",
  }) as const;

const SpaceBackground: FC = () => {
  const theme = useTheme();
  const { white } = theme.palette.common;
  const { greyAccent, charcoalBlack, deepSlate } = theme.palette.customColors;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      rootRef.current?.style.setProperty("--parallax-y", String(Math.round(y)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const dither = {
    position: "absolute",
    background: `conic-gradient(${white} 25%, transparent 0 50%, ${white} 0 75%, transparent 0) 0 0 / 8px 8px`,
  } as const;

  return (
    <Box
      ref={rootRef}
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${charcoalBlack} 0%, ${deepSlate} 75%)`,
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important", transform: "none !important" },
          "& .shooting-star": { display: "none" },
        },
      }}
    >
      <Box sx={parallaxLayer(DEPTH.nebula)}>
        <Box
          sx={{
            ...dither,
            right: "-6%",
            top: "52%",
            width: 720,
            height: 420,
            opacity: 0.06,
            mask: ditherMask("45%", "72%"),
          }}
        />
        <Box
          sx={{
            ...dither,
            right: "6%",
            top: -80,
            width: 640,
            height: 360,
            opacity: 0.04,
            mask: ditherMask("40%", "70%"),
          }}
        />
      </Box>

      {STAR_LAYERS.map((depth, layer) => (
        <Box key={depth} sx={parallaxLayer(depth)}>
          {STARS.map((star, i) =>
            i % STAR_LAYERS.length !== layer ? null : (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  left: star.left,
                  top: star.top,
                  width: star.isSparkle ? 4 : star.size,
                  height: star.isSparkle ? 4 : star.size,
                  background: star.tint ?? (star.isDim ? greyAccent : white),
                  boxShadow: star.isSparkle
                    ? `4px 0 0 0 ${white}, -4px 0 0 0 ${white}, 0 4px 0 0 ${white}, 0 -4px 0 0 ${white}`
                    : "none",
                  animation: star.isBlue
                    ? `${blueTwinkle} ${star.duration} steps(2, jump-none) ${star.delay} infinite`
                    : star.twinkles || star.isSparkle
                      ? `${twinkle} ${star.duration} steps(2, jump-none) ${star.delay} infinite`
                      : "none",
                }}
              />
            ),
          )}
        </Box>
      ))}

      <Box
        sx={{
          ...parallaxLayer(DEPTH.mid),
          display: { xs: "none", md: "block" },
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          shapeRendering="crispEdges"
        >
          <g
            stroke={white}
            strokeOpacity={0.22}
            strokeWidth={2}
            strokeDasharray="4 6"
          >
            {CONSTELLATION_LINES.map(([from, to]) => (
              <line
                key={`${from}-${to}`}
                x1={`${CONSTELLATION[from][0]}%`}
                y1={`${CONSTELLATION[from][1]}%`}
                x2={`${CONSTELLATION[to][0]}%`}
                y2={`${CONSTELLATION[to][1]}%`}
              />
            ))}
          </g>
        </svg>
        {CONSTELLATION.map(([x, y]) => (
          <Box
            key={`${x}-${y}`}
            sx={{
              position: "absolute",
              left: `calc(${x}% - 4px)`,
              top: `calc(${y}% - 4px)`,
              width: 8,
              height: 8,
              background: white,
            }}
          />
        ))}
      </Box>

      <Box sx={parallaxLayer(DEPTH.mid)}>
        {SHOOTING_STARS.map((star) => (
          <Box
            key={star.left}
            className="shooting-star"
            sx={{
              position: "absolute",
              left: star.left,
              top: star.top,
              opacity: 0,
              animation: `${shoot} ${star.duration} steps(600, end) ${star.delay} infinite`,
            }}
          >
            {[1, 1, 0.75, 0.6, 0.4, 0.2].map((opacity, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  left: i * 8,
                  top: i === 0 ? 0 : -i * 4,
                  width: 8,
                  height: i === 0 ? 8 : 4,
                  background: i < 3 ? white : greyAccent,
                  opacity,
                }}
              />
            ))}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0 2px, transparent 2px 4px)",
        }}
      />
    </Box>
  );
};

export default SpaceBackground;
