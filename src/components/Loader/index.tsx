import { FC } from "react";

import { CircularProgress, Box } from "@mui/material";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const LoadingSpinner: FC = () => {
  const { theme } = useThemeContext();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      sx={{ background: theme.palette.backgroundCustom.primary }}
    >
      <CircularProgress sx={{ color: theme.palette.customColors.tealAccent }} />
    </Box>
  );
};

export default LoadingSpinner;
