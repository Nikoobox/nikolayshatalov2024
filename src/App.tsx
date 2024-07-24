import { Route, Routes, BrowserRouter } from "react-router-dom";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

import { ThemeProvider } from "@mui/material/styles";
import { useThemeContext } from "./theme/ThemeContextProvider";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "./components/Navbar";
import Splash from "./components/Splash";
import Footer from "./components/Footer";

const App = () => {
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
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Splash />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
