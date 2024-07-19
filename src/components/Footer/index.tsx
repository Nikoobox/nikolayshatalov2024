import { FC } from "react";

import { Box, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { darken } from "@mui/system";

const getYear = () => new Date().getFullYear();

const Footer: FC = () => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      position="absolute"
      left={0}
      //   flexDirection="column"
      //   alignItems="center"
      justifyContent="space-between"
      width="100%"
      sx={{ background: darken(theme.palette.primary.main, 0.1) }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          //   sx={{ background: "yellow" }}
          py={5}
        >
          <Box
            display="flex"
            gap={3}
            //   flexDirection="column"
            //   alignItems="center"
            // justifyContent="space-between"
            sx={{ a: { textDecoration: "none" } }}
          >
            <a
              href="https://www.linkedin.com/in/nikolay-shatalov/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography variant="h3" color="common.white">
                LinkedIn
              </Typography>
            </a>

            <a
              href="https://github.com/Nikoobox"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography variant="h3" color="common.white">
                Github
              </Typography>
            </a>

            <a href="mailto:nikoobox@gmail.com">
              <Typography variant="h3" color="common.white">
                Email
              </Typography>
            </a>
          </Box>
          <Box>
            <Typography variant="h3" color="common.white">
              © {getYear()} Nikolay Shatalov
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default Footer;
