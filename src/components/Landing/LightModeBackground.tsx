import { Box } from "@mui/material";

import { useThemeContext } from "../../theme/ThemeContextProvider";

const LightModeBackground = () => {
  const { theme } = useThemeContext();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.backgroundCustom.primary,
        position: "absolute",
        width: "100%",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 1,
      }}
    ></Box>
  );
};

export default LightModeBackground;
