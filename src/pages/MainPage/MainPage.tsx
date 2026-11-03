import { FC } from "react";

import { Box } from "@mui/material";

import Landing from "../../components/Landing";
import Skills from "../../components/Skills";
import ProjectCards from "../../components/ProjectCards";
import Contact from "../../components/Contact";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import SectionStars from "../../components/SectionStars";

const MainPage: FC = () => {
  return (
    <Box>
      <Landing />
      <Box mt="100vh" position="relative">
        <SectionStars />
        <Skills />
        <ProjectCards />
        <PageSectionWrapper bgColor="transparent">
          <Contact />
        </PageSectionWrapper>
      </Box>
    </Box>
  );
};
export default MainPage;
