import { styled, alpha } from "@mui/material/styles";

import { pixelBodyFontFamily } from "../../theme/variables";
import { pixelBorder } from "./pixel";

const PixelTag = styled("span")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";

  return {
    display: "inline-block",
    margin: "2px",
    padding: "2px 8px",
    fontFamily: pixelBodyFontFamily,
    fontSize: "20px",
    lineHeight: "22px",
    letterSpacing: "0.5px",
    color: isDarkMode
      ? theme.palette.customColors.greyLightest
      : theme.palette.common.black,
    background: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    boxShadow: pixelBorder(
      isDarkMode
        ? alpha(theme.palette.customColors.greyAccent, 0.3)
        : alpha(theme.palette.common.black, 0.35),
      2,
    ),
  };
});

export default PixelTag;
