import { FC, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Link as LinkScroll } from "react-scroll";
import type { LinkProps } from "react-scroll";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import SpaceBackground from "./SpaceBackground";
import LightModeBackground from "./LightModeBackground";
import Astronaut, { AstronautHandle } from "./Astronaut";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { pixelBodyFontFamily, pixelFontFamily } from "../../theme/variables";
import { PixelDivider, pixelBorder, stepEase } from "../UI";
import { seededRandom } from "./pixelArt";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
`;

const INTRO_NAME = "Nikolay Shatalov";
const INTRO_BODY =
  "NYC-based Senior Frontend Engineer focused on building scalable, high-performance web applications with TypeScript, React, Next.js, and more.";

const PIXELATE_ID = "intro-pixelate";
const PIXELATE_DELAY = 800;
const PIXELATE_STEP = 384;
const PIXELATE_SIZES = [12, 8, 6, 4, 2, 0];
const NOISE_MIN_RADIUS = 8;
const NOISE_DENSITY = 0.1;
const NOISE_COLS = 36;
const NOISE_ROWS = 10;

const NOISE = (() => {
  const random = seededRandom(7);
  return Array.from({ length: NOISE_COLS * NOISE_ROWS }, (_, i) => ({
    x: i % NOISE_COLS,
    y: Math.floor(i / NOISE_COLS),
    value: random(),
  })).filter(({ value }) => value < NOISE_DENSITY);
})();

const supportsPixelateFilter = () => {
  const ua = navigator.userAgent;
  return !/AppleWebKit/.test(ua) || /Chrome|Chromium|Android/.test(ua);
};

const PixelNoise: FC<{ density?: number }> = ({ density = NOISE_DENSITY }) => (
  <Box
    component="svg"
    aria-hidden="true"
    viewBox={`0 0 ${NOISE_COLS} ${NOISE_ROWS}`}
    preserveAspectRatio="none"
    shapeRendering="crispEdges"
    sx={(theme) => ({
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      ...(theme.palette.mode === "dark"
        ? {
            "& .noise-a": { fill: theme.palette.common.white, opacity: 0.05 },
            "& .noise-b": { fill: theme.palette.common.black, opacity: 0.35 },
          }
        : {
            "& .noise-a": { fill: theme.palette.common.black, opacity: 0.03 },
            "& .noise-b": { fill: theme.palette.common.black, opacity: 0.06 },
          }),
    })}
  >
    {NOISE.filter(({ value }) => value < density).map(({ x, y, value }) => (
      <rect
        key={`${x}-${y}`}
        className={value < 0.05 ? "noise-b" : "noise-a"}
        x={x}
        y={y}
        width="1"
        height="1"
      />
    ))}
  </Box>
);

const usePixelateIn = () => {
  const [radius, setRadius] = useState(PIXELATE_SIZES[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRadius(0);
      return;
    }
    const timers = PIXELATE_SIZES.map((size, i) =>
      window.setTimeout(
        () => setRadius(size),
        PIXELATE_DELAY + i * PIXELATE_STEP,
      ),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return radius;
};

const PixelateFilter: FC<{ radius: number }> = ({ radius }) => {
  const tile = radius * 2 + 1;
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: "absolute" }}
    >
      <filter
        id={PIXELATE_ID}
        x="-5%"
        y="-10%"
        width="110%"
        height="120%"
        colorInterpolationFilters="sRGB"
      >
        <feFlood x={radius} y={radius} width="1" height="1" />
        <feComposite width={tile} height={tile} />
        <feTile result="grid" />
        <feComposite in="SourceGraphic" in2="grid" operator="in" />
        <feMorphology operator="dilate" radius={radius} />
      </filter>
    </svg>
  );
};

const pixelArrow = (
  <svg
    width="16"
    height="10"
    viewBox="0 0 7 4"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="0" y="0" width="7" height="1" />
    <rect x="1" y="1" width="5" height="1" />
    <rect x="2" y="2" width="3" height="1" />
    <rect x="3" y="3" width="1" height="1" />
  </svg>
);

const StyledIntroContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "clamp(140px, 30vh, 280px)",
  left: "50%",
  transform: "translateX(-50%)",
  width: "calc(100% - 32px)",
  maxWidth: "880px",
  zIndex: 2,
  [theme.breakpoints.down("md")]: {
    top: "clamp(176px, 26vh, 300px)",
  },
}));

const StyledDialog = styled("section")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const background = isDarkMode
    ? theme.palette.customColors.charcoalBlack
    : theme.palette.common.white;
  const innerLine = isDarkMode
    ? theme.palette.customColors.blueDark
    : theme.palette.customColors.greyLightest;
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const dropShadow = isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(34, 34, 34, 0.18)";
  const accent = theme.palette.customColors.tealAccent;

  return {
    position: "relative",
    padding: "48px 48px 44px",
    background,
    boxShadow: `inset 0 0 0 4px ${background}, inset 0 0 0 8px ${innerLine}, ${pixelBorder(frame)}, 12px 12px 0 0 ${dropShadow}`,
    [theme.breakpoints.down("sm")]: {
      padding: "36px 24px",
    },
    "& .intro-title": {
      margin: "0 0 24px",
      fontFamily: pixelFontFamily,
      fontWeight: 400,
      fontSize: "24px",
      lineHeight: "40px",
      [theme.breakpoints.down("md")]: { fontSize: "20px", lineHeight: "36px" },
      [theme.breakpoints.down("sm")]: {
        margin: "0 0 16px",
        fontSize: "16px",
        lineHeight: "28px",
      },
    },
    "& .intro-body": {
      margin: 0,
      fontFamily: pixelBodyFontFamily,
      fontSize: "34px",
      lineHeight: "44px",
      letterSpacing: "0.75px",
      color: isDarkMode
        ? theme.palette.customColors.greyAccent
        : theme.palette.common.black,
      [theme.breakpoints.down("sm")]: {
        fontSize: "26px",
        lineHeight: "34px",
        letterSpacing: "0.5px",
      },
    },
    "& .intro-name": isDarkMode
      ? { color: accent }
      : {
          background: `linear-gradient(transparent 0 55%, ${accent} 55% 90%, transparent 90%)`,
        },
    "& .Typewriter__cursor": {
      display: "inline-block",
      width: "0.55em",
      height: "0.8em",
      marginLeft: "6px",
      overflow: "hidden",
      color: "transparent",
      background: accent,
      animation: `${blink} 1s steps(1, end) infinite`,
    },
    "& .title-done .Typewriter__cursor": {
      display: "none",
    },
  };
});

const StyledTag = styled("div")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    position: "absolute",
    left: "32px",
    top: "-8px",
    padding: "4px 6px",
    background: theme.palette.customColors.tealAccent,
    color: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.black,
    fontFamily: pixelFontFamily,
    fontSize: "8px",
    lineHeight: 1,
    boxShadow: pixelBorder(
      isDarkMode ? theme.palette.common.white : theme.palette.common.black,
    ),
    [theme.breakpoints.down("sm")]: {
      left: "20px",
      top: "-8px",
      padding: "4px 5px",
    },
  };
});

const StyledAstronaut = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: "-100px",
  top: "-8px",
  width: "80px",
  height: "68px",
  [theme.breakpoints.down("md")]: {
    left: 0,
    top: "-80px",
    width: "60px",
    height: "51px",
  },
}));

const StyledSkipButton = styled("button")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: `${theme.spacing(1)} ${theme.spacing(0.5)}`,
    color: isDarkMode
      ? theme.palette.customColors.greyAccent
      : theme.palette.common.black,
    background: "transparent",
    border: 0,
    cursor: "pointer",
    fontFamily: pixelFontFamily,
    fontSize: "10px",
    "&:hover": {
      color: theme.palette.customColors.tealAccent,
    },
  };
});

const StyledLinkScroll = styled(
  LinkScroll as unknown as ComponentType<LinkProps>,
)<LinkProps>(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const shadow = isDarkMode ? "#000" : theme.palette.common.black;

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: "18px 28px",
    background: theme.palette.customColors.tealAccent,
    color: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.black,
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: pixelFontFamily,
    fontSize: "16px",
    boxShadow: `${pixelBorder(frame)}, 6px 6px 0 4px ${shadow}`,
    "& svg": {
      animation: `${blink} 1s steps(1, end) infinite`,
      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
    },
    "&:hover": {
      transform: "translate(2px, 2px)",
      boxShadow: `${pixelBorder(frame)}, 2px 2px 0 4px ${shadow}`,
    },
    "&:active": {
      transform: "translate(6px, 6px)",
      boxShadow: pixelBorder(frame),
    },
    [theme.breakpoints.down("sm")]: {
      padding: "16px 24px",
      fontSize: "14px",
    },
  };
});

const StyledSayHiBox = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2.5),
    marginTop: theme.spacing(7),
    transform: "translateY(-12px)",
    opacity: 0,
    visibility: "hidden",
    "&.visible": {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(5),
    },
  };
});

const Landing: FC = () => {
  const astronautRef = useRef<AstronautHandle>(null);

  const { isDarkMode, theme } = useThemeContext();

  const [skipped, setSkipped] = useState(false);
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(false);
  const pixelRadius = usePixelateIn();
  const isFilterSupported = useMemo(supportsPixelateFilter, []);

  const revealLink = () => setIsLinkVisible(true);

  const handleComplete = () => {
    setIsComplete(true);
    setTimeout(revealLink, 1000);
  };

  const handleSkip = () => {
    setSkipped(true);
    setIsComplete(true);
    revealLink();
  };

  const typewriterOptions = useMemo(
    () => ({
      onCreateTextNode: (character: string, textNode: Text) => {
        astronautRef.current?.talk(character);
        return textNode;
      },
    }),
    [],
  );

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        {isDarkMode ? <SpaceBackground /> : <LightModeBackground />}
        {isDarkMode && (
          <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
            <PixelDivider
              fill={theme.palette.backgroundCustom.secondary}
              background="transparent"
            />
          </Box>
        )}
      </Box>

      <StyledIntroContainer>
        <StyledAstronaut aria-hidden="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4, ease: stepEase(3) }}
            style={{ width: "100%", height: "100%" }}
          >
            <Astronaut ref={astronautRef} />
          </motion.div>
        </StyledAstronaut>

        {!isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5, duration: 0.4, ease: stepEase(2) }}
            style={{ position: "absolute", right: 0, top: -44 }}
          >
            <StyledSkipButton
              type="button"
              onClick={handleSkip}
              aria-label="Skip intro animation"
            >
              SKIP
              <svg
                width="14"
                height="10"
                viewBox="0 0 9 7"
                fill="currentColor"
                shapeRendering="crispEdges"
                aria-hidden="true"
              >
                <rect x="0" y="0" width="1" height="7" />
                <rect x="1" y="1" width="1" height="5" />
                <rect x="2" y="2" width="1" height="3" />
                <rect x="3" y="3" width="1" height="1" />
                <rect x="5" y="0" width="1" height="7" />
                <rect x="6" y="1" width="1" height="5" />
                <rect x="7" y="2" width="1" height="3" />
                <rect x="8" y="3" width="1" height="1" />
              </svg>
            </StyledSkipButton>
          </motion.div>
        )}

        {isFilterSupported && pixelRadius > 0 && (
          <PixelateFilter radius={pixelRadius} />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease: stepEase(3) }}
          style={{
            filter:
              isFilterSupported && pixelRadius > 0
                ? `url(#${PIXELATE_ID})`
                : "none",
          }}
        >
          <StyledDialog aria-label="Intro">
            {isFilterSupported
              ? pixelRadius >= NOISE_MIN_RADIUS && <PixelNoise />
              : pixelRadius > 0 && (
                  <PixelNoise
                    density={
                      (NOISE_DENSITY * pixelRadius) / PIXELATE_SIZES[0]
                    }
                  />
                )}
            <StyledTag>PLAYER 1</StyledTag>

            <Box position="relative">
              <Box
                sx={
                  skipped
                    ? undefined
                    : {
                        userSelect: "none",
                        "&, & *": {
                          color: "transparent !important",
                          background: "none !important",
                        },
                      }
                }
              >
                <Typography component="h1" className="intro-title">
                  Hi, I am <span className="intro-name">{INTRO_NAME}</span>.
                </Typography>
                <Typography component="p" className="intro-body">
                  {INTRO_BODY}
                </Typography>
              </Box>

              {!skipped && (
                <Box aria-hidden="true" sx={{ position: "absolute", inset: 0 }}>
                  <div className={`intro-title${isTitleDone ? " title-done" : ""}`}>
                    <Typewriter
                      options={typewriterOptions}
                      onInit={(typewriter) => {
                        typewriter
                          .pauseFor(2900)
                          .changeDelay(20)

                          .typeString("Hi, I am ")

                          .typeString(
                            `<span class="intro-name">${INTRO_NAME}</span>.`,
                          )
                          .pauseFor(400)
                          .callFunction(() => setIsTitleDone(true))
                          .start();
                      }}
                    />
                  </div>
                  {isTitleDone && (
                    <div className="intro-body">
                      <Typewriter
                        options={typewriterOptions}
                        onInit={(typewriter) => {
                          typewriter
                            .changeDelay(20)

                            .typeString("NYC-based Senior Frontend Engineer")
                            .pauseFor(500)

                            .typeString(" focused on building")
                            .pauseFor(400)

                            .typeString(" scalable, high-performance")
                            .pauseFor(400)

                            .typeString(" web applications")
                            .pauseFor(400)

                            .typeString(" with TypeScript, React, Next.js,")
                            .pauseFor(500)

                            .typeString(" and more.")
                            .pauseFor(500)

                            .callFunction(() => handleComplete())
                            .start();
                        }}
                      />
                    </div>
                  )}
                </Box>
              )}
            </Box>

          </StyledDialog>
        </motion.div>

        <StyledSayHiBox className={isLinkVisible ? "visible" : undefined}>
          <StyledLinkScroll
            id="say-hi-link"
            to="contact-destination"
            smooth={true}
            duration={1200}
          >
            {pixelArrow}
            SAY HI
          </StyledLinkScroll>
        </StyledSayHiBox>
      </StyledIntroContainer>
    </Box>
  );
};
export default Landing;
