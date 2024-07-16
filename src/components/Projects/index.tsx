import { FC, ElementType } from "react";

import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";

import { PROJECTS_DATA } from "../Data";
import PageSection from "../PageSection";
import Project from "./Project";

const Projects: FC = () => {
  const projects = PROJECTS_DATA.map((proj) => {
    return <Project key={proj.id} {...proj} />;
  });

  return (
    <PageSection header="Projects">
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={8}>
        {projects}
      </Box>
    </PageSection>
  );
};
export default Projects;
