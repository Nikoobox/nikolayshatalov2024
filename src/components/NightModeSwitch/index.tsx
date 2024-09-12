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
      color: currentColor,
      border: `2px solid ${currentColor}`,
      borderRadius: "50%",
      width: "48px",
      height: "48px",
      padding: 0,
      svg: {
        width: "26px",
        height: "26px",
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
