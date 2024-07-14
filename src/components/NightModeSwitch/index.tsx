import { FC } from "react";

import { Switch, Typography, Box } from "@mui/material";

import { useThemeContext } from "../../theme/ThemeContextProvider";


const NightModeSwitch: FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeContext();

  return (
    <Box ml={1} display="flex" alignItems="center">
      <Typography>{isDarkMode}</Typography>
      <Switch
        color="secondary"
        onChange={toggleDarkMode}
        checked={isDarkMode}
      />
    </Box>
  );
};

export default NightModeSwitch;
