import { FC } from "react";
import { Box } from "@mui/material";

import Landing from "../Landing";
import Skills from "../Skills";
import Projects from "../Projects";
import Footer from "../Footer";

const Splash: FC = () => {
  return (
    <Box>
      <Landing />
      <Box mt={"100vh"}>
        <Skills />
        <Projects />
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};
export default Splash;
