import { FC } from "react";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

import Landing from "../Landing";
import Skills from "../Skills";
import Projects from "../Projects";
import Contact from "../Contact";
import PageSectionWrapper from "../PageSectionWrapper";

const Splash: FC = () => {
  const theme = useTheme();
  return (
    <Box>
      <Landing />
      <Box mt={"100vh"}>
        <Skills />
        <Projects />
        <PageSectionWrapper bgColor={theme.palette.backgroundCustom.primary}>
          <Contact />
        </PageSectionWrapper>
      </Box>
    </Box>
  );
};
export default Splash;
