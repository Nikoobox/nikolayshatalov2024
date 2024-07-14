import { useState, FC } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import Container from "@mui/material/Container";

import { themeConstants } from "../../constants";
import nsLogo from "../../images/logo.png";
// import NightModeSwitch from "../NightModeSwitch";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const { DARK } = themeConstants;

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

const StyledToolbar = styled(Toolbar)({
  padding: "16px",
});

const AppBarWithDrawer: FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  console.log('theme',theme);
  console.log('isDarkMode',isDarkMode);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar component="nav" elevation={0} color="transparent">
        <Container maxWidth="lg">
          <StyledToolbar>
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
              }}
            >
              <img src={nsLogo} alt="ns-logo" />
            </Box>

            {/* <NightModeSwitch /> */}
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                marginLeft: "auto",
              }}
            >
              {navItems.map((item, idx) => (
                <Button disableRipple disableElevation key={idx}>
                  <Typography
                    color={`${isDarkMode ? "common.black":"common.white"  }`}
                  >
                    {item}
                  </Typography>
                </Button>
              ))}
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
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
