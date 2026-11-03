import { FC, useEffect, useRef } from "react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { SOYUZ_HAIL_EVENT } from "./spaceInfo";
import { pixelFontFamily } from "../../theme/variables";

const FLIGHT_MS = 5_000;
const REACH = 0.45;
const REPLY_DELAY_MS = 500;
const LIFT = 18;
const ARC = 24;
const FADE_IN = 0.12;
const FADE_OUT = 0.35;

type ShipKey = "soyuz4" | "soyuz5";

const ship = (key: ShipKey) =>
  document.querySelector<HTMLElement>(`[data-space-info=${key}]`);

const anchor = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top - LIFT };
};

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const SoyuzHail: FC = () => {
  const theme = useTheme();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const nodes = new Set<HTMLElement>();

    const send = (
      from: ShipKey,
      to: ShipKey,
      text: string,
      onArrive?: () => void,
    ) => {
      const layer = layerRef.current;
      const fromShip = ship(from);
      const toShip = ship(to);
      if (!layer || !fromShip || !toShip) return;
      const node = document.createElement("div");
      node.textContent = text;
      Object.assign(node.style, {
        position: "absolute",
        left: "0",
        top: "0",
        whiteSpace: "nowrap",
        opacity: "0",
      });
      layer.appendChild(node);
      nodes.add(node);
      const start = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / FLIGHT_MS);
        const a = anchor(fromShip);
        const b = anchor(toShip);
        const k = ease(t) * REACH;
        const x = a.x + (b.x - a.x) * k;
        const lift = Math.sin((Math.PI * t) / 2) * ARC;
        const y = a.y + (b.y - a.y) * k - lift;
        node.style.transform = `translate(${Math.round(x)}px, ${Math.round(
          y,
        )}px) translate(-50%, -100%)`;
        node.style.opacity = String(
          Math.min(1, t / FADE_IN, (1 - t) / FADE_OUT),
        );
        if (t < 1) {
          requestAnimationFrame(step);
          return;
        }
        node.remove();
        nodes.delete(node);
        onArrive?.();
      };
      requestAnimationFrame(step);
    };

    const flash = (key: ShipKey) => {
      const body = ship(key)?.firstElementChild as HTMLElement | null;
      body?.animate(
        [
          { filter: "brightness(1)" },
          { filter: "brightness(2.4)" },
          { filter: "brightness(1)" },
        ],
        { duration: 360, iterations: 3, easing: "steps(2, jump-none)" },
      );
    };

    const onHail = () => {
      send("soyuz5", "soyuz4", "PRIVET, AMUR!", () => {
        flash("soyuz4");
        timers.push(
          window.setTimeout(
            () =>
              send("soyuz4", "soyuz5", "PRIVET, BAIKAL!", () =>
                flash("soyuz5"),
              ),
            REPLY_DELAY_MS,
          ),
        );
      });
    };

    window.addEventListener(SOYUZ_HAIL_EVENT, onHail);
    return () => {
      cancelled = true;
      window.removeEventListener(SOYUZ_HAIL_EVENT, onHail);
      timers.forEach((timer) => window.clearTimeout(timer));
      nodes.forEach((node) => node.remove());
    };
  }, []);

  return (
    <Box
      ref={layerRef}
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: pixelFontFamily,
        fontSize: "10px",
        lineHeight: 1,
        color:
          theme.palette.mode === "dark"
            ? theme.palette.customColors.tealAccent
            : theme.palette.common.black,
      }}
    />
  );
};

export default SoyuzHail;
