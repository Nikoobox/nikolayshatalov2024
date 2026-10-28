import { FC, useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { pixelBorder } from "../UI";
import { SpaceMusicEngine } from "./spaceMusicEngine";

// same notched pixel frame as the day/night toggle beside it
const StyledButton = styled("button")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    padding: 0,
    border: 0,
    cursor: "pointer",
    color: isDarkMode ? theme.palette.common.white : theme.palette.common.black,
    background: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    boxShadow: pixelBorder(
      isDarkMode ? theme.palette.common.white : theme.palette.common.black,
    ),
    "&[aria-pressed='true']": {
      color: isDarkMode
        ? theme.palette.customColors.tealAccent
        : theme.palette.customColors.purpleAccent,
    },
    "&:hover": { color: theme.palette.customColors.tealAccent },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.customColors.tealAccent}`,
      outlineOffset: "6px",
    },
  };
});

// sound waves pulse outward in steps while playing
const waves = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
`;

// pixel speaker; waves when playing, an X when off
const SpeakerIcon: FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <Box
    component="svg"
    width={24}
    height={18}
    viewBox="0 0 12 9"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
    sx={{
      "& .wave-near": { animation: `${waves} 2.4s steps(1, end) infinite` },
      "& .wave-far": {
        animation: `${waves} 2.4s steps(1, end) 1.2s infinite`,
      },
      "@media (prefers-reduced-motion: reduce)": {
        "& .wave-near, & .wave-far": { animation: "none" },
      },
    }}
  >
    <rect x="0" y="3" width="2" height="3" />
    <rect x="2" y="2" width="1" height="5" />
    <rect x="3" y="1" width="1" height="7" />
    <rect x="4" y="0" width="1" height="9" />
    {isPlaying ? (
      <>
        <rect className="wave-near" x="6" y="3" width="1" height="3" />
        <g className="wave-far">
          <rect x="8" y="1" width="1" height="1" />
          <rect x="9" y="2" width="1" height="5" />
          <rect x="8" y="7" width="1" height="1" />
        </g>
      </>
    ) : (
      <>
        <rect x="7" y="2" width="1" height="1" />
        <rect x="8" y="3" width="1" height="1" />
        <rect x="9" y="4" width="1" height="1" />
        <rect x="10" y="5" width="1" height="1" />
        <rect x="11" y="6" width="1" height="1" />
        <rect x="11" y="2" width="1" height="1" />
        <rect x="10" y="3" width="1" height="1" />
        <rect x="8" y="5" width="1" height="1" />
        <rect x="7" y="6" width="1" height="1" />
      </>
    )}
  </Box>
);

// Space music toggle, off until the visitor presses it.
const SpaceMusic: FC = () => {
  const engine = useRef<SpaceMusicEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => () => engine.current?.dispose(), []);

  const toggle = () => {
    engine.current ??= new SpaceMusicEngine();
    if (isPlaying) engine.current.pause();
    else engine.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <StyledButton
      type="button"
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Pause space music" : "Play space music"}
    >
      <SpeakerIcon isPlaying={isPlaying} />
    </StyledButton>
  );
};

export default SpaceMusic;
