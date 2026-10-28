import { FC } from "react";

import { Tooltip, TooltipProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { pixelFontFamily } from "../../theme/variables";

const PixelTooltip: FC<TooltipProps> = (props) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Tooltip
      placement="bottom"
      enterDelay={300}
      {...props}
      slotProps={{
        tooltip: {
          sx: {
            padding: "8px 10px",
            borderRadius: 0,
            fontFamily: pixelFontFamily,
            fontSize: "10px",
            lineHeight: 1,
            fontWeight: 400,
            color: isDarkMode
              ? theme.palette.customColors.charcoalBlack
              : theme.palette.common.white,
            background: isDarkMode
              ? theme.palette.common.white
              : theme.palette.common.black,
          },
        },
      }}
    />
  );
};

export default PixelTooltip;
