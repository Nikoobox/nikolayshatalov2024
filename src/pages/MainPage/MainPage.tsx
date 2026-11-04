import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

import { Box } from "@mui/material";

import Landing from "../../components/Landing";
import Skills from "../../components/Skills";
import ProjectCards from "../../components/ProjectCards";
import Contact from "../../components/Contact";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import SectionStars from "../../components/SectionStars";

const SCROLL_AFTER_NAVIGATE_MS = 100;

const MainPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = (location.state as { scrollTo?: string } | null)
    ?.scrollTo;

  useEffect(() => {
    if (!destination) return;
    const timer = window.setTimeout(() => {
      scroller.scrollTo(destination, { smooth: true, duration: 1000 });
      navigate(location.pathname, { replace: true, state: null });
    }, SCROLL_AFTER_NAVIGATE_MS);
    return () => window.clearTimeout(timer);
  }, [destination, location.pathname, navigate]);

  return (
    <Box>
      <Landing />
      <Box mt="100vh" position="relative">
        <SectionStars />
        <Skills />
        <ProjectCards />
        <PageSectionWrapper bgColor="transparent">
          <Contact />
        </PageSectionWrapper>
      </Box>
    </Box>
  );
};
export default MainPage;
