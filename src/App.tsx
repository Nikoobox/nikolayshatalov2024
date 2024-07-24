import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Splash from "./components/Splash";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

const App = () => {
  return (
    <Providers>
      <Navbar />
      <Routes>
        <Route path="/" element={<Splash />} />
      </Routes>
      <Footer />
    </Providers>
  );
};

export default App;
