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

const PASS = 210_000; // ~3.5 min per pass
const WAIT = 45_000; // off-screen before the next pass
const TOTAL = PASS + WAIT;
// first pass starts near the bottom, this far from the left edge
const LAUNCH_X = 0.3;

// slowly turning as it goes
const ROTATE_FROM = -12;
const ROTATE_TO = 18;

// candidate routes tried per pass, and how many points describe the curve
const CANDIDATES = 60;
const CURVE_POINTS = 7;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// quadratic curve from `from` to `to`, pulled toward `ctrl`
interface Route {
  from: Point;
  ctrl: Point;
  to: Point;
}

const pointOnRoute = ({ from, ctrl, to }: Route, f: number): Point => ({
  x: (1 - f) ** 2 * from.x + 2 * (1 - f) * f * ctrl.x + f ** 2 * to.x,
  y: (1 - f) ** 2 * from.y + 2 * (1 - f) * f * ctrl.y + f ** 2 * to.y,
});

// gentle curve across the full width of the screen
const randomCrossing = (vw: number, vh: number): Route => {
  const y0 = rand(0.1, 0.9) * vh;
  const y1 = rand(0.1, 0.9) * vh;
  return {
    from: { x: -SIZE, y: y0 },
    ctrl: { x: vw / 2, y: (y0 + y1) / 2 + rand(-0.15, 0.15) * vh },
    to: { x: vw + SIZE, y: y1 },
  };
};

// first pass: already on screen near the bottom, rises, then curves off to a
// side
const randomLaunch = (vw: number, vh: number): Route => ({
  from: { x: LAUNCH_X * vw, y: vh - SIZE },
  ctrl: { x: LAUNCH_X * vw, y: rand(0.2, 0.45) * vh },
  to: { x: Math.random() < 0.5 ? -SIZE : vw + SIZE, y: rand(0.1, 0.5) * vh },
});

// pick the random route that keeps farthest from where the Soyuz are headed
const planRoute = (
  vw: number,
  vh: number,
  delay: number,
  isFirst: boolean,
): Route => {
  const soyuz = [
    ...document.querySelectorAll<HTMLElement>("[data-space-info^=soyuz]"),
  ];
  let best: { route: Route; clearance: number } | null = null;

  for (let i = 0; i < CANDIDATES; i++) {
    const route = isFirst ? randomLaunch(vw, vh) : randomCrossing(vw, vh);
    const samples = Array.from({ length: 21 }, (_, k) => ({
      ...pointOnRoute(route, k / 20),
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
const keyframesFor = (route: Route): Keyframe[] => {
  const frames = Array.from({ length: CURVE_POINTS }, (_, k) => {
    const f = k / (CURVE_POINTS - 1);
    const { x, y } = pointOnRoute(route, f);
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

// Sputnik launches from near the bottom, then crosses the whole screen on a
// new random route each pass, steering clear of the Soyuz pair.
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

    const pass = (delay: number, isFirst = false) => {
      const el = ref.current;
      if (!el || cancelled) return;
      const route = planRoute(
        window.innerWidth,
        window.innerHeight,
        delay,
        isFirst,
      );
      const options = { duration: TOTAL, delay, fill: "both" as const };
      animations = [el.animate(keyframesFor(route), options)];
      animations[0].onfinish = () => pass(0);
    };

    // launch once the ships' layer fades in (scrolled into the sections), so
    // the first pass is seen from its start
    const layerVisible = () =>
      ref.current &&
      getComputedStyle(ref.current)
        .getPropertyValue("--sputnik-opacity")
        .trim() === "1";
    const launchWhenVisible = () => {
      if (!layerVisible()) return;
      window.removeEventListener("scroll", launchWhenVisible);
      pass(0, true);
    };
    window.addEventListener("scroll", launchWhenVisible, { passive: true });
    launchWhenVisible();
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", launchWhenVisible);
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
