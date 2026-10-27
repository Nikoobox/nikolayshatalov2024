import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { pixelBodyFontFamily, pixelFontFamily } from "@/theme/variables";
import { LABEL_MIN_WIDTH } from "./configs";

interface ProjectInfoRowProps {
  label: string;
  value: React.ReactNode;
}

const ProjectInfoRow = ({ label, value }: ProjectInfoRowProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      display="flex"
      gap={{ xs: 1.5, sm: 3 }}
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
    >
      <Box minWidth={LABEL_MIN_WIDTH} pt={{ sm: "6px" }}>
        <Typography
          sx={{
            fontFamily: pixelFontFamily,
            fontSize: "10px",
            lineHeight: 1.6,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: isDarkMode
              ? theme.palette.customColors.greyAccent
              : theme.palette.customColors.grey,
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          whiteSpace: "pre-line",
          fontFamily: pixelBodyFontFamily,
          fontSize: { xs: "20px", sm: "22px" },
          lineHeight: 1.35,
          letterSpacing: "0.5px",
          color: isDarkMode
            ? theme.palette.customColors.greyLightest
            : theme.palette.common.black,
        }}
      >
        {value}
      </Box>
    </Box>
  );
};

export default ProjectInfoRow;
