import { FC, useState } from "react";
import { IoMdPhonePortrait, IoMdDesktop, IoMdLaptop } from "react-icons/io";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

import { ProjectProps } from "./ProjectProps";
import { COLORS } from "../../theme/";

const BORDER_COLORS = [
  COLORS.PURPLE_ACCENT,
  COLORS.GREEN_ACCENT,
  COLORS.TEAL_ACCENT,
  COLORS.YELLOW_ACCENT,
  COLORS.RED_ACCENT,
];

const getRandomColor = () =>
  BORDER_COLORS[Math.floor(Math.random() * BORDER_COLORS.length)];

const StyledBox = styled(Box)(({ theme }) => ({
  color: "white",
  "& .project-image": {
    borderRadius: "16px",
    height: "100px",
    minHeight: "260px",
    width: "100%",
    objectFit: "cover",
    position: "abosulte",
  },
  "& .icon": {
    color: theme.palette.customColors.grey,
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  "& .tool": {
    margin: "2px 10px 8px 2px",
    padding: "5px 10px",
    borderRadius: theme.spacing(2),
    background: theme.palette.customColors.greyLitest,
  },
  "& .link": {
    textDecoration: "none",
  },
}));

const Project: FC<ProjectProps> = ({
  name,
  img,
  tools,
  info,
  address,
  repo,
  isResponsive,
  showLink,
  showRepo,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const theme = useTheme();

  const handleOnMouseOver = () => {
    setIsHovered(true);
  };

  const handleOnMouseOut = () => {
    setIsHovered(false);
  };

  const techTools = tools.map((tool) => (
    <Typography color="common.black" className="tool" key={tool}>
      {tool}
    </Typography>
  ));

  return (
    <StyledBox width="40%">
      <Box
        width="100%"
        height="260px"
        onMouseOver={handleOnMouseOver}
        onMouseOut={handleOnMouseOut}
        sx={{ position: "relative" }}
      >
        <img className="project-image" src={img} />
        <Box
          width="100%"
          height="260px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={4}
          sx={{
            backgroundColor: theme.palette.common.black,
            opacity: isHovered ? 0.9 : 0,
            position: "absolute",
            top: 0,
            borderRadius: theme.spacing(2),
            transition: "opacity 0.3s ease-out",
            border: `3px solid ${getRandomColor()}`,
          }}
        >
          {showLink && (
            <a
              href={`${address}`}
              rel="noopener noreferrer"
              target="_blank"
              className="link"
            >
              <Typography variant="h6" color="common.white">
                Live Link
              </Typography>
            </a>
          )}

          {showRepo && (
            <a
              href={`${repo}`}
              rel="noopener noreferrer"
              target="_blank"
              className="link"
            >
              <Typography variant="h6" color="common.white">
                Repo
              </Typography>
            </a>
          )}
          {/* overview && (
              <button className="overview_link" onClick={handleClick}>
                Overview
              </button>
              ); */}
          {/* </Box> */}
        </Box>
      </Box>

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
