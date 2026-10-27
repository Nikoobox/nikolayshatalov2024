import { FC, useEffect, useRef } from "react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Soyuz, {
  ORBITAL_CENTER_COL,
  ORBITAL_TOP_ROW,
  PROBE_DEPTH,
  SOYUZ_HEIGHT,
  SOYUZ_WIDTH,
} from "../Landing/Soyuz";
import PixelSprite from "../Landing/PixelSprite";
import { spriteRects } from "../Landing/pixelArt";
import { isCovered } from "./spaceHitTest";
import { KEEP_APART, Point, closestApproach } from "./spacePrediction";
import { COMMAND_DOCKING_EVENT } from "./spaceInfo";
import { usePixelSnap } from "./usePixelSnap";

// one fixed, whole-number pixel size (screen px per sprite pixel) so every
// sprite pixel stays sharp
const UNIT = 5; // 11x11 grid -> 55px
const W_DOCK = SOYUZ_WIDTH * UNIT;
const H_DOCK = SOYUZ_HEIGHT * UNIT;
// Soyuz 4's probe tip sits inside Soyuz 5's cup when docked
const PROBE_OVERLAP = PROBE_DEPTH * UNIT;

// phase lengths in ms; a fresh random route is generated every run
const WANDER = 60_000;
const APPROACH = 25_000;
const DOCKED = 35_000;
const UNDOCK = 30_000;
const PAUSE = 8_000;

// docked pair footprint plus breathing room around it
const PAIR_WIDTH = 2 * W_DOCK - PROBE_OVERLAP;
const PAIR_HEIGHT = H_DOCK;
const CLEARANCE = 24;

// where on screen the ships may fly (fractions of the viewport height)
const SKY_TOP = 0.12;
const SKY_BOTTOM = 0.85;

// gentle random tilt while flying free (degrees)
const TILT = 12;

// routes tried when steering clear of Sputnik
const ROUTE_CANDIDATES = 10;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const tilt = () => rand(-TILT, TILT);
const sputnik = () =>
  document.querySelector<HTMLElement>("[data-space-info=sputnik]");

interface Pose extends Point {
  rotate?: number; // degrees; 0 = level (always level while docked)
}

interface Waypoint extends Pose {
  at: number; // ms into the phase
  opacity?: number;
  easing?: string; // easing of the segment that starts here
}

