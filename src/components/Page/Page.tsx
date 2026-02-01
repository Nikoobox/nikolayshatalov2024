import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery, Container } from "@mui/material";

const Page = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const offset = isMobile ? 256 : 200;
  const calculatedMinHeight = `calc(100vh - ${offset}px)`;

  return (
    <Box
      minHeight={calculatedMinHeight}
      sx={{ background: theme.palette.backgroundCustom.primary, pt: 12 }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
};

export default Page;
