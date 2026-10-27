import { FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { keyframes } from "@emotion/react";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { PixelArrow, pixelBorder } from "../UI";
import { pixelBodyFontFamily, pixelFontFamily } from "../../theme/variables";
import { isCovered } from "./spaceHitTest";
import {
  COMMAND_DOCKING_EVENT,
  SPACE_INFO,
  SPUTNIK_BEEP_EVENT,
  SpaceInfoKey,
} from "./spaceInfo";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
`;

// ~3-4s for a full description
const TYPE_DELAY_MS = 12;

const OFFSET = 18;
const MAX_WIDTH = 320;
// closest the popup gets to the screen edges
const GUTTER = 16;

interface Popup {
  key: SpaceInfoKey;
  x: number;
  y: number;
  // Soyuz 4 only: the pair is still wandering, so docking can be commanded
  canCommandDocking: boolean;
}

// The ships sit behind the page in a pointer-events: none layer, so hovering
// and clicking are detected by hit-testing their boxes against the pointer.
const findShip = (x: number, y: number): SpaceInfoKey | null => {
  if (isCovered(x, y)) return null;
  for (const el of document.querySelectorAll<HTMLElement>(
    "[data-space-info]",
  )) {
    const rect = el.getBoundingClientRect();
    const inside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    if (!inside) continue;
    // skip ships that are faded out, or whose layer is hidden
    const layer = el.closest<HTMLElement>("[data-space-layer]");
    const opacity = Number(getComputedStyle(el).opacity);
    const layerOpacity = layer ? Number(getComputedStyle(layer).opacity) : 1;
    if (opacity > 0.3 && layerOpacity > 0.3) {
      return el.dataset.spaceInfo as SpaceInfoKey;
    }
  }
  return null;
};

// freeze / unfreeze every flying ship
const setShipsPaused = (paused: boolean) => {
  document
    .querySelector<HTMLElement>("[data-space-layer]")
    ?.getAnimations({ subtree: true })
    .forEach((animation) => (paused ? animation.pause() : animation.play()));
};

// Click a spacecraft to pause the ships and read about it; they resume when
// the popup closes (X button, Escape, or a click elsewhere). Hovering only
// changes the cursor so the ships read as clickable.
const SpacePopup: FC = () => {
  const theme = useTheme();
  const [popup, setPopup] = useState<Popup | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  // ships whose description has already been typed out once
  const seenRef = useRef(new Set<SpaceInfoKey>());

  // how many characters of the description have been "typed" so far
  const [typed, setTyped] = useState(0);

  const close = () => {
    openRef.current = false;
    setShipsPaused(false);
    setPopup(null);
  };

  const sendEvent = (name: string) => () => {
    close();
    window.dispatchEvent(new Event(name));
  };

  // type the description out the first time each ship is opened; after that
  // it shows in full right away
  useEffect(() => {
    if (!popup) return;
    const length = SPACE_INFO[popup.key].body.length;
    const seen = seenRef.current.has(popup.key);
    seenRef.current.add(popup.key);
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(length);
      return;
    }
    setTyped(0);
    const timer = window.setInterval(() => {
      setTyped((count) => {
        if (count >= length) {
          window.clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, TYPE_DELAY_MS);
    return () => window.clearInterval(timer);
  }, [popup]);

  useEffect(() => {
    let frame = 0;
    let pointer = { x: -1, y: -1 };

    const updateCursor = () => {
      frame = 0;
      if (openRef.current) return;
      document.body.style.cursor = findShip(pointer.x, pointer.y)
        ? "pointer"
        : "";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateCursor);
    };
    const onMove = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onClick = (event: MouseEvent) => {
      if (openRef.current) {
        // clicks inside the popup are handled by its close button
        if (!popupRef.current?.contains(event.target as Node)) close();
        return;
      }
      const key = findShip(event.clientX, event.clientY);
      if (!key) return;
      openRef.current = true;
      document.body.style.cursor = "";
      setShipsPaused(true);
      setPopup({
        key,
        x: event.clientX,
        y: event.clientY,
        canCommandDocking:
          key === "soyuz4" &&
          document.querySelector<HTMLElement>("[data-space-info=soyuz4]")
            ?.dataset.soyuzPhase === "wander",
      });
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openRef.current) close();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    // ships keep moving under a still pointer, so re-check now and then
    const recheck = window.setInterval(schedule, 400);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      window.clearInterval(recheck);
      cancelAnimationFrame(frame);
      document.body.style.cursor = "";
      setShipsPaused(false);
    };
  }, []);

  if (!popup) return null;

  const info = SPACE_INFO[popup.key];
  const frame =
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.common.black;
  // small teal action button that presses into its shadow
  const actionButtonSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    padding: "6px 9px",
    border: 0,
    cursor: "pointer",
    fontFamily: pixelFontFamily,
    // 8px is the font's native size; smaller blurs
    fontSize: "8px",
    lineHeight: 1,
    color: theme.palette.customColors.charcoalBlack,
    background: theme.palette.customColors.tealAccent,
    boxShadow: `${pixelBorder(frame, 2)}, 3px 3px 0 1px #000`,
    "&:hover": {
      transform: "translate(1px, 1px)",
      boxShadow: `${pixelBorder(frame, 2)}, 1px 1px 0 1px #000`,
    },
    "&:active": {
      transform: "translate(3px, 3px)",
      boxShadow: pixelBorder(frame, 2),
    },
  };
  // keep the popup on screen near the click: beside it when there's room,
  // otherwise slid inside the gutters (phones); scrolls if it's too tall
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(MAX_WIDTH, vw - 2 * GUTTER);
  const flipX = popup.x + OFFSET + width > vw - GUTTER;
  const left = Math.min(
    Math.max(flipX ? popup.x - OFFSET - width : popup.x + OFFSET, GUTTER),
    vw - GUTTER - width,
  );
  const flipY = popup.y > vh * 0.6;
  const maxHeight = flipY
    ? popup.y - OFFSET - GUTTER
    : vh - popup.y - OFFSET - GUTTER;

  // portal to <body> so it isn't trapped behind the page with the ships
  return createPortal(
    <Box
      ref={popupRef}
      role="dialog"
      aria-label={info.title}
      sx={{
        position: "fixed",
        left,
        top: flipY ? undefined : popup.y + OFFSET,
        bottom: flipY ? vh - popup.y + OFFSET : undefined,
        // above everything on the page, including the navbar and modals
        zIndex: 2147483647,
        width,
        maxHeight,
        overflowY: "auto",
        boxSizing: "border-box",
        padding: "16px 18px",
        background: theme.palette.customColors.charcoalBlack,
        boxShadow: `${pixelBorder(frame)}, 8px 8px 0 0 rgba(0, 0, 0, 0.6)`,
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={2} mb={1}>
        <Typography
          sx={{
            flex: 1,
            fontFamily: pixelFontFamily,
            fontSize: "10px",
            lineHeight: 1.6,
            textTransform: "uppercase",
            color: theme.palette.customColors.tealAccent,
          }}
        >
          {info.title}
        </Typography>
        <Box
          component="button"
          type="button"
          aria-label="Close and resume"
          onClick={close}
          sx={{
            flexShrink: 0,
            width: 24,
            height: 24,
            padding: 0,
            border: 0,
            cursor: "pointer",
            fontFamily: pixelFontFamily,
            fontSize: "10px",
            lineHeight: 1,
            color: theme.palette.common.white,
            background: "transparent",
            boxShadow: pixelBorder(theme.palette.customColors.greyAccent, 2),
            "&:hover": {
              background: theme.palette.customColors.tealAccent,
              color: theme.palette.customColors.charcoalBlack,
            },
          }}
        >
          X
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative",
          fontFamily: pixelBodyFontFamily,
          fontSize: "20px",
          lineHeight: 1.25,
          letterSpacing: "0.5px",
          color: theme.palette.customColors.greyAccent,
        }}
      >
        {/* full text holds the popup at its final size; screen readers read it */}
        <Typography
          sx={{
            font: "inherit",
            letterSpacing: "inherit",
            color: "transparent",
          }}
        >
          {info.body}
        </Typography>
        <Box aria-hidden="true" sx={{ position: "absolute", inset: 0 }}>
          {info.body.slice(0, typed)}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: "0.5em",
              height: "0.85em",
              marginLeft: "3px",
              verticalAlign: "-0.1em",
              background: theme.palette.customColors.tealAccent,
              animation: `${blink} 1s steps(1, end) infinite`,
            }}
          />
        </Box>
      </Box>
      {/* ship-specific action, once the description has finished typing */}
      {typed >= info.body.length && popup.key === "soyuz4" && (
        <Box mt={2}>
          {popup.canCommandDocking ? (
            <Box
              component="button"
              type="button"
              onClick={sendEvent(COMMAND_DOCKING_EVENT)}
              sx={actionButtonSx}
            >
              <PixelArrow width={4} height={7} />
              COMMAND DOCKING
            </Box>
          ) : (
            <Typography
              sx={{
                fontFamily: pixelFontFamily,
                fontSize: "8px",
                color: theme.palette.customColors.grey,
              }}
            >
              DOCKING UNDER WAY
            </Typography>
          )}
        </Box>
      )}
      {typed >= info.body.length && popup.key === "sputnik" && (
        <Box mt={2}>
          <Box
            component="button"
            type="button"
            onClick={sendEvent(SPUTNIK_BEEP_EVENT)}
            sx={actionButtonSx}
          >
            <PixelArrow width={4} height={7} />
            BEEP!
          </Box>
        </Box>
      )}
    </Box>,
    document.body,
  );
};

export default SpacePopup;
