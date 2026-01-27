import { FC, PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { PostHogProvider } from "posthog-js/react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { useThemeContext } from "../../theme/ThemeContextProvider";

// Vite: use import.meta.env (and env vars must be prefixed with VITE_)
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined,
};

const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined}
      options={options}
    >
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
    </PostHogProvider>
  );
};

export default AppProviders;
