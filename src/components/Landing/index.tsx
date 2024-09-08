import { FC, useRef } from "react";
import { Link as LinkScroll } from "react-scroll";
import { HiChevronDown } from "react-icons/hi";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import ParticlesTS from "./Particles";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const StyledHiBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  maxWidth: "700px",
  width: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    maxWidth: "auto",
    minWidth: "auto",
    width: "100%",
  },
  zIndex: 2,
}));

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
    border: `solid ${mainColor} 3px`,
    borderRadius: theme.spacing(4),
    textDecoration: "none",
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
    display: "inline-flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
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
  "& .Typewriter__cursor": {
    color: theme.palette.customColors.tealAccent,
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  opacity: 0,
  transition: "all 0.3s ease",
  "&.visible": {
    opacity: 1,
  },
}));

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
      {isDarkMode ? (
        <ParticlesTS />
      ) : (
        <Box
          sx={{
            backgroundColor: theme.palette.backgroundCustom.primary,
            position: "absolute",
            width: "100%",
            height: "100vh",
            left: 0,
            top: 0,
          }}
        ></Box>
      )}
      <StyledHiBox>
        <Typography variant="h1">
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
                      `<span style="color: ${theme.palette.customColors.tealAccent};">  Nikolay Shatalov</span>`
                    )
                    .pauseFor(300)
                    .typeString(
                      ". NYC based frontend developer with experience in Typescript"
                    )
                    .pauseFor(300)
                    .typeString(", React")
                    .pauseFor(300)
                    .typeString(", Javascript")
                    .pauseFor(300)
                    .typeString(", Redux")
                    .pauseFor(300)
                    .typeString(", React Native")
                    .pauseFor(300)
                    .typeString(", Ruby, and more.")
                    .callFunction(() => handleShowLink())
                    .start();
                }}
              />
            </StyledTypewriterWrapper>
          </motion.div>
        </Typography>

        <StyledBox ref={linkRef}>
          <StyledLinkScroll
            id="say-hi-link"
            href="/"
            to="contact-destination"
            smooth={true}
            duration={1200}
          >
            <Typography variant="h2">Say Hi</Typography>

            <StyledHiChevronDown />
          </StyledLinkScroll>
        </StyledBox>
      </StyledHiBox>
    </Box>
  );
};
export default Landing;
