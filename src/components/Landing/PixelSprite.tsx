import { FC } from "react";

import { PixelRect } from "./pixelArt";

interface Props {
  rects: PixelRect[];
  width: number;
  height: number;
}

const PixelSprite: FC<Props> = ({ rects, width, height }) => (
  <svg
    viewBox={`0 0 ${width} ${height}`}
    width="100%"
    height="100%"
    shapeRendering="crispEdges"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    {rects.map(({ x, y, w, h, c }, i) => (
      <rect key={i} x={x} y={y} width={w} height={h} fill={c} />
    ))}
  </svg>
);

export default PixelSprite;
