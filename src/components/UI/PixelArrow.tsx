import { FC } from "react";

const ROTATION = { right: 0, down: 90, left: 180 } as const;

interface Props {
  width?: number;
  height?: number;
  direction?: keyof typeof ROTATION;
}

// Pixel ▶ caret; takes the surrounding text color.
const PixelArrow: FC<Props> = ({
  width = 6,
  height = 10,
  direction = "right",
}) => (
  <svg
    className="pixel-arrow"
    width={width}
    height={height}
    viewBox="0 0 4 7"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
    style={
      direction === "right"
        ? undefined
        : { transform: `rotate(${ROTATION[direction]}deg)` }
    }
  >
    <rect x="0" y="0" width="1" height="7" />
    <rect x="1" y="1" width="1" height="5" />
    <rect x="2" y="2" width="1" height="3" />
    <rect x="3" y="3" width="1" height="1" />
  </svg>
);

export default PixelArrow;
