import { useEffect, useRef } from "react";

import { COLORS } from "../../theme";
import "./styles.css";

const {
  WHITE_ACCENT,
  PURPLE_ACCENT,
  GREEN_ACCENT,
  TEAL_ACCENT,
  YELLOW_ACCENT,
  RED_ACCENT,
  WHITE,
} = COLORS;

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

const SQUARE_SIZE = 5;
const GAP = 4;
const COLOR = COLORS.GREY_LIGHT;
const SPEED = 0.0015;
const MAX_OPACITY = 0.5;

const ACCENT_COLORS = [
  WHITE_ACCENT,
  PURPLE_ACCENT,
  GREEN_ACCENT,
  TEAL_ACCENT,
  YELLOW_ACCENT,
  RED_ACCENT,
];

// Chance for a square to be colored (e.g., 0.005 = 0.5%)
const COLORED_CHANCE = 0.005;

export default function FlickeringGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
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

          // Randomly pick accent color or default
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

    const draw = () => {
      ctx.fillStyle = WHITE;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const sq of squares) {
        if (sq.opacity < sq.targetOpacity) {
          sq.opacity = Math.min(sq.opacity + sq.speed, sq.targetOpacity);
        } else {
          sq.opacity = Math.max(sq.opacity - sq.speed, sq.targetOpacity);
        }

        if (Math.abs(sq.opacity - sq.targetOpacity) < 0.01) {
          sq.targetOpacity = Math.random() * sq.maxOpacity;

          // When a colored square fades out, move color to a different square
          if (sq.isColored && sq.targetOpacity < 0.05) {
            // Remove color from this square
            sq.isColored = false;
            sq.color = COLOR;
            sq.maxOpacity = sq.maxOpacity / 1.5; // reset to normal

            // Pick a random square to become colored
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
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="flickeringGrid" />;
}
