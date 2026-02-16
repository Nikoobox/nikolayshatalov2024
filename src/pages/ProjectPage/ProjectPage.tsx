import { Link, useParams } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import {
  IoMdPhonePortrait,
  IoMdDesktop,
  IoMdLaptop,
  IoIosArrowRoundBack,
} from "react-icons/io";

import { PROJECTS_DATA } from "@/components/Data";
import Page from "@/components/Page";
import { ProjectProps } from "@/components/ProjectCards/ProjectProps";
import { useDarkTheme } from "@/hooks";
import InfoLinkRow from "./InfoLinkRow";
import { LABEL_MIN_WIDTH, LABEL_FONT_WEIGHT } from "./configs";

const AnimatedImageWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  height: "300px",
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.spacing(2),
}));

const AnimatedImage = styled("img")({
  width: "100%",
  height: "300px",
  objectFit: "cover",
  position: "absolute",
  overflow: "hidden",
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
});

const ToolsBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    "& .tool": {
      margin: "2px 10px 8px 2px",
      padding: "5px 10px",
      borderRadius: theme.spacing(2),
      background: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.common.white,
    },
  };
});

const IconsBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    "& .icon": {
      color: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.customColors.grey900,
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
  };
});

const BackBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    a: {
      textDecoration: "none",
      color: isDarkMode
        ? theme.palette.customColors.greyLightest
        : theme.palette.customColors.grey900,
    },
    "& .icon": {
      height: theme.spacing(4),
      width: theme.spacing(4),
    },
  };
});

const ProjectPage = () => {
  const { projectId } = useParams();
  const theme = useTheme();
  const isDarkMode = useDarkTheme();

  const projectData: ProjectProps | undefined = PROJECTS_DATA.find(
    (project) => project.id === +projectId!,
  );

  const {
    name,
    img,
    year,
    tools,
    infoLong,
    address,
    repo,
    isResponsive,
    showLink,
    showRepo,
    techDescription,
    status,
  } = projectData!;

  const techToolColor = isDarkMode
    ? "customColors.grey900"
    : "customColors.grey";

  const techTools = tools.map((tool: string) => (
    <Typography color={techToolColor} className="tool" key={tool}>
      {tool}
    </Typography>
  ));

  return (
    <Page>
      <BackBox sx={{ paddingTop: { xs: 2, sm: theme.spacing(4) } }}>
        <Link to="/">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IoIosArrowRoundBack className="icon" /> Back
          </Box>
        </Link>
      </BackBox>
      <Box
        mt={{ xs: 2, sm: 1 }}
        p={{ xs: 0, sm: 4 }}
        sx={{
          borderRadius: theme.spacing(2),
          background: {
            xs: "transparent",
            sm: isDarkMode
              ? theme.palette.customColors.charcoalBlack
              : theme.palette.customColors.greyLightest,
          },
        }}
      >
        <Box width="100%" display="flex" flexDirection="column" gap={4}>
          <AnimatedImageWrapper>
            <AnimatedImage src={img} alt={name} />
          </AnimatedImageWrapper>

          <Box
            display="flex"
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              minWidth={LABEL_MIN_WIDTH}
              color={
                isDarkMode ? theme.palette.customColors.greyAccent : "inherit"
              }
              variant="h3"
              sx={{ fontWeight: LABEL_FONT_WEIGHT }}
            >
              Project name
            </Typography>
            <Typography variant="h3">{name}</Typography>
          </Box>

          <Box
            display="flex"
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              minWidth={LABEL_MIN_WIDTH}
              color={
                isDarkMode ? theme.palette.customColors.greyAccent : "inherit"
              }
              variant="h3"
              sx={{ fontWeight: LABEL_FONT_WEIGHT }}
            >
              Year
            </Typography>
            <Typography variant="h3">{year}</Typography>
          </Box>

          <Box
            display="flex"
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              minWidth={LABEL_MIN_WIDTH}
              color={
                isDarkMode ? theme.palette.customColors.greyAccent : "inherit"
              }
              variant="h3"
              sx={{ fontWeight: LABEL_FONT_WEIGHT }}
            >
              Description
            </Typography>
            <Typography variant="h3">{infoLong}</Typography>
          </Box>

          <Box
            display="flex"
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              minWidth={LABEL_MIN_WIDTH}
              color={
                isDarkMode ? theme.palette.customColors.greyAccent : "inherit"
              }
              variant="h3"
              sx={{ fontWeight: LABEL_FONT_WEIGHT }}
            >
              Optimized for
            </Typography>
            <IconsBox display="flex" gap={1.5}>
              {isResponsive && <IoMdPhonePortrait className="icon" />}
              <IoMdLaptop className="icon" />
              <IoMdDesktop className="icon" />
            </IconsBox>
          </Box>

          <Box
            display="flex"
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              minWidth={LABEL_MIN_WIDTH}
              color={
                isDarkMode ? theme.palette.customColors.greyAccent : "inherit"
              }
              variant="h3"
              sx={{ fontWeight: LABEL_FONT_WEIGHT }}
            >
              Built with
            </Typography>
            <ToolsBox flexWrap="wrap" display="flex">
              {techTools}
            </ToolsBox>
          </Box>

          <Box
            display="flex"
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              minWidth={LABEL_MIN_WIDTH}
              color={
                isDarkMode ? theme.palette.customColors.greyAccent : "inherit"
              }
              variant="h3"
              sx={{ fontWeight: LABEL_FONT_WEIGHT }}
            >
              Tech description
            </Typography>
            <Typography variant="h3">{techDescription}</Typography>
          </Box>

          <Box
            display="flex"
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              minWidth={LABEL_MIN_WIDTH}
              color={
                isDarkMode ? theme.palette.customColors.greyAccent : "inherit"
              }
              variant="h3"
              sx={{ fontWeight: LABEL_FONT_WEIGHT }}
            >
              Status
            </Typography>
            <Typography variant="h3">{status}</Typography>
          </Box>

          {showLink && (
            <InfoLinkRow label="Site" link={address} linkLabel={address} />
          )}

          {showRepo && (
            <InfoLinkRow
              label="Github"
              link={repo}
              linkLabel="Visit github repository"
            />
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default ProjectPage;
