import { FC } from "react";
import { Box } from "@mui/material";

import { useThemeContext } from "../../theme/ThemeContextProvider";
import { styled } from "@mui/system";

import "@theme-toggles/react/css/Classic.css";
import { Classic } from "@theme-toggles/react";

const StyledBox = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const currentColor = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;

  return {
    button: {
      position: "relative",
      color: currentColor,
      border: `2px solid ${currentColor}`,
      borderRadius: "50%",
      width: "48px",
      height: "48px",
      padding: 0,
      overflow: "hidden",

      "::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.customColors.tealAccent,
        transform: "scaleX(0)",
        transformOrigin: "left",
        transition: "transform 0.3s",
        zIndex: -1,
      },
      "&:hover::before": {
        transform: "scaleX(1)",
      },
      svg: {
        width: "26px",
        height: "26px",
        position: "relative",
      },
    },
  };
});

const NightModeSwitch: FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeContext();

  return (
    <StyledBox display="flex" alignItems="center">
      <Classic
        duration={750}
        toggled={isDarkMode}
        toggle={toggleDarkMode}
        placeholder=""
      />
    </StyledBox>
  );
};

export default NightModeSwitch;
