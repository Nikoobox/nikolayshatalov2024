import { FC } from "react";
import { Link as LinkScroll } from "react-scroll";
import { HiChevronDown } from "react-icons/hi";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import ParticlesTS from "./Particles";
import { FLAGS } from "../../helpers";

const { getFlagNamePerEnvironment } = FLAGS;

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
}));

const StyledLinkScroll = styled(LinkScroll)(({ theme }) => ({
  color: "white",
  border: "solid white 3px",
  borderRadius: theme.spacing(4),
  textDecoration: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  display: "inline-flex",
  alignItems: "center",
  marginTop: theme.spacing(2),
  opacity: 0,
  transition: "opacity 0.3s ease",
  "&.visible": {
    opacity: 1,
  },
}));

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

const handleShowLink = () => {
  setTimeout(() => {
    const linkElement = document.getElementById("say-hi-link");
    if (linkElement) {
      linkElement.classList.add("visible");
    }
  }, 1000);
};

const Landing: FC = () => {
  const formDropzoneFlag = useFeatureFlagEnabled(
    getFlagNamePerEnvironment({
      flagTest: "formDropzoneFlagTest",
      flagProd: "formDropzoneFlagProd",
    })
  );

  console.log("test flag", formDropzoneFlag);
  return (
    <>
      <Box>
        <ParticlesTS />
        <StyledHiBox>
          <Typography variant="h1" color="common.white">
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
                        '<span style="color: #35C2A3;">  Nikolay Shatalov</span>'
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

          <StyledLinkScroll
            id="say-hi-link"
            href="/"
            to="contact-destination"
            smooth={true}
            duration={1200}
          >
            <Typography variant="h2" color="common.white">
              Say Hi
            </Typography>

            <StyledHiChevronDown />
          </StyledLinkScroll>
        </StyledHiBox>
      </Box>
    </>
  );
};
export default Landing;
