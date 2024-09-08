import { FC } from "react";
import { HiOutlineDocumentText, HiDownload } from "react-icons/hi";
import Wave from "react-wavify";
import { isMobile } from "react-device-detect";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import PageSection from "../PageSection";
import { BIO_DATA } from "../Data";
import { resume } from "../Documents";
import ContactForm from "./ContactForm";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const profileImg = `${process.env.PUBLIC_URL}/img/profile.jpg`;

const StyledContactInfoWrapper = styled(Box)(({ theme }) => ({
  gap: theme.spacing(6),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: theme.spacing(3),
  },
}));

const StyledImageWrapperBox = styled(Box)({
  overflow: "hidden",
  borderRadius: "50%",
  width: "260px",
  height: "260px",
  img: {
    width: "100%",
    height: "auto",
  },
});

const StyledButton = styled(Button)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const borderColor = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;

  return {
    border: `2px ${borderColor} solid`,
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
    borderRadius: theme.spacing(3),
    marginTop: theme.spacing(3),
    color: isDarkMode ? "white" : "inherit",
  };
});

const StyledDownloadLink = styled("a")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const color = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  return {
    color,
    border: `solid ${color} 3px`,
    borderRadius: theme.spacing(4),
    textDecoration: "none",
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
    display: "inline-flex",
    alignItems: "center",
    marginTop: theme.spacing(4),
  };
});

const threshold = 0.2;

const Contact: FC = () => {
  const theme = useTheme();
  const { toggleResumeModal, isDarkMode } = useThemeContext();

  const { ref: imgRef, inView: imgInView } = useInView({
    threshold,
  });
  const { ref: textRef, inView: textInView } = useInView({
    threshold,
  });
  const { ref: resumeRef, inView: resumeInView } = useInView({
    threshold,
  });
  const { ref: contactFormRef, inView: contactFormInView } = useInView({
    threshold,
  });

  return (
    <>
      <Wave
        id="wave-contact"
        fill={theme.palette.backgroundCustom.primary}
        paused={false}
        style={{
          display: "flex",
          background: theme.palette.backgroundCustom.secondary,
        }}
        options={{
          height: 40,
          amplitude: 40,
          speed: 0.1,
          points: 3,
        }}
      />

      <PageSection id="contact-destination">
        <Box display="flex" justifyContent="center" alignItems="center">
          <PageSection.PageSubheader>
            <Box mb={5}>Contact</Box>
          </PageSection.PageSubheader>
        </Box>

        <StyledContactInfoWrapper
          display="flex"
          width="90%"
          justifyContent="center"
          alignItems="center"
          margin="auto"
        >
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0 }}
            animate={imgInView && { opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <StyledImageWrapperBox>
              <img src={profileImg} alt="profile" />
            </StyledImageWrapperBox>
          </motion.div>
          <Box
            sx={{
              width: { sm: "100%", md: "50%" },
              display: { sm: "flex", md: "block" },
              flexDirection: "column",
              alignItems: { xs: "center", sm: "flex-start" },
              justifyContent: { xs: "center" },
              textAlign: { xs: "center", sm: "start" },
            }}
          >
            <motion.div
              ref={textRef}
              initial={{ y: 30, opacity: 0 }}
              animate={textInView && { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Typography variant="h2">{BIO_DATA.contactSection}</Typography>
            </motion.div>

            <motion.div
              ref={resumeRef}
              initial={{ y: 40, opacity: 0 }}
              animate={resumeInView && { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              {isMobile ? (
                <StyledDownloadLink
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Nikolay_Shatalov_frontend_developer_resume.pdf"
                >
                  <Typography
                    variant="h3"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Download My Resume
                    <Box
                      component={HiDownload}
                      ml="6px"
                      sx={{
                        "& svg": { width: 1 },
                      }}
                    />
                  </Typography>
                </StyledDownloadLink>
              ) : (
                <StyledButton onClick={toggleResumeModal}>
                  <Typography
                    variant="h3"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: isDarkMode ? {} : 500,
                    }}
                  >
                    View My Resume
                    <Box
                      component={HiOutlineDocumentText}
                      ml="6px"
                      sx={{
                        "& svg": { width: 1 },
                      }}
                    />
                  </Typography>
                </StyledButton>
              )}
            </motion.div>
          </Box>
        </StyledContactInfoWrapper>
      </PageSection>

      <PageSection>
        <motion.div
          ref={contactFormRef}
          initial={{ opacity: 0 }}
          animate={contactFormInView && { opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h1" mb={5}>
              Say Hi!
            </Typography>
          </Box>
          <ContactForm />
        </motion.div>
      </PageSection>
    </>
  );
};
export default Contact;
