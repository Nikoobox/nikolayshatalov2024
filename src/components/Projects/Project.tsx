import { FC, useState, PointerEvent } from "react";
import { IoMdPhonePortrait, IoMdDesktop, IoMdLaptop } from "react-icons/io";
import { isMobile } from "react-device-detect";
import { HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme, alpha } from "@mui/material/styles";

import { ProjectProps } from "./ProjectProps";
import { COLORS } from "../../theme/";
import MyDialog from "../MyDialog";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { MyLink } from "../UI";

const BORDER_COLORS = [
  COLORS.PURPLE_ACCENT,
  COLORS.GREEN_ACCENT,
  COLORS.TEAL_ACCENT,
  COLORS.YELLOW_ACCENT,
  COLORS.RED_ACCENT,
];

const MOUSE = "mouse";

const getRandomColor = () =>
  BORDER_COLORS[Math.floor(Math.random() * BORDER_COLORS.length)];

const StyledBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
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
      textDecoration: "none",
    },
  };
});

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
  overview,
  year,
  id,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
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

  const handleOverviewClick = () => {
    setIsOpenModal(true);
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
    <>
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
              width="100%"
              height="260px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={4}
              sx={{
                backgroundColor: isHovered
                  ? alpha(theme.palette.customColors.deepSlate, 0.95)
                  : "transparent",
                display: isHovered ? "flex" : "none",
                position: "absolute",
                top: 0,
                borderRadius: theme.spacing(2),
                transition: "display 0.15s ease-out",
                border: `3px solid ${getRandomColor()}`,
              }}
            >
              {showLink && (
                <MyLink label="Live Link" link={address} className="link" />
              )}

              {showRepo && <MyLink label="Repo" link={repo} className="link" />}

              {overview && (
                <Button
                  className="overview-button"
                  onClick={handleOverviewClick}
                >
                  <Typography variant="h2" color="common.white">
                    Overview
                  </Typography>
                </Button>
              )}
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

          {/* <Link to={`/projects/${id}`}>DETAILS </Link> */}

          {/* mobile view */}
          {isMobile && (
            <Box display="flex" gap={3} mt={1.5}>
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
            </Box>
          )}
        </motion.div>
      </StyledBox>

      <MyDialog
        open={isOpenModal}
        onClose={setIsOpenModal}
        title="Overview"
        fullScreen={isMobile}
        maxWidth="lg"
        actions={
          <Box sx={{ "& a": isDarkMode ? { color: "white" } : {} }}>
            <MyLink
              link={repo}
              customLabel={
                <Box display="flex" alignItems="center">
                  <Typography>Visit Git Repo</Typography>
                  <HiOutlineExternalLink style={{ marginLeft: "4px" }} />
                </Box>
              }
            />
          </Box>
        }
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            img: {
              margin: "2px 0",
              height: "100%",
              border: `1px solid ${theme.palette.customColors.greyLitest}`,
            },
          }}
        >
          <img src={overview} alt="overview" />
        </Box>
      </MyDialog>
    </>
  );
};

export default Project;
