import { FC } from "react";

import Box from "@mui/material/Box";

import { PROJECTS_DATA } from "../Data";
import PageSection from "../PageSection";
import Project from "./Project";

const Projects: FC = () => {
  const projects = PROJECTS_DATA.map((proj) => {
    return <Project key={proj.id} {...proj} />;
  });

  return (
    <PageSection header="Projects" id="projects-destination">
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
    </PageSection>
  );
};
export default Projects;
