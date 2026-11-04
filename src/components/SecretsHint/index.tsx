import { FC, RefObject, useEffect, useId, useRef, useState } from "react";

import { Box, ClickAwayListener } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";

import { buttonShadowColor, pixelBorder, PixelTooltip } from "../UI";
import { pixelBodyFontFamily, pixelFontFamily } from "../../theme/variables";
import { useThemeContext } from "../../theme/ThemeContextProvider";


const QUESTION_MARK = [
  ".###.",
  "#...#",
  "....#",
  "...#.",
  "..#..",
  ".....",
  "..#..",
];

const SECRETS = [
  "Click the spacecraft drifting through the stars.",
  "Ask Soyuz\u00a04 to dock with Soyuz\u00a05.",
  "Ask Soyuz\u00a05 to say hi to Soyuz\u00a04.",
  "Make Sputnik beep.",
];

const frameColor = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? theme.palette.common.white
    : theme.palette.common.black;

const panelBackground = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? theme.palette.customColors.charcoalBlack
    : theme.palette.common.white;

const StyledHintButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  padding: 0,
  border: 0,
  cursor: "pointer",
  color: frameColor(theme),
  background: panelBackground(theme),
  boxShadow: `${pixelBorder(frameColor(theme))}, 6px 6px 0 4px ${buttonShadowColor(
    theme,
  )}`,
  "&[aria-expanded='true']": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.customColors.tealAccent
        : theme.palette.customColors.purpleAccent,
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.customColors.tealAccent}`,
    outlineOffset: "6px",
  },
}));

const StyledPanel = styled("div")(({ theme }) => ({
  position: "absolute",
  left: 0,
  bottom: "calc(100% + 24px)",
  width: "min(320px, calc(100vw - 32px))",
  boxSizing: "border-box",
  padding: "16px 18px",
  background: panelBackground(theme),
  boxShadow: `${pixelBorder(frameColor(theme))}, 8px 8px 0 0 ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.6)"
      : theme.palette.customColors.greyAccent
  }`,
}));

const StyledCloseButton = styled("button")(({ theme }) => ({
  flexShrink: 0,
  width: 24,
  height: 24,
  padding: 0,
  border: 0,
  cursor: "pointer",
  fontFamily: pixelFontFamily,
  fontSize: "10px",
  lineHeight: 1,
  color: frameColor(theme),
  background: "transparent",
  boxShadow: pixelBorder(
    theme.palette.mode === "dark"
      ? theme.palette.customColors.greyAccent
      : theme.palette.common.black,
    2,
  ),
  "&:hover": {
    background: theme.palette.customColors.tealAccent,
    color: theme.palette.customColors.charcoalBlack,
  },
}));

const PixelQuestionMark: FC = () => (
  <svg
    width={20}
    height={28}
    viewBox="0 0 5 7"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {QUESTION_MARK.flatMap((row, y) =>
      [...row].map((cell, x) =>
        cell === "#" ? (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
        ) : null,
      ),
    )}
  </svg>
);

const useIsShown = (ref: RefObject<HTMLElement>) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIsShown(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return isShown;
};

const SecretsHint: FC = () => {
  const { isDarkMode, theme } = useThemeContext();
  const rootRef = useRef<HTMLDivElement>(null);
  const isShown = useIsShown(rootRef);
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isShown) setIsOpen(false);
  }, [isShown]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box
        ref={rootRef}
        position="relative"
        width="fit-content"
        sx={{
          opacity: isShown ? 1 : 0,
          visibility: isShown ? "visible" : "hidden",
          transform: isShown ? "none" : "translateY(12px)",
          transition: isShown
            ? "opacity 0.4s ease, transform 0.4s ease"
            : "opacity 0.3s ease, transform 0.3s ease, visibility 0s 0.3s",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        {isOpen && (
          <StyledPanel id={panelId} role="dialog" aria-label="Hidden secrets">
            <Box display="flex" alignItems="flex-start" gap={2} mb={1}>
              <Box
                component="h2"
                sx={{
                  flex: 1,
                  m: 0,
                  fontFamily: pixelFontFamily,
                  fontSize: "10px",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: isDarkMode
                    ? theme.palette.customColors.tealAccent
                    : theme.palette.common.black,
                }}
              >
                HIDDEN SECRETS
              </Box>
              <StyledCloseButton
                type="button"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              >
                X
              </StyledCloseButton>
            </Box>
            <Box
              component="ul"
              sx={{
                m: 0,
                p: 0,
                listStyle: "none",
                display: "grid",
                gap: 1,
                fontFamily: pixelBodyFontFamily,
                fontSize: "20px",
                lineHeight: 1.25,
                letterSpacing: "0.5px",
                color: isDarkMode
                  ? theme.palette.customColors.greyAccent
                  : theme.palette.common.black,
              }}
            >
              {SECRETS.map((secret) => (
                <Box component="li" key={secret} display="flex" gap={1.5}>
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{
                      color: isDarkMode
                        ? theme.palette.customColors.tealAccent
                        : theme.palette.common.black,
                    }}
                  >
                    {">"}
                  </Box>
                  {secret}
                </Box>
              ))}
            </Box>
          </StyledPanel>
        )}
        <PixelTooltip
          title={isOpen ? "" : "Hidden secrets"}
          placement="top"
        >
          <StyledHintButton
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
            aria-label="Show hidden secrets"
            tabIndex={isShown ? 0 : -1}
          >
            <PixelQuestionMark />
          </StyledHintButton>
        </PixelTooltip>
      </Box>
    </ClickAwayListener>
  );
};

export default SecretsHint;
