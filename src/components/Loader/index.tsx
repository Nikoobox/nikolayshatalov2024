import { FC, useEffect, useState } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { pixelFontFamily } from "../../theme/variables";

const BLOCKS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [1, 2],
  [0, 2],
  [0, 1],
];
const BLOCK = 12;
const GAP = 4;
const CYCLE_MS = 800;

const chase = keyframes`
  0% { opacity: 1; }
  12.5% { opacity: 0.6; }
  25% { opacity: 0.35; }
  37.5%, 100% { opacity: 0.12; }
`;

const blink = keyframes`
  50% { opacity: 0; }
`;

const FONT_TIMEOUT_MS = 3000;

const usePixelFontReady = () => {
  const [isReady, setIsReady] = useState(
    () => !document.fonts || document.fonts.check(`12px ${pixelFontFamily}`),
  );

  useEffect(() => {
    if (isReady) return;
    let isActive = true;
    const reveal = () => isActive && setIsReady(true);
    const timer = window.setTimeout(reveal, FONT_TIMEOUT_MS);
    document.fonts.load(`12px ${pixelFontFamily}`).then(reveal, reveal);
    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [isReady]);

  return isReady;
};

const LoadingSpinner: FC = () => {
  const { theme } = useThemeContext();
  const isDarkMode = theme.palette.mode === "dark";
  const isFontReady = usePixelFontReady();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={3}
      height="100vh"
      width="100vw"
      role="status"
      aria-label="Loading"
      sx={{ background: theme.palette.backgroundCustom.primary }}
    >
      <Box
        sx={{
          position: "relative",
          width: 3 * BLOCK + 2 * GAP,
          height: 3 * BLOCK + 2 * GAP,
        }}
      >
        {BLOCKS.map(([col, row], i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: col * (BLOCK + GAP),
              top: row * (BLOCK + GAP),
              width: BLOCK,
              height: BLOCK,
              background: theme.palette.customColors.tealAccent,
              opacity: 0.12,
              animation: `${chase} ${CYCLE_MS}ms step-end infinite`,
              animationDelay: `${(i * CYCLE_MS) / BLOCKS.length - CYCLE_MS}ms`,
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
                opacity: i === 0 ? 1 : 0.35,
              },
            }}
          />
        ))}
      </Box>
      <Box
        aria-hidden="true"
        sx={{
          fontFamily: pixelFontFamily,
          fontSize: "12px",
          letterSpacing: "2px",
          visibility: isFontReady ? "visible" : "hidden",
          color: isDarkMode
            ? theme.palette.customColors.greyAccent
            : theme.palette.common.black,
          "& span": { animation: `${blink} 1s steps(1, end) infinite` },
        }}
      >
        LOADING<span>_</span>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
