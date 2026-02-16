import { FC, useState, PointerEvent } from "react";
import {
  IoMdPhonePortrait,
  IoMdDesktop,
  IoMdLaptop,
  IoIosArrowForward,
} from "react-icons/io";
import { isMobile } from "react-device-detect";
import { HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme, alpha } from "@mui/material/styles";

import { ProjectProps } from "./ProjectProps";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { MyLink } from "../UI";
import { getRandomColor } from "./helpers";

const MOUSE = "mouse";

const StyledBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    ".project-overlay": {
      opacity: 0,
      pointerEvents: "none",
      transition: "opacity 0.3s ease",
    },
    ".project-overlay.overlay--visible ": {
      opacity: 1,
      pointerEvents: "auto",
    },
    "& .project-image": {
      borderRadius: theme.spacing(2),
      height: "260px",
      width: "100%",
      objectFit: "cover",
      border: `1px solid ${
        theme.palette.mode === "light"
          ? theme.palette.customColors.greyLightest
          : theme.palette.customColors.blueDark
      }`,
      objectPosition: "top",
    },
    "& .icon": {
      color: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.customColors.grey900,
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    "& .tool": {
      margin: "2px 10px 8px 2px",
      padding: "5px 10px",
      borderRadius: theme.spacing(2),
      background: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.common.white,
    },
    "& .link": {
      color: "white",
    },
    "& .link-internal": {
      color: "white",
      textDecoration: "none",
    },
    "& .link-internal-mob": {
      color: isDarkMode ? theme.palette.common.white : {},
      textDecoration: "none",
    },
  };
});

const ProjectCard: FC<ProjectProps> = ({
  name,
  img,
  tools,
  info,
  address,
  repo,
  isResponsive,
  showLink,
  showRepo,
  year,
  id,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { isDarkMode } = useThemeContext();
  const { ref, inView } = useInView({
    threshold: 0.2,
  });
  const theme = useTheme();

  const handleOnPointerOver = (e: PointerEvent) => {
    if (!isMobile && e.pointerType === MOUSE) {
      setIsHovered(true);
    }
  };

  const handleOnPointerOut = () => {
    setIsHovered(false);
  };

  const techToolColor = isDarkMode
    ? "customColors.grey900"
    : "customColors.grey";
  const techTools = tools.map((tool) => (
    <Typography color={techToolColor} className="tool" key={tool}>
      {tool}
    </Typography>
  ));

  return (
    <StyledBox
      sx={{
        width: {
          sm: "100%",
          md: "45%",
        },
      }}
    >
      <motion.div
        ref={ref}
        initial={{ y: 30, opacity: 0 }}
        animate={inView && { y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box
          onPointerOver={handleOnPointerOver}
          onPointerOut={handleOnPointerOut}
          width="100%"
          height="260px"
          sx={{
            position: "relative",
            borderRadius: "16px",
          }}
        >
          <img className="project-image" src={img} alt="project" />
          <Box
            className={`project-overlay${isHovered ? " overlay--visible" : ""}`}
            width="100%"
            height="260px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
            sx={{
              backgroundColor: alpha(
                theme.palette.customColors.deepSlate,
                0.95,
              ),
              position: "absolute",
              top: 0,
              borderRadius: theme.spacing(2),
              border: `3px solid ${getRandomColor()}`,
            }}
          >
            {showLink && (
              <MyLink
                className="link"
                link={address}
                customLabel={
                  <Box display="flex" alignItems="center">
                    <Typography mr={0.5} variant="h3">
                      Live Link
                    </Typography>
                    <HiOutlineExternalLink />
                  </Box>
                }
              />
            )}

            {showRepo && (
              <MyLink
                className="link"
                link={repo}
                customLabel={
                  <Box display="flex" alignItems="center">
                    <Typography mr={0.5} variant="h3">
                      Repo
                    </Typography>
                    <HiOutlineExternalLink />
                  </Box>
                }
              />
            )}

            <Link to={`/projects/${id}`} className="link-internal">
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  "& .web-action-icon": {
                    height: theme.spacing(2),
                    width: theme.spacing(2),
                  },
                }}
              >
                <Typography variant="h3">View Details</Typography>

                <IoIosArrowForward className="web-action-icon" />
              </Box>
            </Link>
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={1}
        >
          <Typography variant="h2">{name}</Typography>

          <Box display="flex" gap={1.5}>
            <Typography
              variant="body2"
              color="grey"
              alignSelf="flex-end"
              noWrap
              sx={{ flexShrink: 0 }}
            >
              Est. {year}
            </Typography>
            {isResponsive && <IoMdPhonePortrait className="icon" />}
            <IoMdLaptop className="icon" />
            <IoMdDesktop className="icon" />
          </Box>
        </Box>
        <Typography variant="body1" mt={1.5} mb={2}>
          {info}
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {techTools}
        </Box>

        {/* MOBILE */}
        {isMobile && (
          <Box display="flex" alignItems="center" gap={3} mt={1.5}>
            {showRepo && (
              <Box sx={{ "& a": isDarkMode ? { color: "white" } : {} }}>
                <MyLink
                  link={repo}
                  customLabel={
                    <Box display="flex" alignItems="center">
                      <Typography mr={0.5}>Git Repo</Typography>
                      <HiOutlineExternalLink />
                    </Box>
                  }
                />
              </Box>
            )}

            {showLink && (
              <Box sx={{ "& a": isDarkMode ? { color: "white" } : {} }}>
                <MyLink
                  link={address}
                  customLabel={
                    <Box display="flex" alignItems="center">
                      <Typography mr={0.5}>Live Link</Typography>
                      <HiOutlineExternalLink />
                    </Box>
                  }
                />
              </Box>
            )}

            <Link className="link-internal-mob" to={`/projects/${id}`}>
              <Box display="flex" alignItems="center">
                <Typography mr={0.5}>View Details</Typography>
                <IoIosArrowForward />
              </Box>
            </Link>
          </Box>
        )}
      </motion.div>
    </StyledBox>
  );
};

export default ProjectCard;
