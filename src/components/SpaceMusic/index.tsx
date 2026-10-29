import { FC, useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import { Box, useScrollTrigger } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";

import { pixelBorder, PixelTooltip } from "../UI";
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
    title: "Trouble Makers",
    create: () => new FileTrack("/music/trouble-makers.mp3"),
  },
];

const PLAYER_WIDTH = 48;
const PLAYER_WIDTH_PLAYING = 212;
const PLAYER_WIDTH_PLAYING_MOBILE = 88;

const TITLE_MS = 4000;

const accent = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? theme.palette.customColors.tealAccent
    : theme.palette.customColors.purpleAccent;

const frameColor = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? theme.palette.common.white
    : theme.palette.common.black;

const focusRing = (theme: Theme) => ({
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.customColors.tealAccent}`,
    outlineOffset: "2px",
  },
});

const StyledPlayer = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  width: `${PLAYER_WIDTH}px`,
  height: "48px",
  overflow: "hidden",
  color: frameColor(theme),
  background:
    theme.palette.mode === "dark"
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
  boxShadow: pixelBorder(frameColor(theme)),
  transition: "width 0.3s ease",
  "&[data-playing='true']": {
    width: `${PLAYER_WIDTH_PLAYING}px`,
    [theme.breakpoints.down("sm")]: {
      width: `${PLAYER_WIDTH_PLAYING_MOBILE}px`,
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .desktop-only": { display: "none" },
  },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));

const StyledSpeakerButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "48px",
  height: "48px",
  padding: 0,
  border: 0,
  cursor: "pointer",
  color: "inherit",
  background: "transparent",
  "&[aria-pressed='true']": { color: accent(theme) },
  "&:hover": { color: theme.palette.customColors.tealAccent },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.customColors.tealAccent}`,
    outlineOffset: "-6px",
  },
}));

const StyledKey = styled("button")(({ theme }) => {
  const frame = frameColor(theme);
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "36px",
    height: "22px",
    padding: 0,
    border: 0,
    cursor: "pointer",
    color: frame,
    background: "transparent",
    boxShadow: `${pixelBorder(frame, 2)}, 0 4px 0 0 ${frame}`,
    "&:hover": { color: theme.palette.customColors.tealAccent },
    "&:active": {
      transform: "translateY(2px)",
      boxShadow: `${pixelBorder(frame, 2)}, 0 2px 0 0 ${frame}`,
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.customColors.tealAccent}`,
      outlineOffset: "2px",
    },
  };
});

const StyledTitleWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "62px",
  right: 0,
  [theme.breakpoints.down("sm")]: {
    bottom: 0,
    right: `${PLAYER_WIDTH + 10}px`,
    "&[data-playing='true']": {
      right: `${PLAYER_WIDTH_PLAYING_MOBILE + 10}px`,
    },
  },
}));

const StyledMobileNext = styled("button")(({ theme }) => ({
  display: "none",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  padding: 0,
  border: 0,
  cursor: "pointer",
  color: frameColor(theme),
  background: "transparent",
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.customColors.tealAccent}`,
    outlineOffset: "2px",
  },
  [theme.breakpoints.down("sm")]: { display: "flex" },
}));

const WAVE_HEIGHTS = [1, 2, 4, 3, 5, 2, 3, 1, 2, 4, 5, 3, 2, 1];
const WAVE_PERIOD = WAVE_HEIGHTS.length * 2;

const WAVE = [...WAVE_HEIGHTS, ...WAVE_HEIGHTS].map((h, i) => ({
  x: i * 2,
  h,
}));

const waveScroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-${WAVE_PERIOD}px); }
`;

const SoundWave: FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <Box
    component="svg"
    className="desktop-only"
    width={56}
    height={28}
    viewBox="0 0 28 14"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
    sx={(theme) => ({
      display: "block",
      flexShrink: 0,
      "& .wave": {
        color: accent(theme),
        animation: isPlaying
          ? `${waveScroll} 2.8s steps(${WAVE_HEIGHTS.length}) infinite`
          : "none",
      },
      "@media (prefers-reduced-motion: reduce)": {
        "& .wave": { animation: "none" },
      },
    })}
  >
    <rect x="1" y="0" width="26" height="1" />
    <rect x="1" y="13" width="26" height="1" />
    <rect x="0" y="1" width="1" height="12" />
    <rect x="27" y="1" width="1" height="12" />
    <svg x="1" y="1" width="26" height="12" viewBox="0 0 26 12">
      <g className="wave">
        {WAVE.map(({ x, h }) => (
          <rect key={x} x={x} y={6 - h} width="1" height={h * 2} />
        ))}
      </g>
    </svg>
  </Box>
);

const StyledTitle = styled("span")(({ theme }) => ({
  display: "block",
  whiteSpace: "nowrap",
  fontFamily: pixelFontFamily,
  fontSize: "10px",
  lineHeight: 1,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.customColors.greyAccent
      : theme.palette.customColors.grey,
  opacity: 0,
  transition: "opacity 2.5s ease",
  "&[data-visible='true']": { opacity: 1, transition: "opacity 0.4s ease" },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));

const SkipIcon: FC<{ isBack?: boolean; scale?: number }> = ({
  isBack,
  scale = 2,
}) => (
  <svg
    width={6 * scale}
    height={7 * scale}
    viewBox="0 0 6 7"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
    style={isBack ? { transform: "scaleX(-1)" } : undefined}
  >
    <rect x="0" y="0" width="1" height="7" />
    <rect x="1" y="1" width="1" height="5" />
    <rect x="2" y="2" width="1" height="3" />
    <rect x="3" y="3" width="1" height="1" />
    <rect x="5" y="0" width="1" height="7" />
  </svg>
);

const waves = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
`;

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

const SpaceMusic: FC = () => {
  const isScrolled = useScrollTrigger({ disableHysteresis: true });
  const tracks = useRef<Track[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const titleTimer = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(titleTimer.current);
      tracks.current.forEach((track) => track?.dispose());
    },
    [],
  );

  const showTitle = () => {
    setIsTitleVisible(true);
    window.clearTimeout(titleTimer.current);
    titleTimer.current = window.setTimeout(
      () => setIsTitleVisible(false),
      TITLE_MS,
    );
  };

  const getTrack = (index: number) =>
    (tracks.current[index] ??= TRACKS[index].create());

  const toggle = () => {
    const track = getTrack(trackIndex);
    if (isPlaying) {
      track.pause();
    } else {
      track.play();
      showTitle();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (direction: 1 | -1) => {
    const next = (trackIndex + direction + TRACKS.length) % TRACKS.length;
    tracks.current[trackIndex]?.dispose();
    delete tracks.current[trackIndex];
    if (isPlaying) getTrack(next).play();
    setTrackIndex(next);
    showTitle();
  };

  const { title } = TRACKS[trackIndex];

  return (
    <Box
      position="relative"
      width={PLAYER_WIDTH}
      height="48px"
      sx={(theme) => ({
        transformOrigin: "bottom right",
        transition: "transform 0.3s ease",
        [theme.breakpoints.up("sm")]: {
          transform: isScrolled && isPlaying ? "scale(0.9)" : "none",
        },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      })}
    >
      <StyledPlayer
        role="group"
        aria-label="Music player"
        data-playing={isPlaying}
      >
        <Box
          className="desktop-only"
          display="flex"
          gap="8px"
          mr="14px"
          mt="-4px"
          flexShrink={0}
        >
          <PixelTooltip placement="top" title="Previous song">
            <StyledKey
              type="button"
              onClick={() => skip(-1)}
              aria-label="Previous track"
              tabIndex={isPlaying ? 0 : -1}
            >
              <SkipIcon isBack />
            </StyledKey>
          </PixelTooltip>
          <PixelTooltip placement="top" title="Next song">
            <StyledKey
              type="button"
              onClick={() => skip(1)}
              aria-label="Next track"
              tabIndex={isPlaying ? 0 : -1}
            >
              <SkipIcon />
            </StyledKey>
          </PixelTooltip>
        </Box>
        <SoundWave isPlaying={isPlaying} />
        <StyledMobileNext
          type="button"
          onClick={() => skip(1)}
          aria-label="Next track"
          tabIndex={isPlaying ? 0 : -1}
        >
          <SkipIcon scale={3} />
        </StyledMobileNext>
        <PixelTooltip
          placement="top"
          title={isPlaying ? "Stop music" : "Play music"}
        >
          <StyledSpeakerButton
            type="button"
            onClick={toggle}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? `Stop ${title}` : `Play ${title}`}
          >
            <SpeakerIcon isPlaying={isPlaying} />
          </StyledSpeakerButton>
        </PixelTooltip>
      </StyledPlayer>
      <StyledTitleWrapper data-playing={isPlaying}>
        <StyledTitle aria-live="polite" data-visible={isTitleVisible}>
          {title}
        </StyledTitle>
      </StyledTitleWrapper>
    </Box>
  );
};

export default SpaceMusic;
