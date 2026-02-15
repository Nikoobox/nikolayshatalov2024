import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { IoMdPhonePortrait, IoMdDesktop, IoMdLaptop } from "react-icons/io";

import { PROJECTS_DATA } from "@/components/Data";
import Page from "@/components/Page";
import { ProjectProps } from "@/components/Projects/ProjectProps";
import { useDarkTheme } from "@/hooks";
import InfoLinkRow from "./InfoLinkRow";
import { LABEL_MIN_WIDTH } from "./configs";

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

const ProjectPage = () => {
  const { projectId } = useParams();
  const theme = useTheme();
  const isDarkMode = useDarkTheme();

  const projectData: ProjectProps | undefined = PROJECTS_DATA.find(
    (project) => project.id === +projectId!,
  );
  const {
    id,
    name,
    img,
    year,
    tools,
    info,
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
  const techTools = tools.map((tool) => (
    <Typography color={techToolColor} className="tool" key={tool}>
      {tool}
    </Typography>
  ));

  return (
    <Page>
      <Box
        mt={6}
        p={4}
        bgcolor={
          isDarkMode
            ? theme.palette.customColors.charcoalBlack
            : theme.palette.customColors.greyLightest
        }
        sx={{ borderRadius: theme.spacing(2) }}
      >
        <Box width={"100%"} display="flex" flexDirection="column" gap={4}>
          <AnimatedImageWrapper>
            <AnimatedImage src={img} alt={name} />
          </AnimatedImageWrapper>

          <Box display="flex" flexDirection={"column"} gap={2}>
            <Box display="flex" gap={2}>
              <Typography minWidth={LABEL_MIN_WIDTH}>Project Name</Typography>
              <Typography>{name}</Typography>
            </Box>
            <Box display="flex" gap={2} alignItems={"center"}>
              <Typography minWidth={LABEL_MIN_WIDTH}>Year</Typography>
              <Typography>{year}</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Typography minWidth={LABEL_MIN_WIDTH}>Description</Typography>
              <Typography>{infoLong}</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Typography minWidth={LABEL_MIN_WIDTH}>Optimized For</Typography>
              <IconsBox display="flex" gap={1.5}>
                {isResponsive && <IoMdPhonePortrait className="icon" />}
                <IoMdLaptop className="icon" />
                <IoMdDesktop className="icon" />
              </IconsBox>
            </Box>
            <Box display="flex" gap={2}>
              <Typography minWidth={LABEL_MIN_WIDTH}>Built With</Typography>
              <ToolsBox flexWrap="wrap" display="flex">
                {techTools}
              </ToolsBox>
            </Box>
            <Box display="flex" gap={2}>
              <Typography minWidth={LABEL_MIN_WIDTH}>
                Tech Description
              </Typography>
              <Typography>{techDescription}</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Typography minWidth={LABEL_MIN_WIDTH}>Status</Typography>
              <Typography>{status}</Typography>
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
      </Box>
    </Page>
  );
};

export default ProjectPage;
