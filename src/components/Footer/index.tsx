import { FC } from "react";

import { Box, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const getYear = () => "2019 - " + new Date().getFullYear();

const Footer: FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.customColors.charcoalBlack,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          width="100%"
          py={6}
          pb={12}
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
              <Typography variant="h3" color="customColors.greyAccent">
                LinkedIn
              </Typography>
            </a>

            <a
              href="https://github.com/Nikoobox"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography variant="h3" color="customColors.greyAccent">
                Github
              </Typography>
            </a>

            <a href="mailto:nikoobox@gmail.com">
              <Typography variant="h3" color="customColors.greyAccent">
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
