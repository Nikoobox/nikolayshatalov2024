import { FC, PropsWithChildren } from "react";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  bgColor?: string;
}

const PageSectionWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  bgColor,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ background: bgColor || theme.palette.common.white }}>
      {children}
    </Box>
  );
};
export default PageSectionWrapper;
