import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Splash from "./components/Splash";
import Footer from "./components/Footer";
import Providers from "./components/Providers";
import ResumeModal from "./components/ResumeModal";

const App = () => {
  return (
    <Providers>
      <Navbar />
      <Routes>
        <Route path="/" element={<Splash />} />
      </Routes>
      <Footer />
      <ResumeModal />
    </Providers>
  );
};

export default App;
