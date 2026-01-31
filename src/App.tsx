import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./components/Providers";
import ResumeModal from "./components/ResumeModal";
import { MainPage, ProjectPage } from "./pages";

const App = () => {
  return (
    <Providers>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
      </Routes>
      <Footer />
      <ResumeModal />
    </Providers>
  );
};

export default App;
