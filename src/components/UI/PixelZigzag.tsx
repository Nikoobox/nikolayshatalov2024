import { FC } from "react";

import { Box } from "@mui/material";

const PIXEL = 4;

interface Props {
  color: string;
}

const PixelZigzag: FC<Props> = ({ color }) => (
  <Box
    aria-hidden="true"
    sx={{
      height: `${PIXEL * 2}px`,
      backgroundImage: [
        `linear-gradient(90deg, ${color} 0 ${PIXEL * 2}px, transparent ${PIXEL * 2}px ${PIXEL * 4}px)`,
        `linear-gradient(90deg, transparent 0 ${PIXEL * 2}px, ${color} ${PIXEL * 2}px ${PIXEL * 4}px)`,
      ].join(", "),
      backgroundSize: `${PIXEL * 4}px ${PIXEL}px`,
      backgroundPosition: `0 0, 0 ${PIXEL}px`,
      backgroundRepeat: "repeat-x",
    }}
  />
);

export default PixelZigzag;
