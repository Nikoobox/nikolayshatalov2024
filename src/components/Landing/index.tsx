import { FC } from "react";
import { Link as LinkScroll } from "react-scroll";
import { HiChevronDown } from "react-icons/hi";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import ParticlesTS from "./Particles";

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
}));

const StyledHiChevronDown = styled(HiChevronDown)({
  marginLeft: "6px",
  width: "24px",
  height: "24px",
});

const Landing: FC = () => {
  return (
    <>
      <Box>
        <ParticlesTS />

        <StyledHiBox>
          <Typography variant="h1" color="common.white">
            Hello, I am Nikolay Shatalov. NYC based frontend developer with
            experience in Typescript, React, Javascript, React, Redux, React
            Native, Ruby, and more.
          </Typography>
          <StyledLinkScroll
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
