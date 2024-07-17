import { FC } from "react";
import { Link as LinkScroll } from "react-scroll";
import { HiChevronDown } from "react-icons/hi";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import ParticlesTS from "./Particles";

const StyledLinkScroll = styled(LinkScroll)({
  color: "white",
  border: "solid white 3px",
  borderRadius: "30px",
  textDecoration: "none",
  padding: "8px 16px",
  display: "inline-flex", // Change display property to inline-flex
  alignItems: "center",
  marginTop: "16px",
});

const StyledHiChevronDown = styled(HiChevronDown)({
  marginLeft: "6px",
  width: "24px",
  height: "24px",
});

const StyledHiBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  width: "50%",
});

const Landing: FC = () => {
  return (
    <Box>
      <ParticlesTS />

      <StyledHiBox>
        <Typography variant="h1" color="common.white">
          Hello, I am Nikolay Shatalov. NYC based frontend developer with
          experience in Typescript, React, Javascript, React, Redux, React
          Native, Ruby, and more.
        </Typography>
        <StyledLinkScroll href="/" to="" smooth={true} duration={1200}>
          <Typography variant="h2" color="common.white">
            Say Hi
          </Typography>
          <StyledHiChevronDown />
        </StyledLinkScroll>
      </StyledHiBox>
    </Box>
  );
};
export default Landing;
