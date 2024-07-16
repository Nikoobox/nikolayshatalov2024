import { FC, ElementType } from "react";
import { IoMdPhonePortrait, IoMdDesktop, IoMdLaptop } from "react-icons/io";

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

const StyledBox = styled(Box)(({ theme }) => ({
  color: "white",
  "& .project-image": {
    borderRadius: "16px",
    height: "260px",
    width: "100%",
    objectFit: "cover",
  },
  "& .icon": {
    color: theme.palette.customColors.grey,
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  "& .tool": {
    // color: theme.palette.customColors.greyAccent,
    // font-size: 15px;
    margin: "2px 10px 8px 2px",
    padding: "5px 10px",
    borderRadius: theme.spacing(2),
    background: theme.palette.customColors.greyLitest,
  },
}));

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

  const techTools = tools.map((tool) => (
    // <Box className="tool" key={tool}>
    <Typography color="common.black" className="tool" key={tool}>
      {tool}
    </Typography>
    // </Box>
  ));

  return (
    <StyledBox width="40%">
      <img className="project-image" src={img} />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={1}
      >
        <Typography variant="h4" color="common.black">
          {name}
        </Typography>

        <Box display="flex" gap={1.5}>
          {isResponsive && <IoMdPhonePortrait className="icon" />}
          <IoMdLaptop className="icon" />
          <IoMdDesktop className="icon" />
        </Box>
      </Box>
      <Typography variant="body1" color="common.black" my={1}>
        {info}
      </Typography>
      <Box display="flex" flexWrap="wrap">
        {techTools}
      </Box>
    </StyledBox>
  );
};

export default Project;
