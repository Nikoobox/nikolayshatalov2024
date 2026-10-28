import { useState, FC } from "react";
import type { ComponentType } from "react";
import { Link as LinkScroll, animateScroll as scroll } from "react-scroll";
import type { LinkProps } from "react-scroll";
import { motion } from "framer-motion";

import {
  AppBar,
  useScrollTrigger,
  Slide,
  Box,
  Drawer,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { useTheme, Theme } from "@mui/material/styles";

import NightModeSwitch from "../NightModeSwitch";
import SpaceMusic, { PLAYER_WIDTH } from "../SpaceMusic";
import { pixelBorder } from "../UI";
import { pixelBodyFontFamily, pixelFontFamily } from "../../theme/variables";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { navItems } from "./NavItems";
import { resume } from "../Documents";
import { useNavigate } from "react-router-dom";

interface HideOnScrollProps {
  children: React.ReactElement;
}
const HideOnScroll = ({ children }: HideOnScrollProps) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const commonNavItemStyles = (theme: Theme): object => ({
  position: "relative",
  cursor: "pointer",
  padding: "12px 4px",
  "& .MuiTypography-root": {
    position: "relative",
    fontFamily: pixelFontFamily,
    fontSize: "14px",
    lineHeight: 1.6,
    textTransform: "uppercase",
  },
  "& .MuiTypography-root::before": {
    content: '""',
    position: "absolute",
    left: "-16px",
    top: "50%",
    width: "8px",
    height: "14px",
    transform: "translateY(-50%)",
    background: theme.palette.customColors.tealAccent,
    clipPath:
      "polygon(0 0, 25% 0, 25% 7%, 50% 7%, 50% 21%, 75% 21%, 75% 36%, 100% 36%, 100% 64%, 75% 64%, 75% 79%, 50% 79%, 50% 93%, 25% 93%, 25% 100%, 0 100%)",
    visibility: "hidden",
  },
  "&:hover .MuiTypography-root::before": {
    visibility: "visible",
  },
});

const StyledDrawerClose = styled("button")(({ theme }) => ({
  alignSelf: "flex-start",
  width: 44,
  height: 44,
  margin: (theme as Theme).spacing(3, 2.5),
  padding: 0,
  border: 0,
  cursor: "pointer",
  fontFamily: pixelFontFamily,
  fontSize: "14px",
  lineHeight: 1,
  color: (theme as Theme).palette.common.white,
  background: "transparent",
  boxShadow: pixelBorder((theme as Theme).palette.common.white),
  "&:hover": {
    background: (theme as Theme).palette.customColors.tealAccent,
    color: (theme as Theme).palette.customColors.charcoalBlack,
  },
}));

const StyledToolbar = styled(Toolbar)({
  paddingTop: "16px",
});

const ScrollLink = LinkScroll as unknown as ComponentType<LinkProps>;

const StyledNavItemLink = styled(ScrollLink)<LinkProps>(({ theme }) => ({
  ...commonNavItemStyles(theme as Theme),
}));

const StyledResumeBox = styled(Box)(({ theme }) => ({
  ...commonNavItemStyles(theme as Theme),
}));

const StyledDrawerItemLink = styled(ScrollLink)<LinkProps>(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  "&:hover": {
    transition: "all 0.2s ease",
    backgroundColor: theme.palette.common.black,
    cursor: "pointer",
  },
}));

const StyledATagWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "auto",
  marginBottom: theme.spacing(5),
  "& a": {
    padding: theme.spacing(1.5),
    textDecoration: "none",
    color: theme.palette.common.greyAccent,
    "& :hover": {
      color: theme.palette.common.white,
    },
  },
  "& .MuiTypography-root": {
    fontFamily: pixelBodyFontFamily,
    fontSize: "24px",
    borderBottom: `1px ${theme.palette.customColors.greyAccent} solid`,
    "& :hover": {
      borderBottom: `1px ${theme.palette.common.white} solid`,
    },
  },
}));

