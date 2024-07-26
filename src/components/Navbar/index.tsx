import { useState, FC } from "react";
import { Link as LinkScroll, animateScroll as scroll } from "react-scroll";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

import {
  AppBar,
  useScrollTrigger,
  Slide,
  Box,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";

import nsLogo from "../../images/logo.png";
// import NightModeSwitch from "../NightModeSwitch";
// import { useThemeContext } from "../../theme/ThemeContextProvider";
import { navItems } from "./NavItems";
import { useScrollPosition } from "../../hooks";
import { getNavItemColor } from "./helpers";

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

const StyledToolbar = styled(Toolbar)({
  paddingTop: "16px",
});

const StyledNavItemLink = styled(LinkScroll)(({ theme }) => ({
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
    transition: "width 0.4s",
    zIndex: -1,
  },
  "& :hover::after": {
    position: "absolute",
    left: "0",
    width: "100%",
    transition: "width 0.3s",
    zIndex: -1,
  },
}));

const StyledDrawerItemLink = styled(LinkScroll)(({ theme }) => ({
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

const AppBarWithDrawer: FC = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollPosition, isPastTarget] = useScrollPosition();
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // const { isDarkMode } = useThemeContext();
  const navItemColor = getNavItemColor(scrollPosition, isPastTarget);

  const drawer = (
    <Box>
      <IconButton
        aria-label="menu icon"
        sx={{
          color: theme.palette.common.white,
          fontSize: theme.spacing(7),
          margin: "8px 0",
        }}
        onClick={handleDrawerToggle}
      >
        <IoCloseOutline />
      </IconButton>

      <List>
        {navItems.map(({ id, navItemName, destination }) => (
          <StyledDrawerItemLink
            key={id}
            to={destination}
            smooth={true}
            duration={1000}
            onClick={handleDrawerToggle}
          >
            <Typography variant="h2" color="common.white">
              {navItemName}
            </Typography>
          </StyledDrawerItemLink>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar component="nav" elevation={0} color="transparent">
          <Container maxWidth="lg">
            <StyledToolbar disableGutters>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  display: { sm: "none" },
                  color: navItemColor,
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
                onClick={scroll.scrollToTop}
              >
                <img src={nsLogo} alt="ns-logo" />
              </Box>

              {/* <NightModeSwitch /> */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  gap: 3,
                  marginLeft: "auto",
                }}
              >
                {navItems.map(({ id, navItemName, destination }) => (
                  <StyledNavItemLink
                    key={id}
                    to={destination}
                    smooth={true}
                    duration={1000}
                  >
                    <Typography variant="h2" color={navItemColor}>
                      {navItemName}
                    </Typography>
                  </StyledNavItemLink>
                ))}
              </Box>
            </StyledToolbar>
          </Container>
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
              backgroundColor: "black",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

export default AppBarWithDrawer;
