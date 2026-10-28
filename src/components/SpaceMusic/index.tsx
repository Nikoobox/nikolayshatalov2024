import { FC, useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";

import { pixelBorder } from "../UI";
import { pixelFontFamily } from "../../theme/variables";
import { SpaceMusicEngine } from "./spaceMusicEngine";
import { FileTrack } from "./fileTrack";

interface Track {
  play(): Promise<void>;
  pause(): void;
  dispose(): void;
}

const TRACKS: { title: string; create: () => Track }[] = [
  {
    title: "Fingersnap Bar",
    create: () => new FileTrack("/music/fingersnap-bar.mp3"),
  },
  { title: "Star Sequencer", create: () => new SpaceMusicEngine() },
  {
    title: "Trouble Makers by Matthew Pablo",
    create: () => new FileTrack("/music/trouble-makers.mp3"),
  },
];

const CAPTION_MS = 8000;

// width of the player, so the header can hold a slot for it
export const PLAYER_WIDTH = 72;

const frameColors = (isDarkMode: boolean, theme: Theme) => ({
  frame: isDarkMode ? theme.palette.common.white : theme.palette.common.black,
  background: isDarkMode
    ? theme.palette.customColors.charcoalBlack
    : theme.palette.common.white,
});

// same notched pixel frame as the day/night toggle beside it
const StyledPlayer = styled("div")(({ theme }) => {
  const { frame, background } = frameColors(
    theme.palette.mode === "dark",
    theme,
  );
  return {
    position: "relative",
    display: "flex",
    width: `${PLAYER_WIDTH}px`,
    height: "48px",
    background,
    boxShadow: pixelBorder(frame),
  };
});

const StyledButton = styled("button")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  return {
    display: "flex",
    alignItems: "center",
    // skip icon hugs the speaker; even 12px spacing across the player
    justifyContent: "flex-start",
    width: "24px",
    height: "100%",
    padding: 0,
    border: 0,
    cursor: "pointer",
    color: frameColors(isDarkMode, theme).frame,
    background: "transparent",
    "&[aria-pressed]": { width: "48px", justifyContent: "center" },
    "&[aria-pressed='true']": {
      color: isDarkMode
        ? theme.palette.customColors.tealAccent
        : theme.palette.customColors.purpleAccent,
    },
    "&:hover": { color: theme.palette.customColors.tealAccent },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.customColors.tealAccent}`,
      outlineOffset: "2px",
    },
  };
});

// track name that pops up under the player for a moment after switching,
// in a soft grey so it reads quieter than the controls; fades in quickly and
// out slowly
const StyledCaption = styled("span")(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 16px)",
  right: 0,
  whiteSpace: "nowrap",
  fontFamily: pixelFontFamily,
  fontSize: "10px",
  lineHeight: 1,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.customColors.greyAccent
      : theme.palette.customColors.grey,
  pointerEvents: "none",
  opacity: 0,
  transition: "opacity 2.5s ease",
  "&[data-visible='true']": { opacity: 1, transition: "opacity 0.4s ease" },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));

// pixel skip arrow with a bar
const SkipIcon: FC = () => (
  <svg
    width="12"
    height="14"
    viewBox="0 0 6 7"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="0" y="0" width="1" height="7" />
    <rect x="1" y="1" width="1" height="5" />
    <rect x="2" y="2" width="1" height="3" />
    <rect x="3" y="3" width="1" height="1" />
    <rect x="5" y="0" width="1" height="7" />
  </svg>
);

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

// Mini music player, silent until the visitor presses play.
const SpaceMusic: FC = () => {
  const tracks = useRef<Track[]>([]);
  const captionTimer = useRef(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCaptionVisible, setIsCaptionVisible] = useState(false);

  useEffect(
    () => () => {
      window.clearTimeout(captionTimer.current);
      tracks.current.forEach((track) => track?.dispose());
    },
    [],
  );

  // tracks are created on first use, so nothing loads until it's needed
  const getTrack = (index: number) =>
    (tracks.current[index] ??= TRACKS[index].create());

  const toggle = () => {
    const track = getTrack(trackIndex);
    if (isPlaying) track.pause();
    else track.play();
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    const next = (trackIndex + 1) % TRACKS.length;
    // drop the old track so every song starts from the top when it comes back
    tracks.current[trackIndex]?.dispose();
    delete tracks.current[trackIndex];
    if (isPlaying) getTrack(next).play();
    setTrackIndex(next);
    setIsCaptionVisible(true);
    window.clearTimeout(captionTimer.current);
    captionTimer.current = window.setTimeout(
      () => setIsCaptionVisible(false),
      CAPTION_MS,
    );
  };

  const { title } = TRACKS[trackIndex];

  return (
    <StyledPlayer role="group" aria-label="Music player">
      <StyledButton
        type="button"
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
      >
        <SpeakerIcon isPlaying={isPlaying} />
      </StyledButton>
      <StyledButton type="button" onClick={skipForward} aria-label="Next track">
        <SkipIcon />
      </StyledButton>
      <Box component="span" aria-live="polite" sx={visuallyHidden}>
        {title}
      </Box>
      <StyledCaption aria-hidden="true" data-visible={isCaptionVisible}>
        {trackIndex + 1}/{TRACKS.length} {title}
      </StyledCaption>
    </StyledPlayer>
  );
};

export default SpaceMusic;
