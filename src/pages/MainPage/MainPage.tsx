import { FC } from "react";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

import Landing from "../../components/Landing";
import Skills from "../../components/Skills";
import ProjectCards from "../../components/ProjectCards";
import Contact from "../../components/Contact";
import PageSectionWrapper from "../../components/PageSectionWrapper";

const MainPage: FC = () => {
  const theme = useTheme();
  return (
    <Box>
      <Landing />
      <Box mt="100vh">
        <Skills />
        <ProjectCards />
        <PageSectionWrapper bgColor={theme.palette.backgroundCustom.primary}>
          <Contact />
        </PageSectionWrapper>
      </Box>
    </Box>
  );
};
export default MainPage;
