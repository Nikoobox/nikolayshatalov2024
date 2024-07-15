import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Landing from "../Landing";
import Skills from "../Skills";
import Projects from "../Projects";

const Splash: FC = () => {
  return (
    <Box>
      <Landing />
      <Box mt={"100vh"}>
        <Skills />
        <Projects />
      </Box>
    </Box>
  );
};
export default Splash;
