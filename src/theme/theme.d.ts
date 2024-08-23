import "@mui/material/styles/createPalette";
import "@mui/material/styles/createTypography";

import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    subtitleRegular: React.CSSProperties;
    subtitleBold: React.CSSProperties;
    labelBold: React.CSSProperties;
    labelRegular: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    subtitleRegular?: React.CSSProperties;
    subtitleBold?: React.CSSProperties;
    labelBold?: React.CSSProperties;
    labelRegular?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
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
    yellowAccent: string;
    redAccent: string;
    blueDark: string;
    charcoalBlack: string;
    deepSlate: string;
    backgroundCustom: string;
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
    textColor: string;
  }

  interface PaletteOptions {
    customColors;
    common;
    textColor: string;
  }
}
