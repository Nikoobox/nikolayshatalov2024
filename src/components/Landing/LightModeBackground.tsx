import { useEffect, useRef } from "react";
import { styled } from "@mui/system";

import { COLORS } from "../../theme";

const { TEAL_ACCENT, BLACK, WHITE } = COLORS;

interface GridSquare {
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  speed: number;
  maxOpacity: number;
  color: string;
  isColored: boolean;
}

const SQUARE_SIZE = 7;
const GAP = 5;
const COLOR = COLORS.GREY_LIGHT;
const SPEED = 0.0015;
const MAX_OPACITY = 0.5;
const FRAME_MS = 1000 / 30;
const BASE_FRAME_MS = 1000 / 60;

const ACCENT_COLORS = [TEAL_ACCENT, TEAL_ACCENT, BLACK];

const COLORED_CHANCE = 0.005;

const StyledCanvas = styled("canvas", {
  shouldForwardProp: (prop) => prop !== "fixed",
})<{ fixed?: boolean }>(({ fixed }) => ({
  position: fixed ? "fixed" : "absolute",
  width: "100%",
  height: "100vh",
  left: 0,
  top: 0,
  zIndex: -1,
  pointerEvents: "none",
}));

const LightModeBackground = ({ fixed }: { fixed?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let lastTime = 0;
    let isVisible = true;
    let squares: GridSquare[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSquares();
    };

    const initSquares = () => {
      squares = [];
      const cols = Math.ceil(canvas.width / (SQUARE_SIZE + GAP));
      const rows = Math.ceil(canvas.height / (SQUARE_SIZE + GAP));

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const fadeMultiplier = 1 - row / rows;
          const maxOpacity = MAX_OPACITY * fadeMultiplier;

          const isColored = Math.random() < COLORED_CHANCE;
          const color = isColored
            ? ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
            : COLOR;

          squares.push({
            x: col * (SQUARE_SIZE + GAP),
            y: row * (SQUARE_SIZE + GAP),
            opacity: Math.random() * maxOpacity,
            targetOpacity: Math.random() * maxOpacity,
            speed: SPEED + Math.random() * SPEED,
            maxOpacity: isColored ? maxOpacity * 1.5 : maxOpacity,
            color,
            isColored,
          });
        }
      }
    };

    const draw = (time: number) => {
      animationId = requestAnimationFrame(draw);
      const elapsed = time - lastTime;
      if (lastTime && elapsed < FRAME_MS) return;
      const step = lastTime ? Math.min(elapsed, 100) / BASE_FRAME_MS : 1;
      lastTime = time;

      ctx.fillStyle = WHITE;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const sq of squares) {
        if (sq.opacity < sq.targetOpacity) {
          sq.opacity = Math.min(sq.opacity + sq.speed * step, sq.targetOpacity);
        } else {
          sq.opacity = Math.max(sq.opacity - sq.speed * step, sq.targetOpacity);
        }

        if (Math.abs(sq.opacity - sq.targetOpacity) < 0.01) {
          sq.targetOpacity = Math.random() * sq.maxOpacity;

          if (sq.isColored && sq.targetOpacity < 0.05) {
            sq.isColored = false;
            sq.color = COLOR;
            sq.maxOpacity = sq.maxOpacity / 1.5;

            const randomIndex = Math.floor(Math.random() * squares.length);
            const newColoredSquare = squares[randomIndex];
            const fadeMultiplier = 1 - newColoredSquare.y / canvas.height;

            newColoredSquare.isColored = true;
            newColoredSquare.color =
              ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
            newColoredSquare.maxOpacity = MAX_OPACITY * fadeMultiplier * 1.5;
            newColoredSquare.targetOpacity = newColoredSquare.maxOpacity;
          }
        }

        ctx.fillStyle = sq.color;
        ctx.globalAlpha = sq.opacity;
        ctx.fillRect(sq.x, sq.y, SQUARE_SIZE, SQUARE_SIZE);
      }

      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (animationId || !isVisible || document.hidden) return;
      lastTime = 0;
      animationId = requestAnimationFrame(draw);
    };

    const stop = () => {
      cancelAnimationFrame(animationId);
      animationId = 0;
    };

    const onVisibilityChange = () => (document.hidden ? stop() : start());

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    });

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    observer.observe(canvas);
    start();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      stop();
    };
  }, []);

  return <StyledCanvas ref={canvasRef} fixed={fixed} />;
};

export default LightModeBackground;
