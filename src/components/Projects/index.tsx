import { FC } from "react";

import { Box, Typography } from "@mui/material";

import { PROJECTS_DATA } from "../Data";
import PageSection from "../PageSection";
import Project from "./Project";

const Projects: FC = () => {
  const projects = PROJECTS_DATA.filter((proj) => proj.isMainProject).map(
    (proj) => {
      return <Project key={proj.id} {...proj} />;
    }
  );

  const otherProjects = PROJECTS_DATA.filter((proj) => !proj.isMainProject).map(
    (proj) => {
      return <Project key={proj.id} {...proj} />;
    }
  );

  return (
    <PageSection id="projects-destination">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h1" mb={5} mt={20}>
          Projects
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          sx={{
            gap: {
              xs: 12,
              sm: 8,
            },
          }}
        >
          {projects}
        </Box>

        <Typography variant="h1" mb={5} mt={20}>
          Other Projects
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          sx={{
            gap: {
              xs: 12,
              sm: 8,
            },
          }}
        >
          {otherProjects}
        </Box>
      </Box>
    </PageSection>
  );
};
export default Projects;
