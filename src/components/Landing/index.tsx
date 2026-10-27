import { FC, useMemo, useRef, useState } from "react";
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

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
`;

const INTRO_NAME = "Nikolay Shatalov";
const INTRO_BODY =
  "NYC-based Senior Frontend Engineer focused on building scalable, high-performance web applications with TypeScript, React, Next.js, and more.";

// pixel ▼ caret: "Say hi" scrolls down to the contact section
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

// clamp guide:
// min = 140px → top will never be less than 140px
// preferred = 30vh → try to use 30% of the viewport height
// max = 280px → top will never be more than 280px
// Below md the astronaut sits above the box, so the box starts lower.
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

// RPG-style dialog window
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
      // VT323 is very condensed; open it up so the paragraph breathes
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
    // teal text is unreadable on white, so light mode gets a marker highlight
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
    // 8px is the font's native size; smaller blurs
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
  // sprite is 20x17 grid units, 4px each (3px below md)
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
    // blinking ▼ caret, like an old "press to continue" prompt
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

// sits right under the dialog so it never collides with the planet
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

  // Every typed character moves the astronaut's mouth. Must stay referentially
  // stable: the Typewriter component restarts when its options change.
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
        {/* stepped edge into the sections; part of the background so the
            ships (in a later background layer) fly over it */}
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
          {/* fades in together with the dialog */}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease: stepEase(3) }}
        >
          <StyledDialog aria-label="Intro">
            <StyledTag>PLAYER 1</StyledTag>

            <Box position="relative">
              {/* full text holds the box at its final size; screen readers read this copy */}
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
                          .pauseFor(2000)
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
