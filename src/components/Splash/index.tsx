import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Landing from "../Landing";

const Splash: FC = () => {
  return (
    <Box mt={16} sx={{ backgroundColor: "grey" }}>
      <Typography>Hello from Splassshhhhh</Typography>
      <Landing />
    </Box>
  );
};
export default Splash;
