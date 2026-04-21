import { FC } from "react";
import {
  IoMdPhonePortrait,
  IoMdDesktop,
  IoMdLaptop,
  IoIosArrowForward,
} from "react-icons/io";
import { HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { alpha } from "@mui/material/styles";

import { ProjectProps } from "./ProjectProps";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { MyLink } from "../UI";

const LIVE_GREEN_LIGHT = "#16a34a";
const LIVE_TEXT_LIGHT = "#14532d";

const StyledBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const liveAccent = isDarkMode
    ? theme.palette.customColors.greenAccent
    : LIVE_GREEN_LIGHT;
  return {
    width: "100%",
    "& .featured-image": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      borderRadius: theme.spacing(2),
      border: `1px solid ${
        isDarkMode
          ? theme.palette.customColors.blueDark
          : theme.palette.customColors.greyLightest
      }`,
    },
    "& .status-badge": {
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing(0.75),
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 500,
      width: "fit-content",
      lineHeight: "16px",
    },
    "& .status-badge::before": {
      content: '""',
      width: "7px",
      height: "7px",
      borderRadius: "50%",
    },
    "& .status-badge--live": {
      background: alpha(liveAccent, isDarkMode ? 0.2 : 0.18),
      color: isDarkMode ? theme.palette.customColors.greenAccent : LIVE_TEXT_LIGHT,
    },
    "& .status-badge--live::before": {
      background: liveAccent,
      boxShadow: `0 0 8px ${liveAccent}`,
      animation: "livePulse 1.8s ease-in-out infinite",
    },
    "& .status-badge--retired": {
      background: alpha(theme.palette.customColors.grey, 0.15),
      color: isDarkMode
        ? theme.palette.customColors.greyAccent
        : theme.palette.customColors.grey,
    },
    "& .status-badge--retired::before": {
      background: theme.palette.customColors.grey,
    },
    "@keyframes livePulse": {
      "0%, 100%": {
        opacity: 1,
        boxShadow: `0 0 8px ${liveAccent}`,
      },
      "50%": {
        opacity: 0.55,
        boxShadow: `0 0 2px ${liveAccent}`,
      },
    },
    "& .tool": {
      margin: "2px 8px 6px 0",
      padding: "4px 10px",
      borderRadius: theme.spacing(2),
      background: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.common.white,
      border: `1px solid ${
        isDarkMode ? "transparent" : theme.palette.customColors.greyLightest
      }`,
      fontSize: "13px",
    },
    "& .icon": {
      color: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.customColors.grey900,
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    "& .featured-link": {
      color: isDarkMode
        ? theme.palette.common.white
        : theme.palette.customColors.grey900,
      textDecoration: "none",
    },
  };
});

const FeaturedProjectCard: FC<ProjectProps> = ({
  name,
  img,
  imgLanding,
  tools,
  info,
  address,
  repo,
  isResponsive,
  showLink,
  showRepo,
  year,
  id,
  statusSimple,
}) => {
  const { isDarkMode } = useThemeContext();
  const { ref, inView } = useInView({ threshold: 0.15 });

  const techToolColor = isDarkMode
    ? "customColors.grey900"
    : "customColors.grey";
  const techTools = tools.map((tool) => (
    <Typography color={techToolColor} className="tool" key={tool}>
      {tool}
    </Typography>
  ));

  return (
    <motion.div
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      animate={inView && { y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <StyledBox>
        <Box
          display="flex"
          sx={{
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 5 },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              height: { xs: 280, sm: 360, md: "auto" },
              alignSelf: { md: "stretch" },
              flexShrink: 0,
            }}
          >
            <img
              className="featured-image"
              src={imgLanding || img}
              alt={name}
            />
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "24px", sm: "28px", md: "32px" },
                  lineHeight: 1.2,
                  fontWeight: 400,
                }}
              >
                {name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Typography variant="body2" color="grey" noWrap>
                  Est. {year}
                </Typography>
                {isResponsive && <IoMdPhonePortrait className="icon" />}
                <IoMdLaptop className="icon" />
                <IoMdDesktop className="icon" />
              </Box>
            </Box>

            {statusSimple && (
              <Box
                className={`status-badge ${
                  statusSimple === "Live"
                    ? "status-badge--live"
                    : "status-badge--retired"
                }`}
              >
                {statusSimple}
              </Box>
            )}

            <Typography variant="body1">{info}</Typography>

            <Box display="flex" flexWrap="wrap">
              {techTools}
            </Box>

            <Box display="flex" alignItems="center" gap={3} mt={1}>
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

              <Link className="featured-link" to={`/projects/${id}`}>
                <Box display="flex" alignItems="center">
                  <Typography mr={0.5}>View Details</Typography>
                  <IoIosArrowForward />
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </StyledBox>
    </motion.div>
  );
};

export default FeaturedProjectCard;