const Navbar: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // header hidden: the pinned music player shrinks to stay out of the way
  const isHeaderHidden = useScrollTrigger();

  const themeContext = useThemeContext();
  const { toggleResumeModal } = themeContext;

  const drawer = (
    <Box height="100%" display="flex" flexDirection="column">
      <StyledDrawerClose
        type="button"
        aria-label="Close menu"
        onClick={handleDrawerToggle}
      >
        X
      </StyledDrawerClose>

      <Box mt={8}>
        {navItems.map(({ id, navItemName, destination }) => (
          <StyledDrawerItemLink
            key={id}
            to={destination}
            smooth={true}
            duration={1000}
            onClick={handleDrawerToggle}
          >
            <Typography
              color="common.white"
              sx={{
                fontFamily: pixelFontFamily,
                fontSize: "24px",
                lineHeight: 1.6,
                textTransform: "uppercase",
              }}
            >
              {navItemName}
            </Typography>
          </StyledDrawerItemLink>
        ))}
      </Box>

      <StyledATagWrapper>
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
        <a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          download="Nikolay Shatalov Senior Software Engineer.pdf"
          onClick={handleDrawerToggle}
        >
          <Typography variant="h3" color="customColors.greyAccent">
            Resume
          </Typography>
        </a>
      </StyledATagWrapper>
    </Box>
  );

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    scroll.scrollToTop();
  };

  // Handler for nav item clicks
  const handleNavItemClick = (destination: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: destination } });
    } else {
      // Scroll to section as usual
      scroll.scrollTo(+destination);
    }
  };

  return (
    <>
      <HideOnScroll>
        <AppBar component="nav" elevation={0} color="transparent">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          >
            <Container maxWidth="lg">
              <StyledToolbar disableGutters>
                <Box
                  component="button"
                  type="button"
                  aria-label="Open menu"
                  onClick={handleDrawerToggle}
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    mr: 2,
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    color: theme.palette.commonCustom.front,
                  }}
                >
                  {/* pixel hamburger: three chunky bars */}
                  <svg
                    width="28"
                    height="24"
                    viewBox="0 0 7 6"
                    fill="currentColor"
                    shapeRendering="crispEdges"
                    aria-hidden="true"
                  >
                    <rect x="0" y="0" width="7" height="1" />
                    <rect x="0" y="2.5" width="5" height="1" />
                    <rect x="0" y="5" width="7" height="1" />
                  </svg>
                </Box>
                <Box
                  component="button"
                  type="button"
                  aria-label="Nikolay Shatalov — back to top"
                  width="64px"
                  height="64px"
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    // initials tucked into the bottom-right corner
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    padding: "6px 3px 6px 6px",
                    border: 0,
                    cursor: "pointer",
                    fontFamily: pixelFontFamily,
                    fontSize: "20px",
                    lineHeight: 1,
                    color: theme.palette.common.white,
                    background:
                      theme.palette.mode === "dark"
                        ? theme.palette.customColors.charcoalBlack
                        : theme.palette.common.black,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? `${pixelBorder(theme.palette.common.white)}, 8px 8px 0 0 #000`
                        : `${pixelBorder(theme.palette.common.black)}, 8px 8px 0 0 ${theme.palette.customColors.greyAccent}`,
                  }}
                  onClick={handleLogoClick}
                >
                  NS
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    marginLeft: "auto",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      gap: 3,
                    }}
                  >
                    {navItems.map(({ id, navItemName, destination }) => (
                      <StyledNavItemLink
                        key={id}
                        to={destination}
                        smooth={true}
                        duration={1000}
                        onClick={() => handleNavItemClick(destination)}
                      >
                        <Typography variant="h2">{navItemName}</Typography>
                      </StyledNavItemLink>
                    ))}
                    <StyledResumeBox onClick={toggleResumeModal}>
                      <Typography variant="h2">Resume</Typography>
                    </StyledResumeBox>
                  </Box>
                  <NightModeSwitch />
                  {/* holds the slot for the music player, which stays pinned below */}
                  <Box width={PLAYER_WIDTH} height="48px" flexShrink={0} />
                </Box>
              </StyledToolbar>
            </Container>
          </motion.div>
        </AppBar>
      </HideOnScroll>

      {/* music player lives outside HideOnScroll so it stays visible while scrolling */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar + 1,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
        >
          <Container maxWidth="lg">
            <StyledToolbar disableGutters sx={{ justifyContent: "flex-end" }}>
              {/* row as tall as the logo (desktop) or hamburger (mobile) so it lines up with the switch */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: { xs: 48, sm: 64 },
                  pointerEvents: "auto",
                  transform: isHeaderHidden ? "scale(0.75)" : "none",
                  transformOrigin: "right center",
                  transition: "transform 0.2s ease",
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                  },
                }}
              >
                <SpaceMusic />
              </Box>
            </StyledToolbar>
          </Container>
        </motion.div>
      </Box>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
          PaperProps={{
            sx: {
              boxSizing: "border-box",
              width: "100%",
              backgroundColor: theme.palette.customColors.charcoalBlack,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

export default Navbar;
