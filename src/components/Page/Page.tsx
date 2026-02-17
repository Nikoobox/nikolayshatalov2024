import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery, Container } from "@mui/material";

const Page = ({
  children,
  customBackground,
}: {
  children: React.ReactNode;
  customBackground?: React.ReactNode;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const offset = isMobile ? 256 : 200;
  const calculatedMinHeight = `calc(100vh - ${offset}px)`;

  // original default bg: theme.palette.backgroundCustom.secondary
  return (
    <Box
      minHeight={calculatedMinHeight}
      sx={{
        pt: 12,
      }}
    >
      {customBackground}
      <Container maxWidth="lg">
        <Box mb={20}>{children}</Box>
      </Container>
    </Box>
  );
};

export default Page;
