import { FC } from "react";

import { Box } from "@mui/material";

import { PROJECTS_DATA } from "../Data";
import PageSection from "../PageSection";
import ProjectCard from "./ProjectCard";
import FeaturedProjectCard from "./FeaturedProjectCard";
import CompactProjectCard from "./CompactProjectCard";

const ProjectCards: FC = () => {
  const featuredProject = PROJECTS_DATA.find((proj) => proj.isFeatured);

  const mainProjects = PROJECTS_DATA.filter(
    (proj) => proj.isMainProject && !proj.isFeatured,
  ).map((proj) => <ProjectCard key={proj.id} {...proj} />);

  const otherProjects = PROJECTS_DATA.filter((proj) => !proj.isMainProject).map(
    (proj) => (
      <Box
        key={proj.id}
        sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 16px)",
            md: "calc(33.333% - 22px)",
          },
          mb: {
            xs: 6,
            sm: 0,
          },
        }}
      >
        <CompactProjectCard {...proj} />
      </Box>
    ),
  );

  return (
    <PageSection id="projects-destination">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <PageSection.PageSubheader>
          <Box mb={5} mt={20}>
            Projects
          </Box>
        </PageSection.PageSubheader>

        {featuredProject && (
          <Box width="100%" mb={{ xs: 16 }}>
            <FeaturedProjectCard {...featuredProject} />
          </Box>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          width="100%"
          sx={{
            columnGap: {
              columnGap: 6,
            },
            rowGap: {
              xs: 16,
            },
          }}
        >
          {mainProjects}
        </Box>

        <PageSection.PageSubheader>
          <Box mb={5} mt={20}>
            Other Projects
          </Box>
        </PageSection.PageSubheader>
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          width="100%"
          gap={4}
        >
          {otherProjects}
        </Box>
      </Box>
    </PageSection>
  );
};
export default ProjectCards;
