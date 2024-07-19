import { Route, Routes, BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { useThemeContext } from "./theme/ThemeContextProvider";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import "./App.css";
import Navbar from "./components/Navbar";
import Splash from "./components/Splash";

const App = () => {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Container maxWidth="lg">
          <Navbar />
          <Routes>
            <Route path="/" element={<Splash />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
