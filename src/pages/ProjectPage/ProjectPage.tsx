import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery, Container } from "@mui/material";
import { useParams } from "react-router-dom";

import { PROJECTS_DATA } from "@/components/Data";
import Page from "@/components/Page";

const ProjectPage = () => {
  const { projectId } = useParams();

  const projectData = PROJECTS_DATA.find(
    (project) => project.id === +projectId!,
  );

  console.log("projectData", projectData);

  return (
    <Page>
      <Box>ksjdksdj</Box>
    </Page>
  );
};

export default ProjectPage;
