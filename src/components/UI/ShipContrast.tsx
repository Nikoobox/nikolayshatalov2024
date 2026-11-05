import { FC, PropsWithChildren, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useShipContrast from "./useShipContrast";

interface Props {
  component?: "div" | "span";
}

const ShipContrast: FC<PropsWithChildren<Props>> = ({
  children,
  component = "div",
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { ref: viewRef, inView } = useInView();
  const containerRef = useRef<HTMLElement | null>(null);
  const shadowRef = useRef<HTMLElement>(null);
  useShipContrast(containerRef, shadowRef, isDarkMode && inView);

  const setContainer = useCallback(
    (node: HTMLElement | null) => {
      containerRef.current = node;
      viewRef(node);
    },
    [viewRef],
  );

  return (
    <Box
      component={component}
      ref={setContainer}
      sx={{ position: "relative", display: "block" }}
    >
      {children}
      {isDarkMode && (
        <Box
          component={component}
          ref={shadowRef}
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            display: "block",
            visibility: "hidden",
            pointerEvents: "none",
            userSelect: "none",
            "&, & *": {
              color: `${theme.palette.customColors.charcoalBlack} !important`,
            },
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default ShipContrast;
