import { FC } from "react";
import { isMobile } from "react-device-detect";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Box, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import PageSection from "../PageSection";
import { BIO_DATA } from "../Data";
import { resume } from "../Documents";
import ContactForm from "./ContactForm";
import ProfilePhoto from "./ProfilePhoto";
import { PixelArrow, PixelDivider, PixelHeading, pixelBorder } from "../UI";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { pixelBodyFontFamily, pixelFontFamily } from "../../theme/variables";

const profileImg = "/img/profile.jpg";

const StyledContactInfoWrapper = styled(Box)(({ theme }) => ({
  gap: theme.spacing(8),
  [theme.breakpoints.down("md")]: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: theme.spacing(6),
  },
}));

const pixelButtonStyles = (theme: Theme) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const shadow = isDarkMode ? "#000" : theme.palette.common.black;

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(4),
    padding: "14px 20px",
    border: 0,
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: pixelFontFamily,
    fontSize: "12px",
    lineHeight: 1,
    background: theme.palette.customColors.tealAccent,
    color: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.black,
    boxShadow: `${pixelBorder(frame)}, 6px 6px 0 4px ${shadow}`,
    "& svg:not(.pixel-arrow)": { width: "18px", height: "18px" },
    "&:hover": {
      transform: "translate(2px, 2px)",
      boxShadow: `${pixelBorder(frame)}, 2px 2px 0 4px ${shadow}`,
    },
    "&:active": {
      transform: "translate(6px, 6px)",
      boxShadow: pixelBorder(frame),
    },
  };
};

const StyledResumeButton = styled("button")(({ theme }) =>
  pixelButtonStyles(theme),
);

const StyledDownloadLink = styled("a")(({ theme }) => pixelButtonStyles(theme));

const threshold = 0.2;

const Contact: FC = () => {
  const theme = useTheme();
  const { toggleResumeModal, isDarkMode } = useThemeContext();

  const { ref: imgRef, inView: imgInView } = useInView({
    threshold,
    triggerOnce: true,
  });
  const { ref: textRef, inView: textInView } = useInView({
    threshold,
    triggerOnce: true,
  });
  const { ref: resumeRef, inView: resumeInView } = useInView({
    threshold,
    triggerOnce: true,
  });
  const { ref: contactFormRef, inView: contactFormInView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return (
    <>
      {!isDarkMode && (
        <PixelDivider
          fill={theme.palette.backgroundCustom.primary}
          background={theme.palette.backgroundCustom.secondary}
        />
      )}

      <PageSection id="contact-destination">
        <Box mb={8} mt={15}>
          <PixelHeading>Contact</PixelHeading>
        </Box>

        <StyledContactInfoWrapper
          display="flex"
          width="90%"
          justifyContent="center"
          alignItems="flex-start"
          margin="auto"
        >
          <motion.div
            ref={imgRef}
            initial={{ y: 32, opacity: 0 }}
            animate={imgInView && { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ProfilePhoto src={profileImg} alt="Nikolay Shatalov" />
          </motion.div>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <motion.div
              ref={textRef}
              initial={{ y: 32, opacity: 0 }}
              animate={textInView && { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {BIO_DATA.contactSection.map((paragraph, i) => (
                <Typography
                  key={i}
                  paragraph
                  sx={{
                    fontFamily: pixelBodyFontFamily,
                    fontSize: { xs: "22px", md: "26px" },
                    lineHeight: 1.35,
                    letterSpacing: "0.5px",
                    color: isDarkMode
                      ? "customColors.greyAccent"
                      : "common.black",
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </motion.div>

            <motion.div
              ref={resumeRef}
              initial={{ y: 32, opacity: 0 }}
              animate={resumeInView && { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              {isMobile ? (
                <StyledDownloadLink
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Nikolay Shatalov Senior Software Engineer.pdf"
                >
                  <PixelArrow direction="down" />
                  DOWNLOAD RESUME
                </StyledDownloadLink>
              ) : (
                <StyledResumeButton type="button" onClick={toggleResumeModal}>
                  VIEW MY RESUME
                </StyledResumeButton>
              )}
            </motion.div>
          </Box>
        </StyledContactInfoWrapper>
      </PageSection>

      <PageSection>
        <motion.div
          ref={contactFormRef}
          initial={{ y: 32, opacity: 0 }}
          animate={contactFormInView && { y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box mb={8}>
            <PixelHeading>Say Hi!</PixelHeading>
          </Box>
          {/* extra room so the form doesn't crowd the footer */}
          <Box pb={25}>
            <ContactForm />
          </Box>
        </motion.div>
      </PageSection>
    </>
  );
};
export default Contact;
