import { FC, useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Sputnik from "../Landing/Sputnik";
import { KEEP_APART, Point, closestApproach } from "./spacePrediction";
import { SPUTNIK_BEEP_EVENT } from "./spaceInfo";
import { usePixelSnap } from "./usePixelSnap";
import { pixelFontFamily } from "../../theme/variables";

// 9x9 sprite at a fixed 6px per sprite pixel (whole numbers stay sharp)
const SIZE = 54;

// "BEEP!"s from the popup button: each one leaves the ship, drifts away and
// slowly fades out; they go out one after another
const BEEP_TIMES = 3;
const BEEP_GAP_MS = 4_500;
const BEEP_FLIGHT_MS = 14_000;
const beepAway = keyframes`
  0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
  6% { opacity: 1; }
  100% { opacity: 0; transform: translate(560px, -150px) scale(1.15); }
`;

interface Beep {
  id: number;
  x: number; // where the ship was when it beeped
  y: number;
}

const PASS = 210_000; // ~3.5 min to cross the screen
const WAIT = 45_000; // off-screen before the next pass
const TOTAL = PASS + WAIT;
const FIRST_DELAY = 7_000;

// slowly turning as it goes
const ROTATE_FROM = -12;
const ROTATE_TO = 18;

// candidate routes tried per pass, and how many points describe the curve
const CANDIDATES = 60;
const CURVE_POINTS = 7;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

interface Route {
  y0: number; // left edge
  y1: number; // right edge
  bend: number; // how far the middle bows up or down
}

// gentle curve across the full width of the screen
const pointOnRoute = (route: Route, f: number, vw: number): Point => {
  const mid = (route.y0 + route.y1) / 2 + route.bend;
  return {
    x: -SIZE + (vw + 2 * SIZE) * f,
    y: (1 - f) ** 2 * route.y0 + 2 * (1 - f) * f * mid + f ** 2 * route.y1,
  };
};

// pick the random route that keeps farthest from where the Soyuz are headed
const planRoute = (vw: number, vh: number, delay: number): Route => {
  const soyuz = [
    ...document.querySelectorAll<HTMLElement>("[data-space-info^=soyuz]"),
  ];
  let best: { route: Route; clearance: number } | null = null;

  for (let i = 0; i < CANDIDATES; i++) {
    const route = {
      y0: rand(0.1, 0.9) * vh,
      y1: rand(0.1, 0.9) * vh,
      bend: rand(-0.15, 0.15) * vh,
    };
    const samples = Array.from({ length: 21 }, (_, k) => ({
      ...pointOnRoute(route, k / 20, vw),
      msAhead: delay + (k / 20) * PASS,
    }));
    const clearance = Math.min(
      ...soyuz.map((el) => closestApproach(el, samples)),
    );
    if (!best || clearance > best.clearance) best = { route, clearance };
    // plenty of room already; keep the rest of the variety
    if (clearance > KEEP_APART * 2) break;
  }
  return best!.route;
};

// positioned by center
const keyframesFor = (route: Route, vw: number): Keyframe[] => {
  const frames = Array.from({ length: CURVE_POINTS }, (_, k) => {
    const f = k / (CURVE_POINTS - 1);
    const { x, y } = pointOnRoute(route, f, vw);
    const rotate = ROTATE_FROM + (ROTATE_TO - ROTATE_FROM) * f;
    return {
      offset: (f * PASS) / TOTAL,
      transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rotate}deg)`,
      easing: "linear",
    };
  });
  // wait off-screen at the far edge until the next pass
  return [...frames, { ...frames[frames.length - 1], offset: 1 }];
};

// Sputnik crosses the whole screen on a new random route each pass, steering
// clear of the Soyuz pair.
const SputnikFlight: FC = () => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [beeps, setBeeps] = useState<Beep[]>([]);
  usePixelSnap([ref]);

  // each beep starts wherever the ship is at that moment, then travels on its
  // own (upright and readable, not riding the rotating ship)
  useEffect(() => {
    let nextId = 0;
    const timers: number[] = [];
    const onBeep = () => {
      for (let i = 0; i < BEEP_TIMES; i++) {
        timers.push(
          window.setTimeout(() => {
            const ship = ref.current?.getBoundingClientRect();
            if (!ship) return;
            const beep = { id: nextId++, x: ship.right - 6, y: ship.top - 4 };
            setBeeps((list) => [...list, beep]);
          }, i * BEEP_GAP_MS),
        );
      }
    };
    window.addEventListener(SPUTNIK_BEEP_EVENT, onBeep);
    return () => {
      window.removeEventListener(SPUTNIK_BEEP_EVENT, onBeep);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animations: Animation[] = [];
    let cancelled = false;

    const pass = (delay: number) => {
      const el = ref.current;
      if (!el || cancelled) return;
      const vw = window.innerWidth;
      const route = planRoute(vw, window.innerHeight, delay);
      const options = { duration: TOTAL, delay, fill: "both" as const };
      animations = [el.animate(keyframesFor(route, vw), options)];
      animations[0].onfinish = () => pass(0);
    };

    pass(FIRST_DELAY);
    return () => {
      cancelled = true;
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <>
      <Box
        ref={ref}
        data-space-info="sputnik"
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SIZE,
          height: SIZE,
          transformOrigin: "50% 50%",
          // parked off-screen until the first pass starts
          transform: `translate(${-2 * SIZE}px, 0)`,
        }}
      >
        <Sputnik />
      </Box>
      {beeps.map((beep) => (
        <Box
          key={beep.id}
          aria-hidden="true"
          onAnimationEnd={() =>
            setBeeps((list) => list.filter(({ id }) => id !== beep.id))
          }
          sx={{
            position: "absolute",
            left: beep.x,
            top: beep.y,
            opacity: 0,
            fontFamily: pixelFontFamily,
            fontSize: "10px",
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: theme.palette.customColors.tealAccent,
            animation: `${beepAway} ${BEEP_FLIGHT_MS}ms ease-out forwards`,
          }}
        >
          BEEP!
        </Box>
      ))}
    </>
  );
};

export default SputnikFlight;
