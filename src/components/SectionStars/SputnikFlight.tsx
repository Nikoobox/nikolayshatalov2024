import { FC, useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Sputnik from "../Landing/Sputnik";
import {
  IS_PHONE,
  KEEP_APART,
  Point,
  closestApproach,
  predictCenter,
} from "./spacePrediction";
import { SPUTNIK_BEEP_EVENT } from "./spaceInfo";
import { usePixelSnap } from "./usePixelSnap";
import { pixelFontFamily } from "../../theme/variables";

const SIZE = 9 * (IS_PHONE ? 4 : 6);

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
  x: number;
  y: number;
}

const PASS = 210_000;
const WAIT = 45_000;
const TOTAL = PASS + WAIT;
const BAND_TOP = 0.8;
const BAND_BOTTOM = 0.9;
const LAUNCH_X = 0.1;
const LAUNCH_CHECK_MS = 500;

const ROTATE_FROM = -12;
const ROTATE_TO = 18;

const GUARD_EVERY_MS = 400;
const GUARD_LOOKAHEAD_MS = 10_000;
const GUARD_STEP_MS = 500;
const GUARD_RATES = [1, 3, 0.2];

const soyuzShips = () => [
  ...document.querySelectorAll<HTMLElement>("[data-space-info^=soyuz]"),
];

const clearanceAtRate = (sputnik: HTMLElement, rate: number) => {
  let closest = Infinity;
  for (let ms = 0; ms <= GUARD_LOOKAHEAD_MS; ms += GUARD_STEP_MS) {
    const own = predictCenter(sputnik, ms * rate);
    if (!own) return Infinity;
    for (const soyuz of soyuzShips()) {
      const other = predictCenter(soyuz, ms);
      if (other) {
        closest = Math.min(
          closest,
          Math.hypot(own.x - other.x, own.y - other.y),
        );
      }
    }
  }
  return closest;
};

const CANDIDATES = 60;
const CURVE_POINTS = 7;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

interface Route {
  from: Point;
  ctrl: Point;
  to: Point;
}

const pointOnRoute = ({ from, ctrl, to }: Route, f: number): Point => ({
  x: (1 - f) ** 2 * from.x + 2 * (1 - f) * f * ctrl.x + f ** 2 * to.x,
  y: (1 - f) ** 2 * from.y + 2 * (1 - f) * f * ctrl.y + f ** 2 * to.y,
});

const bandY = (vh: number) => rand(BAND_TOP, BAND_BOTTOM) * vh;

const levelRoute = (fromX: number, toX: number, vh: number): Route => {
  const y0 = bandY(vh);
  const y1 = bandY(vh);
  return {
    from: { x: fromX, y: y0 },
    ctrl: { x: (fromX + toX) / 2, y: (y0 + y1) / 2 },
    to: { x: toX, y: y1 },
  };
};

const randomCrossing = (vw: number, vh: number): Route =>
  Math.random() < 0.5
    ? levelRoute(-SIZE, vw + SIZE, vh)
    : levelRoute(vw + SIZE, -SIZE, vh);

const randomLaunch = (vw: number, vh: number): Route =>
  levelRoute(LAUNCH_X * vw, vw + SIZE, vh);

const planRoute = (
  vw: number,
  vh: number,
  delay: number,
  isFirst: boolean,
): Route => {
  const soyuz = soyuzShips();
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
    if (clearance > KEEP_APART * 2) break;
  }
  return best!.route;
};

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
  return [...frames, { ...frames[frames.length - 1], offset: 1 }];
};

const SputnikFlight: FC = () => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [beeps, setBeeps] = useState<Beep[]>([]);
  usePixelSnap([ref]);

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

    const layerVisible = () =>
      ref.current &&
      getComputedStyle(ref.current)
        .getPropertyValue("--sputnik-opacity")
        .trim() === "1";
    const guard = window.setInterval(() => {
      const el = ref.current;
      const [animation] = animations;
      if (!el || animation?.playState !== "running") return;
      let rate = 1;
      if (clearanceAtRate(el, 1) < KEEP_APART) {
        let best = -1;
        for (const candidate of GUARD_RATES) {
          const clearance = clearanceAtRate(el, candidate);
          if (clearance > best) [best, rate] = [clearance, candidate];
        }
      }
      if (animation.playbackRate !== rate) animation.updatePlaybackRate(rate);
    }, GUARD_EVERY_MS);

    const waitForLayer = window.setInterval(() => {
      if (!layerVisible()) return;
      window.clearInterval(waitForLayer);
      pass(0, true);
    }, LAUNCH_CHECK_MS);
    return () => {
      cancelled = true;
      window.clearInterval(waitForLayer);
      window.clearInterval(guard);
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
