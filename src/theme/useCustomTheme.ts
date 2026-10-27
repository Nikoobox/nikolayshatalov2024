import { useState, useMemo, useEffect } from "react";

import { createTheme } from "@mui/material/styles";
import { PaletteMode, ThemeOptions } from "@mui/material";

import { themeOptions } from ".";
import { themeConstants } from "../constants";
import { CustomTypographyOptions } from "./theme";

const { LIGHT, DARK, LOCAL_STORAGE_COLOR_MODE_KEY } = themeConstants;

const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  const baseTypography = themeOptions.typography as CustomTypographyOptions;

  return {
    ...themeOptions,
    palette: {
      ...(mode === LIGHT
        ? {
            ...(themeOptions.palette as any),
            mode,
            // plain white page in day mode (no grey section bands)
            background: {
              default: themeOptions.palette?.common?.white,
            },
            backgroundCustom: {
              primary: themeOptions.palette?.common?.white,
              secondary: themeOptions.palette?.common?.white,
            },
            commonCustom: {
              front: themeOptions.palette?.common?.black,
              back: themeOptions.palette?.common?.white,
            },
          }
        : {
            ...(themeOptions.palette as any),
            mode,
            // everything below the landing shares the footer's near-black
            background: {
              default: themeOptions.palette?.customColors.charcoalBlack,
              paper: themeOptions.palette?.customColors.charcoalBlack,
            },
            backgroundCustom: {
              primary: themeOptions.palette?.customColors.charcoalBlack,
              secondary: themeOptions.palette?.customColors.charcoalBlack,
            },
          }),
    },
    typography: {
      ...(mode === LIGHT
        ? {
            ...baseTypography,
            h1: {
              ...baseTypography.h1,
              fontWeight: 500,
            },
            h2: {
              ...baseTypography.h2,
              fontWeight: 500,
            },
          }
        : {
            ...baseTypography,
          }),
    },
  };
};

export const useCustomTheme = () => {
  const savedMode = localStorage.getItem(LOCAL_STORAGE_COLOR_MODE_KEY);
  const initialMode: PaletteMode = savedMode
    ? (savedMode as PaletteMode)
    : DARK;

  const [mode, setMode] = useState<PaletteMode>(initialMode);

  const toggleDarkMode = () =>
    setMode((prevMode) => (prevMode === LIGHT ? DARK : LIGHT));

  const modifiedTheme = useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode],
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
