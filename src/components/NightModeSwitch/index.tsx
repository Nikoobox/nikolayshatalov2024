import { FC } from "react";

import { Switch, Typography, Box } from "@mui/material";

import { useThemeContext } from "../../theme/ThemeContextProvider";
import { themeConstants } from "../../constants";

const { DARK } = themeConstants;

const NightModeSwitch: FC = () => {
  const { mode, toggleDarkMode } = useThemeContext();

  return (
    <Box ml={1} display="flex" alignItems="center">
      <Typography>{mode}</Typography>
      <Switch
        color="secondary"
        onChange={toggleDarkMode}
        checked={mode === DARK}
      />
    </Box>
  );
};

export default NightModeSwitch;
