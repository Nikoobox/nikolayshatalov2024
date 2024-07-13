import { useState, useMemo, useEffect } from "react";

import { createTheme, Palette } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
// import { amber, deepOrange, grey } from "@mui/material/colors";

import { themeOptions } from ".";
import { themeConstants } from "../constants";

const { LIGHT, DARK, LOCAL_STORAGE_COLOR_MODE_KEY } = themeConstants;

const getDesignTokens = (mode: PaletteMode) => ({
  ...themeOptions,
  palette: {
    ...(mode === "light"
      ? {
          ...(themeOptions.palette as Palette),
          mode,
        }
      : {
          ...(themeOptions.palette as Palette),
          primary: { ...themeOptions?.palette?.primary, main: "#FFFF00" },
          mode,
        }),
  },
});

export const useDarkTheme = () => {
  const savedMode = localStorage.getItem(LOCAL_STORAGE_COLOR_MODE_KEY);
  const initialMode: PaletteMode = savedMode
    ? (savedMode as PaletteMode)
    : LIGHT;

  const [mode, setMode] = useState<PaletteMode>(initialMode);

  const toggleDarkMode = () =>
    setMode((prevMode) => (prevMode === LIGHT ? DARK : LIGHT));

  const modifiedTheme = useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COLOR_MODE_KEY, mode);
  }, [mode]);

  return {
    theme: modifiedTheme,
    mode,
    toggleDarkMode,
  };
};
