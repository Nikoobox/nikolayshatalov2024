import { useParams } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";

import { PROJECTS_DATA } from "@/components/Data";
import Page from "@/components/Page";
import { ProjectProps } from "@/components/Projects/ProjectProps";

const StyledImageWrapperBox = styled(Box)(({ theme }) => {
  return {
    "& .project-image": {
      borderRadius: theme.spacing(2),
      height: "auto",
      width: "50%",
      objectFit: "cover",
    },
  };
});

const ProjectPage = () => {
  const { projectId } = useParams();
  const theme = useTheme();

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
    isMainProject,
    status,
  } = projectData!;

  console.log("projectData", projectData);

  return (
    <Page>
      <Box
        mt={6}
        p={4}
        bgcolor={theme.palette.customColors.charcoalBlack}
        sx={{ borderRadius: theme.spacing(2) }}
      >
        <StyledImageWrapperBox width={"100%"} display="flex" gap={4}>
          <img src={img} alt={name} className="project-image" />

          <Box display="flex" flexDirection={"column"} gap={2}>
            <Box display="flex" gap={2}>
              <Box minWidth="120px">Project Name</Box>
              <Box>{name}</Box>
            </Box>
            <Box display="flex" gap={2}>
              <Box minWidth="120px">Year</Box>
              <Box>{year}</Box>
            </Box>
            <Box display="flex" gap={2}>
              <Box minWidth="120px">Description</Box>
              <Box>{infoLong}</Box>
            </Box>
            <Box display="flex" gap={2}>
              <Box minWidth="120px">Status</Box>
              <Box>{status}</Box>
            </Box>
          </Box>
        </StyledImageWrapperBox>
      </Box>
    </Page>
  );
};

export default ProjectPage;
