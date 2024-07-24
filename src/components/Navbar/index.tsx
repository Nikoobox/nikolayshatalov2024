import { useState, FC } from "react";
import { Link as LinkScroll, animateScroll as scroll } from "react-scroll";

import {
  AppBar,
  useScrollTrigger,
  Slide,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { styled } from "@mui/system";

import nsLogo from "../../images/logo.png";
// import NightModeSwitch from "../NightModeSwitch";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { navItems } from "./NavItems";

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

const drawerWidth = 240;

const StyledToolbar = styled(Toolbar)({
  paddingTop: "16px",
});

const StyledNavItemLink = styled(LinkScroll)(({ theme }) => ({
  cursor: "pointer",
  "& :hover": {
    transition: "all 0.3s ease",
    color: theme.palette.customColors.tealAccent,
  },
}));

const AppBarWithDrawer: FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDarkMode } = useThemeContext();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map(({ id, navItemName, destination }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={navItemName} />
            </ListItemButton>
          </ListItem>
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
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
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
                    <Typography
                      color={`${isDarkMode ? "common.black" : "common.white"}`}
                      variant="h2"
                    >
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
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
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
