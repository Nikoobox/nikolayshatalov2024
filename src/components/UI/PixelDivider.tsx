import { FC } from "react";

import { Box } from "@mui/material";

const STEP = 8;
const TILE = STEP * 8;

interface Props {
  fill: string;
  background: string;
}

// Stepped "pixel hills" edge between two section backgrounds.
const PixelDivider: FC<Props> = ({ fill, background }) => {
  // same color on both sides: nothing to draw (and no strip covering what's
  // behind it)
  if (fill === background) return null;

  const row = (from: number, to: number) =>
    `linear-gradient(90deg, transparent 0 ${from}px, ${fill} ${from}px ${to}px, transparent ${to}px ${TILE}px)`;

  return (
    <Box
      aria-hidden="true"
      sx={{
        height: STEP * 3,
        backgroundColor: background,
        backgroundImage: [
          row(STEP * 3, STEP * 5),
          row(STEP, STEP * 7),
          `linear-gradient(${fill}, ${fill})`,
        ].join(", "),
        backgroundSize: `${TILE}px ${STEP}px`,
        backgroundPosition: `0 0, 0 ${STEP}px, 0 ${STEP * 2}px`,
        backgroundRepeat: "repeat-x",
      }}
    />
  );
};

export default PixelDivider;
