import { useState, useMemo, useEffect } from "react";

import { createTheme, Palette } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

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
          //test
          background: {
            default: "#FFFFFF", // Light mode background color
            paper: "#F5F5F5", // Light mode paper background color
          },
        }
      : // DARK MODE
        {
          ...(themeOptions.palette as Palette),
          // primary: { ...themeOptions?.palette?.primary, main: "#FFFF00" },
          mode,
          background: {
            default: themeOptions.palette?.customColors.blueDark, // Light mode background color
            paper: themeOptions.palette?.customColors.blueDark, // Light mode paper background color
          },
        }),
  },
});

export const useCustomTheme = () => {
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
    isDarkMode: mode === DARK,
    toggleDarkMode,
  };
};
