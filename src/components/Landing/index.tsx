import { FC, useRef } from "react";
import { Link as LinkScroll } from "react-scroll";
import { HiChevronDown } from "react-icons/hi";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles"; // ✅ change this (was @mui/system)

import ParticlesTS from "./Particles";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import LightModeBackground from "./LightModeBackground";

// clamp guide:
// min = 140px → top will never be less than 140px
// preferred = 32vh → try to use 32% of the viewport height
// max = 320px → top will never be more than 320px
const StyledTypewriterContainer = styled(Box)(({ theme }) => {
  return {
    position: "absolute",
    top: "clamp(140px, 32vh, 320px)", // moved down
    left: "50%",
    transform: "translateX(-50%)",
    maxWidth: "700px",
    width: "100%",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      top: "clamp(120px, 8vh, 320px)",
      maxWidth: "auto",
      minWidth: "auto",
      width: "100%",
    },
    zIndex: 2,
  };
});

const StyledLinkScroll = styled(LinkScroll)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const mainColor = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const bgColor = isDarkMode
    ? "transparent"
    : theme.palette.customColors.tealAccent;

  return {
    color: mainColor,
    textDecoration: "none",
    border: `2px ${mainColor} solid`,
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
    borderRadius: theme.spacing(3),
    display: "inline-flex",
    alignItems: "center",
    marginTop: theme.spacing(5),
    transition: "all 0.3s ease",
    backgroundColor: bgColor,
  };
});

const StyledHiChevronDown = styled(HiChevronDown)({
  marginLeft: "6px",
  width: "24px",
  height: "24px",
});

const StyledTypewriterWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 700,
  margin: "0 auto",
  wordBreak: "break-word",
  "& .Typewriter__wrapper": {
    display: "inline",
    whiteSpace: "pre-wrap",
    ...theme.typography.h1,
  },
  "& .Typewriter__cursor": {
    display: "inline",
    color: theme.palette.customColors.tealAccent,
    ...theme.typography.h1,
  },
}));

const StyledSayHiBox = styled(Box)(({ theme }) => {
  return {
    position: "absolute",
    bottom: "64px",
    left: "50%",
    zIndex: 3,
    transform: "translate(-50%, -20px)",
    opacity: 0,
    willChange: "transform, opacity",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    "&.visible": {
      opacity: 1,
      transform: "translate(-50%, 0)",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "32px",
    },
  };
});

const Landing: FC = () => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const { isDarkMode, theme } = useThemeContext();

  const handleShowLink = () => {
    setTimeout(() => {
      if (linkRef.current) {
        linkRef.current.classList.add("visible");
      }
    }, 1000);
  };

  return (
    <Box>
      {isDarkMode ? <ParticlesTS /> : <LightModeBackground />}
      <StyledTypewriterContainer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4, ease: "easeOut" }}
        >
          <StyledTypewriterWrapper>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(2200)
                  .changeDelay(45)
                  .typeString("Hello, I am Nikolay Shatalov")
                  .pauseFor(750)
                  .changeDeleteSpeed(5)
                  .deleteChars(16)
                  .typeString(
                    `<span style="color: ${theme.palette.customColors.tealAccent};">Nikolay Shatalov</span>`,
                  )
                  .pauseFor(300)
                  .typeString(
                    ". NYC based frontend engineer with experience in Typescript",
                  )
                  .pauseFor(300)
                  .typeString(", React")
                  .pauseFor(300)
                  .typeString(", Javascript")
                  .pauseFor(300)
                  .typeString(", NextJS")
                  .pauseFor(300)
                  .typeString(", React Native")
                  .pauseFor(300)
                  .typeString(", Node, and more.")
                  .callFunction(() => handleShowLink())
                  .start();
              }}
            />
          </StyledTypewriterWrapper>
        </motion.div>
      </StyledTypewriterContainer>
      <StyledSayHiBox ref={linkRef}>
        <StyledLinkScroll
          id="say-hi-link"
          href="/"
          to="contact-destination"
          smooth={true}
          duration={1200}
        >
          <Typography variant="h3">Say Hi</Typography>

          <StyledHiChevronDown />
        </StyledLinkScroll>
      </StyledSayHiBox>
    </Box>
  );
};
export default Landing;
