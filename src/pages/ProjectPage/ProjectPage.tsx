import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IoMdPhonePortrait, IoMdDesktop, IoMdLaptop } from "react-icons/io";

import { useTheme } from "@mui/material/styles";
import { Box, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { PROJECTS_DATA } from "@/components/Data";
import Page from "@/components/Page";
import { ProjectProps } from "@/components/ProjectCards/ProjectProps";
import {
  PixelArrow,
  PixelTag,
  StatusLight,
  pixelBorder,
} from "@/components/UI";
import SectionStars from "@/components/SectionStars";
import LightModeBackground from "@/components/Landing/LightModeBackground";
import { useDarkTheme, useImageLoaded } from "@/hooks";
import { pixelFontFamily } from "@/theme/variables";
import InfoLinkRow from "./InfoLinkRow";
import ProjectInfoRow from "./ProjectInfoRow";

const IMAGE_HEIGHT = 300;

const AnimatedImageWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  height: `${IMAGE_HEIGHT}px`,
  position: "relative",
  overflow: "hidden",
  boxShadow: pixelBorder(
    theme.palette.mode === "dark"
      ? theme.palette.customColors.greyAccent
      : theme.palette.common.black,
  ),
}));

const AnimatedImage = styled("img")({
  width: "100%",
  height: `${IMAGE_HEIGHT}px`,
  objectFit: "cover",
  position: "absolute",
  left: 0,
  top: 0,
  animation: "moveZoomImage 90s ease-in-out infinite alternate",
  "@keyframes moveZoomImage": {
    "0%": { transform: "scale(1) translate(0px, 0px)" },
    "20%": { transform: "scale(1.16) translate(10px, 5px)" },
    "40%": { transform: "scale(1.24) translate(-10px, 10px)" },
    "60%": { transform: "scale(1.15) translate(15px, -10px)" },
    "80%": { transform: "scale(1.08) translate(-15px, -5px)" },
    "100%": { transform: "scale(1) translate(0px, 0px)" },
  },
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

const StyledBackLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: "8px 0",
  fontFamily: pixelFontFamily,
  fontSize: "12px",
  textDecoration: "none",
  color:
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.common.black,
  "&:hover": { color: theme.palette.customColors.tealAccent },
  "& svg": { transform: "scaleX(-1)" },
}));

const StyledCard = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    padding: theme.spacing(5),
    background: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    boxShadow: `${pixelBorder(
      isDarkMode ? theme.palette.common.white : theme.palette.common.black,
    )}, 12px 12px 0 0 ${
      isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(34, 34, 34, 0.18)"
    }`,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2.5),
    },
  };
});

const slideIn = (delay: number) => ({
  initial: { y: 32, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const ProjectPage = () => {
  const { projectId } = useParams();
  const theme = useTheme();
  const isDarkMode = useDarkTheme();
  const { isLoaded, ref: imgRef, onLoad } = useImageLoaded();

  const projectData: ProjectProps | undefined = PROJECTS_DATA.find(
    (project) => project.id === +projectId!,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    name,
    img,
    year,
    tools,
    infoLong,
    address,
    appStoreUrl,
    repo,
    isResponsive,
    showLink,
    showRepo,
    techDescription,
    testingDescription,
    status,
    statusSimple,
  } = projectData!;

  const iconSx = {
    height: theme.spacing(3),
    width: theme.spacing(3),
  };

  const infoRows = [
    { label: "Year", value: year },
    { label: "Description", value: infoLong },
    {
      label: "Optimized for",
      value: (
        <Box display="flex" gap={1.5} pt="4px">
          {isResponsive && <Box component={IoMdPhonePortrait} sx={iconSx} />}
          <Box component={IoMdLaptop} sx={iconSx} />
          <Box component={IoMdDesktop} sx={iconSx} />
        </Box>
      ),
    },
    {
      label: "Built with",
      value: (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {tools.map((tool) => (
            <PixelTag key={tool}>{tool}</PixelTag>
          ))}
        </Box>
      ),
    },
    {
      label: "Tech description",
      value: (
        <Box display="flex" flexDirection="column" gap={2}>
          <span>{techDescription}</span>
          {appStoreUrl && (
            <span>
              Avarts is also available as a native iOS app built with Capacitor,
              wrapping the web platform in a WKWebView. Safe area insets,
              haptics, and the offline-capable service worker are all wired for
              the native context.
            </span>
          )}
          {testingDescription && <span>{testingDescription}</span>}
        </Box>
      ),
    },
    {
      label: "Status",
      value: (
        <Box display="flex" flexDirection="column" gap={1}>
          {statusSimple && <StatusLight status={statusSimple} />}
          <span>{status}</span>
        </Box>
      ),
    },
  ];

  return (
    <Page
      customBackground={
        isDarkMode ? (
          // same blinking pixels as the main page, minus the flying ships
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: -1,
              background: theme.palette.customColors.charcoalBlack,
            }}
          >
            <SectionStars withShips={false} />
          </Box>
        ) : (
          <LightModeBackground fixed />
        )
      }
    >
      <motion.div {...slideIn(0)}>
        <Box pt={{ xs: 2, sm: 4 }} mb={3}>
          <StyledBackLink to="/">
            <PixelArrow width={6} height={10} />
            BACK
          </StyledBackLink>
        </Box>

        <StyledCard>
          <Box display="flex" flexDirection="column" gap={{ xs: 4, sm: 5 }}>
            <motion.div {...slideIn(0.1)}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: pixelFontFamily,
                  fontSize: { xs: "18px", sm: "24px" },
                  lineHeight: 1.5,
                  mb: 4,
                }}
              >
                {name}
              </Typography>
              <AnimatedImageWrapper>
                {!isLoaded && (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}
                <AnimatedImage
                  ref={imgRef}
                  src={img}
                  alt={name}
                  onLoad={onLoad}
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
              </AnimatedImageWrapper>
            </motion.div>

            {infoRows.map(({ label, value }, idx) => (
              <motion.div key={label} {...slideIn(0.2 + idx / 10)}>
                <ProjectInfoRow label={label} value={value} />
              </motion.div>
            ))}

            {showLink && (
              <motion.div {...slideIn(0.4)}>
                <InfoLinkRow label="Site" link={address} linkLabel={address} />
              </motion.div>
            )}

            {showRepo && (
              <motion.div {...slideIn(0.4)}>
                <InfoLinkRow
                  label="Github"
                  link={repo}
                  linkLabel="Visit github repository"
                />
              </motion.div>
            )}

            {appStoreUrl && (
              <motion.div {...slideIn(0.5)}>
                <ProjectInfoRow
                  label="iOS App"
                  value={
                    <a
                      href={appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                  }
                />
              </motion.div>
            )}
          </Box>
        </StyledCard>
      </motion.div>
    </Page>
  );
};

export default ProjectPage;
