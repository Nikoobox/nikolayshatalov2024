import { FC } from "react";
import { IoMdPhonePortrait, IoMdDesktop, IoMdLaptop } from "react-icons/io";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { Box, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { ProjectProps } from "./ProjectProps";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { useImageLoaded } from "../../hooks";
import {
  MyLink,
  PixelArrow,
  PixelTag,
  StatusLight,
  pixelBorder,
} from "../UI";
import { pixelBodyFontFamily, pixelFontFamily } from "../../theme/variables";

const StyledBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const accent = theme.palette.customColors.tealAccent;
  const shadow = isDarkMode ? "#000" : theme.palette.common.black;

  return {
    width: "100%",
    "& .featured-frame": {
      boxShadow: `${pixelBorder(frame)}, 12px 12px 0 0 ${
        isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(34, 34, 34, 0.18)"
      }`,
    },
    "& .featured-image": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
    "& .icon": {
      color: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.customColors.grey900,
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    "& .featured-link": {
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing(1),
      fontFamily: pixelFontFamily,
      fontSize: "12px",
      lineHeight: 1,
      color: frame,
      textDecoration: "none",
    },
    "& .featured-link--live:hover": {
      textDecoration: "underline",
      textDecorationThickness: "3px",
      textUnderlineOffset: "6px",
    },
    "& .featured-link--details": {
      padding: "14px 20px",
      background: accent,
      color: isDarkMode
        ? theme.palette.customColors.charcoalBlack
        : theme.palette.common.black,
      boxShadow: `${pixelBorder(frame)}, 6px 6px 0 4px ${shadow}`,
      "&:hover": {
        transform: "translate(2px, 2px)",
        boxShadow: `${pixelBorder(frame)}, 2px 2px 0 4px ${shadow}`,
      },
      "&:active": {
        transform: "translate(6px, 6px)",
        boxShadow: pixelBorder(frame),
      },
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
  appStoreUrl,
  repo,
  isResponsive,
  showLink,
  showRepo,
  id,
  statusSimple,
}) => {
  const { isDarkMode } = useThemeContext();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const { isLoaded, ref: imgRef, onLoad } = useImageLoaded();

  const techTools = tools.map((tool) => <PixelTag key={tool}>{tool}</PixelTag>);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 32, opacity: 0 }}
      animate={inView && { y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <StyledBox>
        <Box
          display="flex"
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: { xs: 5, md: 6 },
          }}
        >
          <Box
            className="featured-frame"
            sx={{
              position: "relative",
              width: { xs: "100%", md: "50%" },
              height: { xs: 280, sm: 360, md: "auto" },
              alignSelf: { md: "stretch" },
              flexShrink: 0,
            }}
          >
            {!isLoaded && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
            <img
              ref={imgRef}
              className="featured-image"
              src={imgLanding || img}
              alt={name}
              onLoad={onLoad}
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontFamily: pixelFontFamily,
                fontSize: { xs: "18px", sm: "22px", md: "24px" },
                lineHeight: 1.5,
              }}
            >
              {name}
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
              {statusSimple && <StatusLight status={statusSimple} />}
              <Box display="flex" alignItems="center" gap={1.5}>
                {isResponsive && <IoMdPhonePortrait className="icon" />}
                <IoMdLaptop className="icon" />
                <IoMdDesktop className="icon" />
              </Box>
            </Box>

            {appStoreUrl && (
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                <Box
                  component="img"
                  src={
                    isDarkMode
                      ? "/img/download_on_App_Store/Black_lockup/SVG/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                      : "/img/download_on_App_Store/White_lockup/SVG/Download_on_the_App_Store_Badge_US-UK_RGB_wht_092917.svg"
                  }
                  alt="Download on the App Store"
                  sx={{ height: 36, display: "block" }}
                />
              </a>
            )}

            <Typography
              sx={{
                fontFamily: pixelBodyFontFamily,
                fontSize: { xs: "22px", md: "24px" },
                lineHeight: 1.35,
                letterSpacing: "0.5px",
                color: isDarkMode ? "customColors.greyAccent" : "common.black",
              }}
            >
              {info}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
              {techTools}
            </Box>

            <Box display="flex" alignItems="center" flexWrap="wrap" gap={4} mt={1}>
              <Link
                className="featured-link featured-link--details"
                to={`/projects/${id}`}
              >
                <PixelArrow />
                VIEW DETAILS
              </Link>

              {showLink && (
                <MyLink
                  link={address}
                  className="featured-link featured-link--live"
                  customLabel={<>LIVE LINK</>}
                />
              )}

              {showRepo && (
                <MyLink
                  link={repo}
                  className="featured-link featured-link--live"
                  customLabel={<>GIT REPO</>}
                />
              )}
            </Box>
          </Box>
        </Box>
      </StyledBox>
    </motion.div>
  );
};

export default FeaturedProjectCard;
