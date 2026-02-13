import "@mui/material/styles/createPalette";
import "@mui/material/styles/createTypography";

import "@mui/material/styles";

import {
  TypographyOptions,
  TypographyStyleOptions,
} from "@mui/material/styles";

export interface CustomTypographyOptions extends TypographyOptions {
  h1?: TypographyStyleOptions;
  h2?: TypographyStyleOptions;
  h3?: TypographyStyleOptions;
  h4?: TypographyStyleOptions;
  body1?: TypographyStyleOptions;
  subtitleRegular?: TypographyStyleOptions;
  subtitleBold?: TypographyStyleOptions;
  labelBold?: TypographyStyleOptions;
  labelRegular?: TypographyStyleOptions;
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    subtitleRegular: React.CSSProperties;
    subtitleBold: React.CSSProperties;
    labelBold: React.CSSProperties;
    labelRegular: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    subtitleRegular?: React.CSSProperties;
    subtitleBold?: React.CSSProperties;
    labelBold?: React.CSSProperties;
    labelRegular?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subtitleRegular: true;
    subtitleBold: true;
    labelBold: true;
    labelRegular: true;
  }
}

interface customColors {
  customColors: {
    whiteAccent: string;
    grey: string;
    greyLightest: string;
    greyAccent: string;
    grey200: string;
    purpleAccent: string;
    greenAccent: string;
    tealAccent: string;
    aliceBlue: string;
    yellowAccent: string;
    redAccent: string;
    blueDark: string;
    charcoalBlack: string;
    deepSlate: string;
    classicBlue: string;
  };
}

interface backgroundCustom {
  backgroundCustom: {
    primary: string;
    secondary: string;
  };
}

interface common {
  common: {
    white: string;
    black: string;
  };
}

interface commonCustom {
  commonCustom: {
    front: string;
    back: string;
  };
}

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    customColors;
    common;
    textColor: string;
    backgroundCustom;
    commonCustom;
  }

  interface PaletteOptions {
    customColors;
    common;
    textColor: string;
    backgroundCustom;
    commonCustom;
  }
}
