import { FC } from "react";
import { isMobile } from "react-device-detect";
import { Classic } from "@theme-toggles/react";
import "@theme-toggles/react/css/Classic.css";

import { Box } from "@mui/material";
import { styled } from "@mui/system";

import { useThemeContext } from "../../theme/ThemeContextProvider";

const IS_MOBILE = "isMobile";

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== IS_MOBILE,
})<{ isMobile: boolean }>(({ theme, isMobile }) => {
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
      ...(isMobile
        ? {}
        : {
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
          }),
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
    <StyledBox isMobile={isMobile} display="flex" alignItems="center">
      {/* @ts-expect-error - @theme-toggles/react types incompatible with React 18 */}
      <Classic duration={750} toggled={isDarkMode} toggle={toggleDarkMode} />
    </StyledBox>
  );
};

export default NightModeSwitch;
