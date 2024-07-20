import "@mui/material/styles/createPalette";
import "@mui/material/styles/createTypography";

interface customColors {
  customColors: {
    whiteAccent: string;
    grey: string;
    greyAccent: string;
    purpleAccent: string;
    greenAccent: string;
    tealAccent: string;
    yellowAccent: string;
    redAccent: string;
    blueDark: string;
  };
}

interface common {
  common: {
    white: string;
    black: string;
  };
}

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    customColors;
    common;
  }

  interface PaletteOptions {
    customColors;
    common;
  }
}
