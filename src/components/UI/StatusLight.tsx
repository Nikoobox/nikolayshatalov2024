import { FC } from "react";
import { keyframes } from "@emotion/react";

import { Box } from "@mui/material";

import { pixelBodyFontFamily } from "../../theme/variables";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.3; }
`;

interface Props {
  status: string;
}

// Square "LED" + label; live projects blink, retired ones stay dim.
const StatusLight: FC<Props> = ({ status }) => {
  const isLive = status === "Live";

  return (
    <Box
      component="span"
      sx={(theme) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: pixelBodyFontFamily,
        fontSize: "20px",
        lineHeight: 1,
        letterSpacing: "1px",
        textTransform: "uppercase",
        color:
          theme.palette.mode === "dark"
            ? theme.palette.customColors.greyAccent
            : theme.palette.common.black,
        "&::before": {
          content: '""',
          width: "8px",
          height: "8px",
          background: isLive
            ? theme.palette.customColors.tealAccent
            : theme.palette.customColors.grey,
          animation: isLive ? `${blink} 1.6s steps(1, end) infinite` : "none",
        },
        "@media (prefers-reduced-motion: reduce)": {
          "&::before": { animation: "none" },
        },
      })}
    >
      {status}
    </Box>
  );
};

export default StatusLight;
