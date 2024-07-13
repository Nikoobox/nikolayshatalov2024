import { FC } from "react";
import { Link as LinkScroll } from "react-scroll";
import { HiChevronDown } from "react-icons/hi";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

const Landing: FC = () => {
  return (
    <Box>
      <ParticlesTS />

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "50%",
        }}
      >
        <Typography variant="h4" color="common.white">
          Hello, I am Nikolay Shatalov. NYC based frontend developer with
          experience in Javascript, React, Redux, React Native, Ruby, Typescript
          and more.
        </Typography>
        <StyledLinkScroll
          href="/"
          // className="background-button"
          to=""
          smooth={true}
          duration={1200}
        >
          {/* <Box> */}
          <Typography variant="h5" color="common.white">
            Say Hi
          </Typography>
          <HiChevronDown style={{ marginLeft: "6px" }} />
          {/* </Box> */}
        </StyledLinkScroll>
      </Box>
    </Box>
  );
};
export default Landing;
