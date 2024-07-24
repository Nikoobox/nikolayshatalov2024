import { FC, PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { useThemeContext } from "../../theme/ThemeContextProvider";

const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <CssBaseline />
        <BrowserRouter>{children}</BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
