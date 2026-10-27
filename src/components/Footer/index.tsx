import { FC } from "react";

import { Box, Typography, Container } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { PixelZigzag } from "../UI";
import { pixelBodyFontFamily } from "../../theme/variables";

const getYear = () => "2019 - " + new Date().getFullYear();

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nikolay-shatalov/" },
  { label: "Github", href: "https://github.com/Nikoobox" },
  { label: "Email", href: "mailto:nikoobox@gmail.com" },
];

const Footer: FC = () => {
  const theme = useTheme();
  const borderColor = alpha(theme.palette.customColors.greyAccent, 0.4);
  const textStyles = {
    fontFamily: pixelBodyFontFamily,
    fontSize: "24px",
    letterSpacing: "0.5px",
  };

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      {/* a step brighter than the page's near-black so the footer reads as its own band */}
      <Box sx={{ background: theme.palette.customColors.deepSlate }}>
        {/* pixel zigzag border along the top of the footer */}
        <PixelZigzag color={borderColor} />
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
              gap={4}
              sx={{
                a: {
                  ...textStyles,
                  color: theme.palette.customColors.greyAccent,
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.customColors.tealAccent,
                  },
                },
              }}
            >
              {LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("http") && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  {label}
                </a>
              ))}
            </Box>

            <Typography sx={{ ...textStyles, color: "common.white" }}>
              © {getYear()} Nikolay Shatalov
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default Footer;
