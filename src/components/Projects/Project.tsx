import { FC, ElementType } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

import { PROJECTS_DATA } from "../Data";
import PageSection from "../PageSection";
import { ProjectProps } from "./ProjectProps";

// const StyledLinkScroll = styled(LinkScroll)({
//   color: "white",
//   border: "solid white 3px",
//   borderRadius: "30px",
//   textDecoration: "none",
//   padding: "8px 16px",
//   display: "inline-flex", // Change display property to inline-flex
//   alignItems: "center",
//   marginTop: "16px",
// });

const StyledBox = styled(Box)({
  color: "white",
  borderRadius: "16px",

  //   textDecoration: "none",
  //   padding: "8px 16px",
  //   display: "inline-flex", // Change display property to inline-flex
  //   alignItems: "center",
  //   marginTop: "16px",
});

const Project: FC<ProjectProps> = (props) => {
  const {
    id,
    name,
    img,
    tools,
    info,
    address,
    repo,
    isResponsive,
    showLink,
    showRepo,
  } = props;
  return (
    <StyledBox>
      <Box>
        <img src={img} />
      </Box>
      <Box></Box>
    </StyledBox>
  );
};

export default Project;
