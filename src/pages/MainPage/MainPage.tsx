import { FC } from "react";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

import Landing from "../../components/Landing";
import Skills from "../../components/Skills";
import ProjectCards from "../../components/ProjectCards";
import Contact from "../../components/Contact";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import SectionStars from "../../components/SectionStars";

const MainPage: FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box>
      <Landing />
      <Box mt="100vh" position="relative">
        {/* blinking pixels in both modes; the flying ships only at night */}
        <SectionStars withShips={isDarkMode} />
        <Skills />
        <ProjectCards />
        {/* transparent (same color as the page) so the pixels show through */}
        <PageSectionWrapper bgColor="transparent">
          <Contact />
        </PageSectionWrapper>
      </Box>
    </Box>
  );
};
export default MainPage;
