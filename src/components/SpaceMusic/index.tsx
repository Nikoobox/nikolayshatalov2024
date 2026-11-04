import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import {
  Box,
  ClickAwayListener,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import { alpha, styled, Theme, useTheme } from "@mui/material/styles";

import { buttonShadowColor, pixelBorder, PixelTooltip } from "../UI";
import { pixelFontFamily } from "../../theme/variables";
import { FileTrack } from "./fileTrack";
import {
  playRadioSwitch,
  preloadRadioSwitch,
  RADIO_SWITCH_SECONDS,
  stopRadioSwitch,
} from "./radioSwitch";

interface Track {
  play(delay?: number): Promise<void>;
  pause(): void;
  dispose(): void;
  setRepeat(repeat: boolean): void;
  currentTime(): number;
  onEnded?: () => void;
}

const TRACKS: { title: string; seconds: number; create: () => Track }[] = [
  {
    title: "Acid Jazz",
    seconds: 208,
    create: () => new FileTrack("/music/acid-jazz.mp3"),
  },
  {
    title: "Fingersnap Bar",
    seconds: 182,
    create: () => new FileTrack("/music/fingersnap-bar.mp3"),
  },
  {
    title: "Trouble Makers",
    seconds: 44,
    create: () => new FileTrack("/music/trouble-makers.mp3"),
  },
  {
    title: "Hard Boiled",
    seconds: 181,
    create: () => new FileTrack("/music/hard-boiled.mp3"),
  },
  {
    title: "Covert Affair",
    seconds: 194,
    create: () => new FileTrack("/music/covert-affair.mp3"),
  },
];

const TIME_TICK_MS = 500;
const BOARD_SLIDE_MS = 300;
const ROW_FADE_MS = 120;
const ROW_RESIZE_MS = 300;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${minutes}:${rest}`;
};

const PLAYER_WIDTH = 48;
const PLAYER_WIDTH_PLAYING = 260;
const PLAYER_WIDTH_PLAYING_MOBILE = 96;
const MOBILE_OPEN_WIDTH = "min(196px, calc(100vw - 32px))";
const FRAME = 4;

const CARET_UP = ["...#...", "..###..", ".#####.", "#######"];

const PLAY_ICON = [
  "#.....",
  "###...",
  "#####.",
  "######",
  "#####.",
  "###...",
  "#.....",
];

const PAUSE_ICON = Array.from({ length: 7 }, () => "##..##");

const LOOP_ICON = [
  ".....#...",
  "#######..",
  "#....#...",
  "#.......#",
  "...#....#",
  "..#######",
  "...#.....",
];

const REPEAT_ICON = [
  "..####.#.",
  ".#....##.",
  "#....###.",
  "#........",
  "#.......#",
  "#.......#",
  ".#.....#.",
  "..#####..",
];

const SHUFFLE_ICON = [
  ".......#.",
  "##....###",
  "..#..#.#.",
  "...##....",
  "..#..#.#.",
  "##....###",
  ".......#.",
];

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
  zIndex: 1,
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
  boxShadow: `${pixelBorder(frameColor(theme))}, 6px 6px 0 4px ${buttonShadowColor(
    theme,
  )}`,
  transition: "width 0.3s ease",
  "&[data-playing='true']": {
    width: `${PLAYER_WIDTH_PLAYING}px`,
    [theme.breakpoints.down("sm")]: {
      width: `${PLAYER_WIDTH_PLAYING_MOBILE}px`,
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& > *": { transition: `opacity ${ROW_FADE_MS}ms ease` },
    "&[data-row-hidden='true'] > *": { opacity: 0 },
    "& .desktop-only": { display: "none" },
    "&[data-playing='true'][data-board='true']": {
      width: MOBILE_OPEN_WIDTH,
      "& .transport": { display: "flex", marginRight: "2px" },
      "& .mobile-only": { display: "none" },
    },
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

const StyledBoard = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 0,
  bottom: "calc(100% + 4px)",
  zIndex: 0,
  display: "grid",
  gap: "18px",
  width: `${PLAYER_WIDTH_PLAYING}px`,
  padding: "18px 14px 16px",
  [theme.breakpoints.down("sm")]: {
    width: MOBILE_OPEN_WIDTH,
  },
  visibility: "hidden",
  transform: "translateY(16px)",
  clipPath: "inset(100% -24px -24px -24px)",
  transition:
    "transform 0.3s ease, clip-path 0.3s ease, visibility 0s 0.3s",
  "&[data-open='true']": {
    visibility: "visible",
    transform: "none",
    clipPath: "inset(-8px -24px -24px -24px)",
    transition: "transform 0.3s ease, clip-path 0.3s ease",
  },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  boxSizing: "border-box",
  color: frameColor(theme),
  background: alpha(
    theme.palette.mode === "dark"
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    0.85,
  ),
  boxShadow: `${pixelBorder(frameColor(theme))}, 6px 6px 0 4px ${buttonShadowColor(
    theme,
  )}`,
}));

const StyledSong = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  padding: "6px 0",
  border: 0,
  cursor: "pointer",
  textAlign: "left",
  fontFamily: pixelFontFamily,
  fontSize: "8px",
  lineHeight: 1.4,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.customColors.greyAccent
      : theme.palette.customColors.grey,
  background: "transparent",
  "& .marker": { width: "8px", flexShrink: 0, visibility: "hidden" },
  "& .name": {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .time": {
    flexShrink: 0,
    marginLeft: "auto",
    paddingLeft: "12px",
    [theme.breakpoints.down("sm")]: { display: "none" },
  },
  "&[aria-current='true']": {
    color: accent(theme),
    "& .marker": { visibility: "visible" },
  },
  "&:hover": { color: theme.palette.customColors.tealAccent },
  ...focusRing(theme),
}));

const StyledModeKey = styled(StyledKey)(({ theme }) => {
  const frame = frameColor(theme);
  return {
    width: "32px",
    height: "20px",
    "&[aria-pressed='true']": {
      color: accent(theme),
      transform: "translateY(2px)",
      boxShadow: `${pixelBorder(frame, 2)}, 0 2px 0 0 ${frame}`,
    },
  };
});

const StyledTab = styled("button")(({ theme }) => ({
  position: "absolute",
  right: 0,
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "20px",
  [theme.breakpoints.up("sm")]: {
    width: "32px",
    height: "12px",
    "&:hover, &:focus-visible, &[aria-expanded='true']": {
      width: "44px",
      height: "20px",
    },
  },
  padding: 0,
  border: 0,
  cursor: "pointer",
  color: frameColor(theme),
  background:
    theme.palette.mode === "dark"
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
  boxShadow: pixelBorder(frameColor(theme)),
  transition: "bottom 0.3s ease, width 0.15s ease, height 0.15s ease",
  "&:hover": { color: theme.palette.customColors.tealAccent },
  ...focusRing(theme),
  [theme.breakpoints.down("sm")]: {
    "&[aria-expanded='false']": { display: "none" },
  },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));

const StyledMobileTime = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "18px",
  right: "14px",
  display: "none",
  fontFamily: pixelFontFamily,
  fontSize: "8px",
  lineHeight: 1,
  color: accent(theme),
  [theme.breakpoints.down("sm")]: { display: "block" },
}));

const CREDITS =
  "MUSIC BY KEVIN MACLEOD (INCOMPETECH.COM) AND MATTHEW PABLO, LICENSED UNDER CC BY 4.0";

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

const DAY_TICKER_COLOR = "#9AA0A8";

const tickerScroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const StyledTicker = styled("div")(({ theme }) => ({
  overflow: "hidden",
  whiteSpace: "nowrap",
  fontFamily: pixelFontFamily,
  fontSize: "8px",
  lineHeight: 1,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.customColors.grey
      : DAY_TICKER_COLOR,
  "& .track": {
    display: "inline-flex",
    animation: `${tickerScroll} 18s linear infinite`,
  },
  "& .item": { paddingRight: "32px" },
  "@media (prefers-reduced-motion: reduce)": {
    textOverflow: "ellipsis",
    "& .track": { animation: "none" },
  },
}));

const StyledGroupLabel = styled("div")(({ theme }) => ({
  fontFamily: pixelFontFamily,
  fontSize: "8px",
  lineHeight: 1,
  color: theme.palette.customColors.grey,
}));


const StyledTitleWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  "&[data-hidden='true']": { visibility: "hidden" },
  bottom: "62px",
  right: "60px",
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

const StyledSpeakerSvg = styled("svg")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .wave-near": { animation: `${waves} 2.4s steps(1, end) infinite` },
    "& .wave-far": {
      animation: `${waves} 2.4s steps(1, end) 1.2s infinite`,
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    "& .wave-near, & .wave-far": { animation: "none" },
  },
}));

const SpeakerIcon: FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <StyledSpeakerSvg
    width={24}
    height={18}
    viewBox="0 0 12 9"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
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
  </StyledSpeakerSvg>
);

interface PixelGlyphProps {
  rows: string[];
  flip?: boolean;
  scale?: number;
}

const PixelGlyph: FC<PixelGlyphProps> = ({ rows, flip, scale = 2 }) => (
  <svg
    width={rows[0].length * scale}
    height={rows.length * scale}
    viewBox={`0 0 ${rows[0].length} ${rows.length}`}
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
    style={flip ? { transform: "scaleY(-1)" } : undefined}
  >
    {rows.flatMap((row, y) =>
      [...row].map((cell, x) =>
        cell === "#" ? (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
        ) : null,
      ),
    )}
  </svg>
);

const SpaceMusic: FC = () => {
  const isScrolled = useScrollTrigger({ disableHysteresis: true });
  const tracks = useRef<Track[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isPlayerWide, setIsPlayerWide] = useState(false);
  const [isRowHidden, setIsRowHidden] = useState(false);
  const [isBoardShown, setIsBoardShown] = useState(false);
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
  const isShrunkRef = useRef(false);
  isShrunkRef.current = isScrolled && isPlaying;
  const hasBoardToggled = useRef(false);
  const [boardHeight, setBoardHeight] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(true);
  const [isLoop, setIsLoop] = useState(true);
  const titleTimer = useRef(0);
  const collapseTimer = useRef(0);
  const onTrackEnded = useRef<(index: number) => void>(() => {});
  const repeatRef = useRef(isRepeat);
  repeatRef.current = isRepeat;

  useEffect(preloadRadioSwitch, []);

  useEffect(
    () => () => {
      window.clearTimeout(titleTimer.current);
      window.clearTimeout(collapseTimer.current);
      stopRadioSwitch();
      tracks.current.forEach((track) => track?.dispose());
    },
    [],
  );

  useEffect(() => {
    tracks.current.forEach((track) => track?.setRepeat(isRepeat));
  }, [isRepeat]);

  useEffect(() => {
    if (!hasBoardToggled.current) {
      hasBoardToggled.current = true;
      return;
    }
    const timers: number[] = [];
    const later = (callback: () => void, ms: number) =>
      timers.push(window.setTimeout(callback, ms));
    if (!isMobile) {
      const resizeMs = isShrunkRef.current ? ROW_RESIZE_MS : 0;
      if (isBoardOpen) {
        setIsPlayerWide(true);
        later(() => setIsBoardShown(true), resizeMs);
      } else {
        setIsBoardShown(false);
        later(() => setIsPlayerWide(false), BOARD_SLIDE_MS);
      }
      return () => timers.forEach((timer) => window.clearTimeout(timer));
    }
    if (isBoardOpen) {
      setIsRowHidden(true);
      later(() => setIsPlayerWide(true), ROW_FADE_MS);
      later(() => {
        setIsRowHidden(false);
        setIsBoardShown(true);
      }, ROW_FADE_MS + ROW_RESIZE_MS);
    } else {
      setIsBoardShown(false);
      later(() => setIsRowHidden(true), BOARD_SLIDE_MS);
      later(() => setIsPlayerWide(false), BOARD_SLIDE_MS + ROW_FADE_MS);
      later(
        () => setIsRowHidden(false),
        BOARD_SLIDE_MS + ROW_FADE_MS + ROW_RESIZE_MS,
      );
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isBoardOpen, isMobile]);

  useEffect(() => {
    if (!isBoardOpen) return;
    const tick = () =>
      setElapsed(tracks.current[trackIndex]?.currentTime() ?? 0);
    tick();
    const timer = window.setInterval(tick, TIME_TICK_MS);
    return () => window.clearInterval(timer);
  }, [isBoardOpen, trackIndex]);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const measure = () => setBoardHeight(board.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying) setIsBoardOpen(false);
  }, [isPlaying]);

  useEffect(() => {
    if (!isBoardOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsBoardOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isBoardOpen]);

  const showTitle = () => {
    setIsTitleVisible(true);
    window.clearTimeout(titleTimer.current);
    titleTimer.current = window.setTimeout(
      () => setIsTitleVisible(false),
      TITLE_MS,
    );
  };

  const getTrack = (index: number) => {
    if (!tracks.current[index]) {
      const track = TRACKS[index].create();
      track.setRepeat(repeatRef.current);
      track.onEnded = () => onTrackEnded.current(index);
      tracks.current[index] = track;
    }
    return tracks.current[index];
  };

  const releaseTrack = (index: number) => {
    tracks.current[index]?.dispose();
    delete tracks.current[index];
  };

  const pickNext = (direction: 1 | -1, isAuto: boolean) => {
    if (isShuffle && TRACKS.length > 1) {
      const offset = 1 + Math.floor(Math.random() * (TRACKS.length - 1));
      return (trackIndex + offset) % TRACKS.length;
    }
    const next = trackIndex + direction;
    if (isAuto && next >= TRACKS.length && !isLoop) return null;
    return (next + TRACKS.length) % TRACKS.length;
  };

  const changeTrack = (next: number) => {
    releaseTrack(trackIndex);
    if (isPlaying && !isPaused) {
      stopRadioSwitch();
      getTrack(next).play();
    }
    setTrackIndex(next);
    showTitle();
  };

  onTrackEnded.current = (index) => {
    if (index !== trackIndex || !isPlaying || isPaused) return;
    const next = pickNext(1, true);
    if (next !== null) {
      changeTrack(next);
      return;
    }
    releaseTrack(trackIndex);
    setTrackIndex(0);
    setIsPlaying(false);
  };

  const toggle = () => {
    const track = getTrack(trackIndex);
    window.clearTimeout(collapseTimer.current);
    if (isPlaying) {
      stopRadioSwitch();
      track.pause();
      if (isBoardOpen) {
        setIsBoardOpen(false);
        setIsPaused(true);
        collapseTimer.current = window.setTimeout(() => {
          setIsPlaying(false);
          setIsPaused(false);
        }, BOARD_SLIDE_MS);
        return;
      }
    } else {
      playRadioSwitch();
      track.play(RADIO_SWITCH_SECONDS);
      showTitle();
    }
    setIsPlaying(!isPlaying);
    setIsPaused(false);
  };

  const togglePause = () => {
    const track = getTrack(trackIndex);
    if (isPaused) {
      track.play();
    } else {
      stopRadioSwitch();
      track.pause();
    }
    setIsPaused(!isPaused);
  };

  const pauseLabel = isPaused ? "Resume" : "Pause";

  const skip = (direction: 1 | -1) => changeTrack(pickNext(direction, false)!);

  const settings = [
    {
      label: "Repeat song",
      icon: REPEAT_ICON,
      isOn: isRepeat,
      set: (isOn: boolean) => {
        setIsRepeat(isOn);
        if (isOn) {
          setIsShuffle(false);
          setIsLoop(false);
        }
      },
    },
    {
      label: "Shuffle",
      icon: SHUFFLE_ICON,
      isOn: isShuffle,
      set: (isOn: boolean) => {
        setIsShuffle(isOn);
        if (isOn) setIsRepeat(false);
      },
    },
    {
      label: "Loop all",
      icon: LOOP_ICON,
      isOn: isLoop,
      set: (isOn: boolean) => {
        setIsLoop(isOn);
        if (isOn) setIsRepeat(false);
      },
    },
  ];

  const { title } = TRACKS[trackIndex];

  return (
    <ClickAwayListener onClickAway={() => setIsBoardOpen(false)}>
      <Box
        position="relative"
        width={PLAYER_WIDTH}
        height="48px"
        sx={{
          transformOrigin: "bottom right",
          transition: "transform 0.3s ease",
          transform:
            isScrolled && isPlaying && !isPlayerWide ? "scale(0.8)" : "none",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <StyledPlayer
          role="group"
          aria-label="Music player"
          data-playing={isPlaying}
          data-board={isPlayerWide}
          data-row-hidden={isRowHidden}
        >
          <Box
            className="desktop-only transport"
            display="flex"
            gap="12px"
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
            <PixelTooltip placement="top" title={pauseLabel}>
              <StyledKey
                type="button"
                onClick={togglePause}
                aria-label={pauseLabel}
                tabIndex={isPlaying ? 0 : -1}
              >
                <PixelGlyph rows={isPaused ? PLAY_ICON : PAUSE_ICON} />
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
          <SoundWave isPlaying={isPlaying && !isPaused} />
          <StyledMobileNext
            className="mobile-only"
            type="button"
            onClick={() => setIsBoardOpen(true)}
            aria-label="Open songs"
            aria-expanded={isBoardOpen}
            tabIndex={isPlaying ? 0 : -1}
          >
            <PixelGlyph rows={CARET_UP} scale={3} />
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
        {isPlaying && (
          <PixelTooltip placement="top" title={isBoardOpen ? "" : "Songs"}>
            <StyledTab
              type="button"
              onClick={() => setIsBoardOpen((open) => !open)}
              aria-label="Songs and playback"
              aria-expanded={isBoardOpen}
              style={{
                bottom: `calc(100% + ${
                  FRAME + (isBoardShown ? boardHeight + FRAME : 0)
                }px)`,
              }}
            >
              <PixelGlyph rows={CARET_UP} flip={isBoardOpen} />
            </StyledTab>
          </PixelTooltip>
        )}
        <StyledBoard
          ref={boardRef}
          role="group"
          aria-label="Songs and playback"
          data-open={isBoardShown}
        >
          <StyledMobileTime aria-hidden="true">
            {formatTime(elapsed)}/{formatTime(TRACKS[trackIndex].seconds)}
          </StyledMobileTime>
          <Box display="grid" gap="10px">
            <StyledGroupLabel>SONGS</StyledGroupLabel>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {TRACKS.map((track, index) => {
                const isCurrent = index === trackIndex;
                return (
                  <li key={track.title}>
                    <StyledSong
                      type="button"
                      aria-current={isCurrent}
                      onClick={() => !isCurrent && changeTrack(index)}
                    >
                      <span className="marker" aria-hidden="true">
                        {">"}
                      </span>
                      <span className="name">{track.title.toUpperCase()}</span>
                      <span className="time">
                        {isCurrent
                          ? `${formatTime(elapsed)}/${formatTime(track.seconds)}`
                          : formatTime(track.seconds)}
                      </span>
                    </StyledSong>
                  </li>
                );
              })}
            </Box>
            <StyledTicker>
              <Box component="span" className="track" aria-hidden="true">
                <span className="item">{CREDITS}</span>
                <span className="item">{CREDITS}</span>
              </Box>
              <Box component="span" sx={visuallyHidden}>
                {CREDITS}
              </Box>
            </StyledTicker>
          </Box>
          <Box display="flex" justifyContent="center" gap="12px" pb="6px">
            {settings.map(({ label, icon, isOn, set }) => (
              <PixelTooltip key={label} title={label} placement="top">
                <StyledModeKey
                  type="button"
                  aria-label={label}
                  aria-pressed={isOn}
                  onClick={() => set(!isOn)}
                >
                  <PixelGlyph rows={icon} />
                </StyledModeKey>
              </PixelTooltip>
            ))}
          </Box>
        </StyledBoard>
        <StyledTitleWrapper
          data-playing={isPlaying}
          data-hidden={isBoardOpen}
        >
          <StyledTitle aria-live="polite" data-visible={isTitleVisible}>
            {title}
          </StyledTitle>
        </StyledTitleWrapper>
      </Box>
    </ClickAwayListener>
  );
};

export default SpaceMusic;