// positioned by center
const toKeyframes = (points: Waypoint[], total: number): Keyframe[] =>
  points.map(
    ({ at, x, y, rotate = 0, opacity = 1, easing = "ease-in-out" }) => ({
      offset: at / total,
      transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rotate}deg)`,
      opacity,
      easing,
    }),
  );

// ----- keeping clear of page content and of Sputnik ------------------------

// Sample spacing must be smaller than a line of text, or labels slip through.
const SAMPLE_STEP = 12;

// how many sample points of a rectangle (centered at cx, cy) are covered;
// stops counting once it passes `limit`
const coveredSamples = (
  cx: number,
  cy: number,
  w: number,
  h: number,
  limit = Infinity,
) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let covered = 0;
  for (let x = cx - w / 2; x <= cx + w / 2; x += SAMPLE_STEP) {
    for (let y = cy - h / 2; y <= cy + h / 2; y += SAMPLE_STEP) {
      // off-screen counts as covered so the pair stays fully visible
      if (x < 0 || y < 0 || x > vw || y > vh || isCovered(x, y)) {
        covered++;
        if (covered > limit) return covered;
      }
    }
  }
  return covered;
};

const pairCoverage = (cx: number, cy: number, limit?: number) =>
  coveredSamples(
    cx,
    cy,
    PAIR_WIDTH + CLEARANCE * 2,
    PAIR_HEIGHT + CLEARANCE * 2,
    limit,
  );

// would Sputnik pass near this spot while the pair approaches and is docked?
const sputnikNear = (x: number, y: number, fromMs: number, toMs: number) => {
  const samples = [];
  for (let ms = fromMs; ms <= toMs; ms += 4_000)
    samples.push({ x, y, msAhead: ms });
  return closestApproach(sputnik(), samples) < KEEP_APART;
};

const TOO_CLOSE = 1e6;

// clearest docking point away from Sputnik, preferring spots near the ships
const findDockingPoint = (near: Point) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let best = { x: vw / 2, y: vh / 2, covered: Infinity, distance: Infinity };

  for (let fx = 0.1; fx <= 0.9; fx += 0.04) {
    for (let fy = SKY_TOP + 0.03; fy <= SKY_BOTTOM - 0.05; fy += 0.04) {
      const x = fx * vw;
      const y = fy * vh;
      const penalty = sputnikNear(x, y, APPROACH * 0.5, APPROACH + DOCKED)
        ? TOO_CLOSE
        : 0;
      // a spot near Sputnik only counts if nothing better turns up
      if (penalty && best.covered < TOO_CLOSE) continue;
      // no need to finish counting a spot that's already worse than the best
      const covered = penalty + pairCoverage(x, y, best.covered - penalty);
      const distance = Math.hypot(x - near.x, y - near.y);
      if (
        covered < best.covered ||
        (covered === best.covered && distance < best.distance)
      ) {
        best = { x, y, covered, distance };
      }
    }
  }
  return best;
};

// drift for the docked pair that ends in empty space away from Sputnik
const findDrift = (from: Point) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const options = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { dx: Math.cos(angle) * 0.1 * vw, dy: Math.sin(angle) * 0.06 * vh };
  }).sort(() => Math.random() - 0.5);

  return (
    options.find(
      ({ dx, dy }) =>
        pairCoverage(from.x + dx, from.y + dy, 0) === 0 &&
        pairCoverage(from.x + dx / 2, from.y + dy / 2, 0) === 0 &&
        !sputnikNear(from.x + dx, from.y + dy, APPROACH, APPROACH + DOCKED),
    ) ?? { dx: rand(-20, 20), dy: rand(-12, 12) }
  );
};

// ----- flight plans -------------------------------------------------------

// side -1 = Soyuz 4 (from the left), 1 = Soyuz 5 (from the right)
type Side = -1 | 1;

const edgeX = (side: Side, vw: number) => (side === -1 ? -W_DOCK : vw + W_DOCK);
const skyY = (vh: number) => rand(SKY_TOP, SKY_BOTTOM) * vh;

// enter from its edge and meander through random waypoints
const randomWander = (side: Side, vw: number, vh: number): Waypoint[] => {
  const lane = (from: number, to: number) =>
    side === -1 ? rand(from, to) * vw : (1 - rand(from, to)) * vw;
  const edge = edgeX(side, vw);

  return [
    {
      at: 0,
      x: edge,
      y: skyY(vh),
      rotate: tilt(),
      opacity: 0,
    },
    {
      at: 2_000,
      x: edge - side * 40,
      y: skyY(vh),
      rotate: tilt(),
    },
    {
      at: WANDER * 0.35,
      x: lane(0.05, 0.2),
      y: skyY(vh),
      rotate: tilt(),
    },
    {
      at: WANDER * 0.7,
      x: lane(0.12, 0.28),
      y: skyY(vh),
      rotate: tilt(),
    },
    {
      at: WANDER,
      x: lane(0.18, 0.35),
      y: skyY(vh),
      rotate: tilt(),
    },
  ];
};

// of several random wanders, the one that stays farthest from Sputnik
const planWander = (side: Side, vw: number, vh: number): Waypoint[] => {
  let best: { route: Waypoint[]; clearance: number } | null = null;
  for (let i = 0; i < ROUTE_CANDIDATES; i++) {
    const route = randomWander(side, vw, vh);
    const clearance = closestApproach(
      sputnik(),
      route.map(({ x, y, at }) => ({ x, y, msAhead: at })),
    );
    if (!best || clearance > best.clearance) best = { route, clearance };
    if (clearance > KEEP_APART * 1.5) break;
  }
  return best!.route;
};

// approach a docking point, dock, drift together, back off and leave
const planRendezvous = (
  side: Side,
  start: Pose,
  docked: Point,
  drift: { dx: number; dy: number },
  vw: number,
  vh: number,
): Waypoint[] => {
  const tStaging = APPROACH * 0.5;
  const tDock = APPROACH;
  const tUndock = tDock + DOCKED;
  const tBackOff = tUndock + UNDOCK * 0.25;
  const tGone = tUndock + UNDOCK;
  const total = tGone + PAUSE;
  const end = { x: docked.x + drift.dx, y: docked.y + drift.dy };
  const edge = edgeX(side, vw);
  const exitY = skyY(vh);
  const exitTilt = tilt();

  return [
    { ...start, at: 0 },
    {
      // line up a little way out from the docking point
      at: tStaging,
      x: docked.x + side * Math.min(0.12 * vw, 140),
      y: docked.y + rand(-0.04, 0.04) * vh,
      rotate: rand(-3, 3),
      easing: "cubic-bezier(0.2, 0.6, 0.3, 1)", // slow down into docking
    },
    { at: tDock, ...docked, easing: "linear" },
    { at: tUndock, ...end },
    {
      at: tBackOff,
      x: end.x + side * 40,
      y: end.y,
      easing: "ease-in",
    },
    {
      at: tGone,
      x: edge,
      y: exitY,
      rotate: exitTilt,
      opacity: 0,
    },
    {
      at: total,
      x: edge,
      y: exitY,
      rotate: exitTilt,
      opacity: 0,
    },
  ];
};

// ----- the spacewalk --------------------------------------------------------

// cosmonaut kept minimal: a head over a body (1x2 units at 6px)
const WALKER_ROWS = ["W", "W"];
const WALKER_UNIT = 6;
const WALKER_W = WALKER_ROWS[0].length * WALKER_UNIT;
const WALKER_H = WALKER_ROWS.length * WALKER_UNIT;

// Like Yeliseyev and Khrunov in 1969: two cosmonauts climb out of Soyuz 5's
// orbital module, cross over the hull, and go in through Soyuz 4's hatch.
// Positions follow the pair while it drifts (pair center moves linearly).
const planSpacewalk = (
  docked4: Point,
  docked5: Point,
  drift: { dx: number; dy: number },
  startMs: number, // ms after docking
  total: number,
): Waypoint[] => {
  const tDock = APPROACH;
  const u = UNIT; // one ship pixel on screen
  const halfW = W_DOCK / 2;
  const hullTop = docked5.y - H_DOCK / 2 + ORBITAL_TOP_ROW * u;
  // feet resting on the hull, not hovering above it
  const standY = hullTop - WALKER_H / 2 + 1;
  // orbital module centers, measured from each ship's nose
  const from = { x: docked5.x - halfW + ORBITAL_CENTER_COL * u, y: standY };
  const to = { x: docked4.x + halfW - ORBITAL_CENTER_COL * u, y: standY };
  // straight across, staying on the hull the whole way
  const overJoint = { x: (from.x + to.x) / 2, y: standY };

  const walkTime = 12_000;
  const t0 = tDock + startMs;
  const at = (ms: number, offset: Point, opacity: number): Waypoint => {
    const k = Math.min(Math.max((ms - tDock) / DOCKED, 0), 1);
    return {
      at: ms,
      x: offset.x + drift.dx * k,
      y: offset.y + drift.dy * k,
      opacity,
      easing: "linear",
    };
  };

  return [
    at(0, from, 0),
    at(t0, from, 0),
    at(t0 + 600, from, 1),
    at(t0 + walkTime / 2, overJoint, 1),
    at(t0 + walkTime - 600, to, 1),
    at(t0 + walkTime, to, 0),
    at(total, to, 0),
  ];
};

const Walker: FC = () => {
  const theme = useTheme();
  const rects = spriteRects(WALKER_ROWS, { W: theme.palette.common.white });
  return (
    <PixelSprite
      rects={rects}
      width={WALKER_ROWS[0].length}
      height={WALKER_ROWS.length}
    />
  );
};

// where a ship is right now, read back from its rendered transform
const currentPose = (el: HTMLElement): Pose => {
  const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
  return {
    // the transform ends with translate(-50%, -50%), so add half the size back
    x: m.e + el.offsetWidth / 2,
    y: m.f + el.offsetHeight / 2,
    rotate: (Math.atan2(m.b, m.a) * 180) / Math.PI,
  };
};

// ----- component ----------------------------------------------------------

// Soyuz 4 and Soyuz 5 meander, dock nose to nose in a clear spot away from
// Sputnik, swap two crew members on a spacewalk, fly together, and undock.
const DockingSoyuz: FC = () => {
  const soyuz4Ref = useRef<HTMLDivElement>(null);
  const soyuz5Ref = useRef<HTMLDivElement>(null);
  const walkerRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  usePixelSnap([soyuz4Ref, soyuz5Ref, ...walkerRefs]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animations: Animation[] = [];
    let cancelled = false;

    const options = (total: number) => ({
      duration: total,
      fill: "forwards" as const,
    });
    const play = (el: HTMLElement, points: Waypoint[], total: number) =>
      el.animate(toKeyframes(points, total), options(total));

    const wander = () => {
      const s4 = soyuz4Ref.current;
      const s5 = soyuz5Ref.current;
      if (!s4 || !s5 || cancelled) return;
      s4.dataset.soyuzPhase = "wander";

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const route4 = planWander(-1, vw, vh);
      const route5 = planWander(1, vw, vh);
      // movement of Soyuz 4 first, so animations[0] marks the phase end
      animations = [play(s4, route4, WANDER), play(s5, route5, WANDER)];
      animations[0].onfinish = () =>
        rendezvous(route4[route4.length - 1], route5[route5.length - 1]);
    };

    // the docking spot is chosen now, against what's on screen and where
    // Sputnik is headed
    const rendezvous = (from4: Pose, from5: Pose) => {
      const s4 = soyuz4Ref.current;
      const s5 = soyuz5Ref.current;
      if (!s4 || !s5 || cancelled) return;
      s4.dataset.soyuzPhase = "rendezvous";

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const point = findDockingPoint({
        x: (from4.x + from5.x) / 2,
        y: (from4.y + from5.y) / 2,
      });
      const drift = findDrift(point);
      // visual centers of each ship when docked at `point`
      const docked5 = { x: point.x + PAIR_WIDTH / 2 - W_DOCK / 2, y: point.y };
      const docked4 = { x: docked5.x - (W_DOCK - PROBE_OVERLAP), y: point.y };

      const route4 = planRendezvous(-1, from4, docked4, drift, vw, vh);
      const route5 = planRendezvous(1, from5, docked5, drift, vw, vh);
      const total = route4[route4.length - 1].at;

      animations = [play(s4, route4, total), play(s5, route5, total)];
      // second cosmonaut follows the first a few seconds later
      [6_000, 13_000].forEach((startMs, i) => {
        const walker = walkerRefs[i].current;
        if (!walker) return;
        animations.push(
          play(
            walker,
            planSpacewalk(docked4, docked5, drift, startMs, total),
            total,
          ),
        );
      });
      animations[0].onfinish = wander;
    };

    // "Command docking" from the Soyuz 4 popup: break off the wander right
    // where the ships are and start the approach now
    const commandDocking = () => {
      const s4 = soyuz4Ref.current;
      const s5 = soyuz5Ref.current;
      if (!s4 || !s5 || s4.dataset.soyuzPhase !== "wander") return;
      const from4 = currentPose(s4);
      const from5 = currentPose(s5);
      animations.forEach((animation) => animation.cancel());
      rendezvous(from4, from5);
    };
    window.addEventListener(COMMAND_DOCKING_EVENT, commandDocking);

    wander();
    return () => {
      cancelled = true;
      window.removeEventListener(COMMAND_DOCKING_EVENT, commandDocking);
      animations.forEach((animation) => animation.cancel());
    };
    // refs are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {[
        { ref: soyuz4Ref, variant: "active" as const, flip: true },
        { ref: soyuz5Ref, variant: "passive" as const, flip: false },
      ].map(({ ref, variant, flip }) => (
        <Box
          key={variant}
          ref={ref}
          data-space-info={variant === "active" ? "soyuz4" : "soyuz5"}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W_DOCK,
            height: H_DOCK,
            opacity: 0,
            transformOrigin: "50% 50%",
          }}
        >
          {/* Soyuz 4 is mirrored so its probe faces Soyuz 5 */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              transform: flip ? "scaleX(-1)" : "none",
            }}
          >
            <Soyuz variant={variant} />
          </Box>
        </Box>
      ))}
      {walkerRefs.map((ref, i) => (
        <Box
          key={i}
          ref={ref}
          aria-hidden="true"
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: WALKER_W,
            height: WALKER_H,
            opacity: 0,
          }}
        >
          <Walker />
        </Box>
      ))}
    </>
  );
};

export default DockingSoyuz;
