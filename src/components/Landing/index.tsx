import { FC } from "react";
import { Link as LinkScroll } from "react-scroll";
import { HiChevronDown } from "react-icons/hi";
import Wave from "react-wavify";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

import ParticlesTS from "./Particles";

const StyledLinkScroll = styled(LinkScroll)(({ theme }) => ({
  color: "white",
  border: "solid white 3px",
  borderRadius: "30px",
  textDecoration: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  display: "inline-flex",
  alignItems: "center",
  marginTop: "16px",
}));

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
  const theme = useTheme();

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
          <StyledLinkScroll href="/" to="" smooth={true} duration={1200}>
            <Typography variant="h2" color="common.white">
              Say Hi
            </Typography>
            <StyledHiChevronDown />
          </StyledLinkScroll>
        </StyledHiBox>
      </Box>

      {/* <Wave
        fill={theme.palette.common.white}
        paused={false}
        style={{
          display: "flex",
          background: theme.palette.primary.main,
          position: "absolute",
          transform: "rotate(180)",
        }}
        options={{
          height: 40,
          amplitude: 40,
          speed: 0.1,
          points: 3,
        }}
      /> */}
    </>
  );
};
export default Landing;
