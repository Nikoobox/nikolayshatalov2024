import { FC } from "react";

import { styled } from "@mui/material/styles";

import { useThemeContext } from "../../theme/ThemeContextProvider";
import { pixelBorder } from "../UI";

const StyledButton = styled("button")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    padding: 0,
    border: 0,
    cursor: "pointer",
    color: isDarkMode
      ? theme.palette.common.white
      : theme.palette.customColors.purpleAccent,
    background: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    boxShadow: pixelBorder(frame),
    "&:hover": { color: theme.palette.customColors.tealAccent },
  };
});

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 8 8" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
    <rect x="2" y="0" width="4" height="1" />
    <rect x="1" y="1" width="3" height="1" />
    <rect x="0" y="2" width="3" height="4" />
    <rect x="1" y="6" width="3" height="1" />
    <rect x="2" y="7" width="4" height="1" />
  </svg>
);

const SunIcon = () => (
  <svg width="30" height="30" viewBox="0 0 10 10" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
    <rect x="3" y="3" width="4" height="4" />
    <rect x="2" y="4" width="6" height="2" />
    <rect x="4" y="2" width="2" height="6" />
    <rect x="4" y="0" width="2" height="1" />
    <rect x="4" y="9" width="2" height="1" />
    <rect x="0" y="4" width="1" height="2" />
    <rect x="9" y="4" width="1" height="2" />
    <rect x="1" y="1" width="1" height="1" />
    <rect x="8" y="1" width="1" height="1" />
    <rect x="1" y="8" width="1" height="1" />
    <rect x="8" y="8" width="1" height="1" />
  </svg>
);

const NightModeSwitch: FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeContext();

  return (
    <StyledButton
      type="button"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to day mode" : "Switch to night mode"}
    >
      {isDarkMode ? <MoonIcon /> : <SunIcon />}
    </StyledButton>
  );
};

export default NightModeSwitch;
