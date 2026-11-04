import { FC, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { useLocation } from "react-router-dom";
import { keyframes } from "@emotion/react";

import { Box, Container } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";

import {
  buttonShadowColor,
  PixelTooltip,
  PixelZigzag,
  pixelBorder,
} from "../UI";
import { pixelFontFamily } from "../../theme/variables";
import SecretsHint from "../SecretsHint";

const getYear = () => "2019 - " + new Date().getFullYear();

const LINKEDIN = [
  "##........",
  "##........",
  "..........",
  "##.##.##..",
  "##.######.",
  "##.##..##.",
  "##.##..##.",
  "##.##..##.",
];

const GITHUB = [
  ".#......#.",
  ".##....##.",
  ".########.",
  "##########",
  "##.####.##",
  "##########",
  ".########.",
  "#..#..#...",
  ".##.......",
];

const EMAIL = [
  "##########",
  "##......##",
  "#.#....#.#",
  "#..#..#..#",
  "#...##...#",
  "#........#",
  "##########",
];

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nikolay-shatalov/",
    icon: LINKEDIN,
  },
  { label: "Github", href: "https://github.com/Nikoobox", icon: GITHUB },
  { label: "Email", href: "mailto:nikoobox@gmail.com", icon: EMAIL },
];

const BOTTOM_THRESHOLD = 40;
const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"];

const scrollToTop = () => scroll.scrollToTop({ duration: 1200 });

const blink = keyframes`
  50% { opacity: 0; }
`;

const PixelIcon: FC<{ rows: string[] }> = ({ rows }) => (
  <svg
    width={rows[0].length * 3}
    height={rows.length * 3}
    viewBox={`0 0 ${rows[0].length} ${rows.length}`}
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    {rows.flatMap((row, y) =>
      [...row].map((cell, x) =>
        cell === "#" ? (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
        ) : null,
      ),
    )}
  </svg>
);

const StyledIconLink = styled("a")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const shadow = buttonShadowColor(theme);
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px",
    height: "56px",
    color: frame,
    background: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    boxShadow: `${pixelBorder(frame)}, 6px 6px 0 4px ${shadow}`,
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.customColors.tealAccent}`,
      outlineOffset: "6px",
    },
  };
});

const StyledStartButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: 0,
  cursor: "pointer",
  background: "transparent",
  fontFamily: pixelFontFamily,
  fontSize: "12px",
  color:
    theme.palette.mode === "dark"
      ? theme.palette.customColors.greyAccent
      : theme.palette.customColors.grey,
  "& .blink": {
    animation: `${blink} 1s steps(1, end) infinite`,
    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
  },
  "&:hover": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.common.white
        : theme.palette.common.black,
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.customColors.tealAccent}`,
  },
}));

const Footer: FC = () => {
  const theme = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat) return;
      const target = event.target as HTMLElement;
      if (TYPING_TAGS.includes(target.tagName) || target.isContentEditable) {
        return;
      }
      const { scrollHeight } = document.documentElement;
      const bottom = window.innerHeight + window.scrollY;
      if (bottom < scrollHeight - BOTTOM_THRESHOLD) return;
      event.preventDefault();
      scrollToTop();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isDarkMode = theme.palette.mode === "dark";
  const { charcoalBlack, deepSlate, greyAccent, greyLightest, grey } =
    theme.palette.customColors;
  const glow = isDarkMode ? deepSlate : theme.palette.common.white;
  const footerBackground = isDarkMode ? charcoalBlack : greyLightest;

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      {pathname === "/" && (
        <Container
          maxWidth="lg"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "calc(100% + 32px)",
            zIndex: 1,
          }}
        >
          <SecretsHint />
        </Container>
      )}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "100%",
          height: { xs: "120px", sm: "200px" },
          pointerEvents: "none",
          background: `linear-gradient(transparent, ${glow})`,
        }}
      />
      <Box
        sx={{
          overflow: "hidden",
          background: `linear-gradient(${glow} 0 4px, ${footerBackground} 4px)`,
        }}
      >
        <PixelZigzag
          color={isDarkMode ? alpha(greyAccent, 0.4) : greyAccent}
        />
      </Box>
      <Box sx={{ background: footerBackground }}>
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            pt={{ xs: 7, sm: 9 }}
            pb={{ xs: 14, sm: 12 }}
          >
            <StyledStartButton
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <svg
                className="blink"
                width="14"
                height="8"
                viewBox="0 0 7 4"
                fill="currentColor"
                shapeRendering="crispEdges"
                aria-hidden="true"
              >
                <rect x="3" y="0" width="1" height="1" />
                <rect x="2" y="1" width="3" height="1" />
                <rect x="1" y="2" width="5" height="1" />
                <rect x="0" y="3" width="7" height="1" />
              </svg>
              <Box
                component="span"
                sx={{ "@media (pointer: coarse)": { display: "none" } }}
              >
                PRESS ENTER
              </Box>
              <Box
                component="span"
                sx={{
                  display: "none",
                  "@media (pointer: coarse)": { display: "inline" },
                }}
              >
                BACK TO TOP
              </Box>
            </StyledStartButton>

            <Box display="flex" gap={4} mt={{ xs: 5, sm: 6 }}>
              {LINKS.map(({ label, href, icon }) => (
                <PixelTooltip key={label} title={label} placement="top">
                  <StyledIconLink
                    href={href}
                    aria-label={label}
                    {...(href.startsWith("http") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    <PixelIcon rows={icon} />
                  </StyledIconLink>
                </PixelTooltip>
              ))}
            </Box>

            <Box
              component="p"
              sx={{
                m: 0,
                mt: { xs: 5, sm: 6 },
                fontFamily: pixelFontFamily,
                fontSize: "10px",
                lineHeight: 1.6,
                color: isDarkMode ? greyAccent : grey,
              }}
            >
              © {getYear()} NIKOLAY SHATALOV
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default Footer;
