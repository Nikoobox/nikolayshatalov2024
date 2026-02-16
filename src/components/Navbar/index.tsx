import { useState, FC } from "react";
import type { ComponentType } from "react";
import { Link as LinkScroll, animateScroll as scroll } from "react-scroll";
import type { LinkProps } from "react-scroll";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { motion } from "framer-motion";

import {
  AppBar,
  useScrollTrigger,
  Slide,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { useTheme, Theme } from "@mui/material/styles";

import nsLogo from "../../images/logo.png";
import NightModeSwitch from "../NightModeSwitch";
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
  "& ::after": {
    top: "20px",
    position: "absolute",
    content: '""',
    display: "block",
    width: "0",
    height: "8px",
    background: theme.palette.customColors.tealAccent,
    opacity: 0.75,
    transition: "width 0.4s",
    zIndex: -1,
  },
  "& :hover::after": {
    position: "absolute",
    left: "0",
    width: "80%",
    transition: "width 0.3s",
    zIndex: -1,
  },
});

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

  const themeContext = useThemeContext();
  const { toggleResumeModal } = themeContext;

  const drawer = (
    <Box height="100%" display="flex" flexDirection="column">
      <IconButton
        aria-label="menu icon"
        sx={{
          color: theme.palette.common.white,
          fontSize: theme.spacing(7),
          margin: "8px 0",
          justifySelf: "flex-start",
          alignSelf: "start",
        }}
        onClick={handleDrawerToggle}
      >
        <IoCloseOutline />
      </IconButton>

      <Box mt={8}>
        {navItems.map(({ id, navItemName, destination }) => (
          <StyledDrawerItemLink
            key={id}
            to={destination}
            smooth={true}
            duration={1000}
            onClick={handleDrawerToggle}
          >
            <Typography variant="h1" color="common.white">
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
          download="nikolay_shatalov_frontend_developer_resume.pdf"
          onClick={handleDrawerToggle}
        >
          <Typography variant="h3" color="customColors.greyAccent">
            Resume
          </Typography>
        </a>
      </StyledATagWrapper>
    </Box>
  );

  const handleLogoClick = () => scroll.scrollToTop();

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
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    mr: 2,
                    display: { sm: "none" },
                    color: theme.palette.commonCustom.front,
                    fontSize: theme.spacing(5),
                  }}
                >
                  <HiMenuAlt2 />
                </IconButton>
                <Box
                  width="80px"
                  height="80px"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    img: { width: "100%", height: "100%" },
                    border: "1px white solid",
                    "& :hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={handleLogoClick}
                >
                  <img src={nsLogo} alt="ns-logo" />
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
                </Box>
              </StyledToolbar>
            </Container>
          </motion.div>
        </AppBar>
      </HideOnScroll>

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
