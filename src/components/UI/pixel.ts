import { alpha, Theme } from "@mui/material/styles";

export const pixelBorder = (color: string, size = 4): string =>
  [
    `-${size}px 0 0 0 ${color}`,
    `${size}px 0 0 0 ${color}`,
    `0 -${size}px 0 0 ${color}`,
    `0 ${size}px 0 0 ${color}`,
  ].join(", ");

export const stepEase =
  (steps: number) =>
  (t: number): number =>
    Math.floor(t * steps) / steps;

export const buttonShadowColor = (theme: Theme): string =>
  theme.palette.mode === "dark"
    ? alpha(theme.palette.customColors.greyAccent, 0.22)
    : theme.palette.customColors.greyAccent;
