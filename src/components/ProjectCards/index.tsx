import { FC } from "react";

import { Box } from "@mui/material";

import { PROJECTS_DATA } from "../Data";
import PageSection from "../PageSection";
import { PixelHeading } from "../UI";
import FeaturedProjectCard from "./FeaturedProjectCard";
import CompactProjectCard from "./CompactProjectCard";

const ProjectCards: FC = () => {
  const featuredProject = PROJECTS_DATA.find((proj) => proj.isFeatured);

  const otherProjects = PROJECTS_DATA.filter(
    (proj) => !proj.isFeatured && !proj.isHidden,
  ).map((proj) => (
    <Box
      key={proj.id}
      sx={{
        width: {
          xs: "100%",
          // gap is 40px; leaves room for the cards' pixel frames and shadows
          sm: "calc(50% - 20px)",
          md: "calc(33.333% - 27px)",
        },
        mb: {
          xs: 6,
          sm: 0,
        },
      }}
    >
      <CompactProjectCard {...proj} />
    </Box>
  ));

  return (
    <PageSection id="projects-destination">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box mb={8} mt={20}>
          <PixelHeading>Projects</PixelHeading>
        </Box>

        {featuredProject && (
          <Box width="100%" mb={{ xs: 16 }}>
            <FeaturedProjectCard {...featuredProject} />
          </Box>
        )}

        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          width="100%"
          gap={5}
        >
          {otherProjects}
        </Box>
      </Box>
    </PageSection>
  );
};
export default ProjectCards;
