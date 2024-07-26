import { FC } from "react";
import Wave from "react-wavify";

import { Box, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const getYear = () => new Date().getFullYear();

const Footer: FC = () => {
  const theme = useTheme();
  return (
    <Box sx={{ background: theme.palette.customColors.blueDark }}>
      <Wave
        fill={theme.palette.customColors.blueDark}
        paused={false}
        style={{
          display: "flex",
          background: theme.palette.primary.main,
          height: theme.spacing(4),
        }}
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.1,
          points: 4,
        }}
      />
      <Container maxWidth="lg">
        <Box
          display="flex"
          width="100%"
          py={2}
          pb={5}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: { xs: "center" },
            gap: { xs: 4, sm: 0 },
          }}
        >
          <Box
            display="flex"
            gap={3}
            sx={{
              a: {
                textDecoration: "none",
                "& :hover": {
                  color: theme.palette.common.white,
                },
              },
            }}
          >
            <a
              href="https://www.linkedin.com/in/nikolay-shatalov/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography variant="h3" color="customColors.grey">
                LinkedIn
              </Typography>
            </a>

            <a
              href="https://github.com/Nikoobox"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography variant="h3" color="customColors.grey">
                Github
              </Typography>
            </a>

            <a href="mailto:nikoobox@gmail.com">
              <Typography variant="h3" color="customColors.grey">
                Email
              </Typography>
            </a>
          </Box>

          <Typography variant="h3" color="common.white">
            © {getYear()} Nikolay Shatalov
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
export default Footer;
