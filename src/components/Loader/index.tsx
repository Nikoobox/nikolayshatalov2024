import { FC } from "react";

import { CircularProgress, Box } from "@mui/material";

import { COLORS } from "../../theme";

const LoadingSpinner: FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      sx={{ background: COLORS.BLUE_DARK }}
    >
      <CircularProgress sx={{ color: COLORS.TEAL_ACCENT }} />
    </Box>
  );
};

export default LoadingSpinner;
