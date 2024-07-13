import { createTheme, ThemeOptions, Palette } from "@mui/material/styles";

import { COLORS, fontFamily } from "./variables";

// const COLORS = {
//   BLACK: "#222",
//   BLUE_MAIN: "#1A394D",
//   WHITE: "#FFF",
//   SECONDARY: "#8BD8BD",
//   TEAL: "#35C2A3",
//   GREY_MAIN: "#6C757D",
//   GREY_LIGHT: "#D3D3D3",
//   WHITE_ACCENT: "#F3FAFF",
//   PURPLE_ACCENT: "#BD10E0",
//   GREEN_ACCENT: "#B8E986",
//   TEAL_ACCENT: "#50E3C2",
//   YELLOW_ACCENT: "#FFD300",
//   RED_ACCENT: "#E86363",
// };

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily,
    // h1: styleH1,
    // h2: styleH2,
    // h3: styleH3,
    // h4: styleH4,
    // body1: styleP,
    // subtitleRegular,
    // subtitleBold,
    // labelBold,
    // labelRegular,
    // numericalRegular,
    // numericalLarge,
    button: {
      textTransform: "none",
      //   fontWeight: 600,
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
    customColors: {
      whiteAccent: COLORS.WHITE_ACCENT,
      grey: COLORS.GREY_MAIN,
      greyAccent: COLORS.GREY_LIGHT,
      purpleAccent: COLORS.PURPLE_ACCENT,
      greenAccent: COLORS.GREEN_ACCENT,
      tealAccent: COLORS.TEAL_ACCENT,
      yellowAccent: COLORS.YELLOW_ACCENT,
      redAccent: COLORS.RED_ACCENT,
    },
  },
};

// export const theme = createTheme(themeOptions);

export { themeOptions, COLORS };

// export default theme;
