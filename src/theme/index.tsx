import {  ThemeOptions  } from "@mui/material/styles";

import { COLORS, fontFamily } from "./variables";



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
