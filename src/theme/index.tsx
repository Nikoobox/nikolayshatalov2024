import { ThemeOptions } from "@mui/material/styles";

import { COLORS, fontFamily } from "./variables";

export const styleH1 = {
  fontWeight: 300,
  fontSize: `36px`,
  lineHeight: `48px`,
};

export const styleH2 = {
  fontWeight: 300,
  fontSize: `24px`,
  lineHeight: `32px`,
};

export const styleH3 = {
  fontWeight: 300,
  fontSize: `18px`,
  lineHeight: `24px`,
};

export const styleH4 = {
  fontWeight: 300,
  fontSize: `16px`,
};

export const styleP = {
  fontWeight: 400,
  fontSize: `16px`,
  lineHeight: `24px`,
  // letterSpacing: `-0.01em`,
};

// export const numericalLarge = {
//   fontFamily: rubik,
//   fontSize: `24px`,
//   lineHeight: `32px`,
//   fontWeight: 400,
//   letterSpacing: `-0.02em`,
// };

// export const numericalRegular = {
//   fontFamily: rubik,
//   fontSize: `16px`,
//   lineHeight: `24px`,
//   fontWeight: 400,
// };

export const subtitleBold = {
  fontSize: `14px`,
  lineHeight: `24px`,
  fontWeight: 600,
};

export const subtitleRegular = {
  fontSize: `14px`,
  lineHeight: `16px`,
  fontWeight: 400,
};

export const labelBold = {
  fontSize: `12px`,
  lineHeight: `16px`,
  fontWeight: 500,
};

export const labelRegular = {
  fontSize: `12px`,
  lineHeight: `16px`,
  fontWeight: 400,
};

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily,
    h1: styleH1,
    h2: styleH2,
    h3: styleH3,
    h4: styleH4,
    body1: styleP,
    subtitleRegular,
    subtitleBold,
    labelBold,
    labelRegular,
    // numericalRegular,
    // numericalLarge,
    button: {
      textTransform: "none",
      "&:focus": {
        outline: 0,
      },
    },
  },
  palette: {
    primary: {
      main: COLORS.BLUE_MAIN,
    },
    common: {
      white: COLORS.WHITE,
      black: COLORS.BLACK,
    },
    commonCustom: {
      //used to switch white black for white for simple elements
      front: COLORS.WHITE,
      back: COLORS.BLACK,
    },
    backgroundCustom: {
      primary: COLORS.DEEP_SLATE,
      secondary: COLORS.BLUE_DARK,
    },
    textColor: COLORS.BLACK,
    customColors: {
      whiteAccent: COLORS.WHITE_ACCENT,
      grey: COLORS.GREY_MAIN,
      greyLightest: COLORS.GREY_LIGHTEST,
      greyAccent: COLORS.GREY_LIGHT,
      grey900: COLORS.GREY_900,
      purpleAccent: COLORS.PURPLE_ACCENT,
      greenAccent: COLORS.GREEN_ACCENT,
      tealAccent: COLORS.TEAL_ACCENT,
      aliceBlue: COLORS.ALICE_BLUE,
      yellowAccent: COLORS.YELLOW_ACCENT,
      redAccent: COLORS.RED_ACCENT,
      blueDark: COLORS.BLUE_DARK,
      charcoalBlack: COLORS.CHARCOAL_BLACK,
      deepSlate: COLORS.DEEP_SLATE,
    },
  },
  // Change dark mode background opacity
  // Change the background opacity based on the elevation in dark mode.
  // This change was made to better conform to the Material Design guidelines.
  // You can revert it in the theme:
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "unset" } },
    },
  },
};

export { themeOptions, COLORS };
