import { MaterialDesignContent } from "notistack";

import { styled } from "@mui/material/styles";

import { pixelBorder } from "../UI";
import { pixelBodyFontFamily } from "../../theme/variables";

const PixelSnackbar = styled(MaterialDesignContent)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const base = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const box = (accent: string) => ({
    boxShadow: `${pixelBorder(accent)}, 8px 8px 0 0 rgba(0, 0, 0, 0.6)`,
    "& svg": { color: accent },
  });

  return {
    borderRadius: 0,
    padding: "10px 18px",
    fontFamily: pixelBodyFontFamily,
    fontSize: "22px",
    letterSpacing: "0.5px",
    color: base,
    backgroundColor: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    ...box(base),
    "&.notistack-MuiContent-success": box(
      theme.palette.customColors.tealAccent,
    ),
    "&.notistack-MuiContent-error": box(theme.palette.customColors.redAccent),
    "&.notistack-MuiContent-success, &.notistack-MuiContent-error, &.notistack-MuiContent-info, &.notistack-MuiContent-warning, &.notistack-MuiContent-default":
      {
        backgroundColor: isDarkMode
          ? theme.palette.customColors.charcoalBlack
          : theme.palette.common.white,
        color: base,
      },
  };
});

export default PixelSnackbar;
