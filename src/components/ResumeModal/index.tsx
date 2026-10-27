import { FC, useState } from "react";

import { Box, Skeleton } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";

import { resume, resumePreview } from "../Documents";
import MyDialog from "../MyDialog";
import { PixelArrow, pixelBorder } from "../UI";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { pixelFontFamily } from "../../theme/variables";

const StyledResumePreviewWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 0",
  "& img": {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    // resume page in a thin pixel frame
    boxShadow: pixelBorder(
      theme.palette.mode === "dark"
        ? theme.palette.customColors.greyAccent
        : theme.palette.common.black,
      2,
    ),
    transition: "opacity 0.3s ease",
  },
}));

const buttonBase = (theme: Theme) => {
  const frame =
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.common.black;
  return {
    frame,
    styles: {
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing(1.5),
      padding: "14px 20px",
      textDecoration: "none",
      fontFamily: pixelFontFamily,
      fontSize: "12px",
      lineHeight: 1,
      cursor: "pointer",
    },
  };
};

// solid teal button that presses into its shadow (like "Say hi")
const StyledPrimaryLink = styled("a")(({ theme }) => {
  const { frame, styles } = buttonBase(theme);
  const shadow =
    theme.palette.mode === "dark" ? "#000" : theme.palette.common.black;
  return {
    ...styles,
    background: theme.palette.customColors.tealAccent,
    color:
      theme.palette.mode === "dark"
        ? theme.palette.customColors.charcoalBlack
        : theme.palette.common.black,
    boxShadow: `${pixelBorder(frame)}, 6px 6px 0 4px ${shadow}`,
    "&:hover": {
      transform: "translate(2px, 2px)",
      boxShadow: `${pixelBorder(frame)}, 2px 2px 0 4px ${shadow}`,
    },
    "&:active": {
      transform: "translate(6px, 6px)",
      boxShadow: pixelBorder(frame),
    },
  };
});

// outlined button that fills teal on hover (like "View details")
const StyledSecondaryLink = styled("a")(({ theme }) => {
  const { frame, styles } = buttonBase(theme);
  return {
    ...styles,
    color: frame,
    boxShadow: pixelBorder(frame),
    "&:hover": {
      background: theme.palette.customColors.tealAccent,
      color:
        theme.palette.mode === "dark"
          ? theme.palette.customColors.charcoalBlack
          : theme.palette.common.black,
    },
  };
});

const ResumeModal: FC = () => {
  const { isResumeModalOpen, toggleResumeModal } = useThemeContext();
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);

  return (
    <MyDialog
      open={isResumeModalOpen}
      onClose={toggleResumeModal}
      title="My Resume"
      actions={
        <>
          <StyledPrimaryLink
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            download="Nikolay Shatalov Senior Software Engineer.pdf"
          >
            <PixelArrow direction="down" />
            DOWNLOAD
          </StyledPrimaryLink>
          <StyledSecondaryLink
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PixelArrow />
            VIEW IN BROWSER
          </StyledSecondaryLink>
        </>
      }
    >
      <StyledResumePreviewWrapper>
        {!isPreviewLoaded && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: "absolute",
              height: "100%",
              aspectRatio: "8.5 / 11",
              maxWidth: "100%",
            }}
          />
        )}
        <img
          // If the image is already cached, `onLoad` can fire before React
          // attaches the handler — catch that via the ref's `complete` flag.
          ref={(node) => {
            if (node?.complete) setIsPreviewLoaded(true);
          }}
          src={resumePreview}
          alt="Nikolay Shatalov, Senior Software Engineer resume"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsPreviewLoaded(true)}
          style={{ opacity: isPreviewLoaded ? 1 : 0 }}
        />
      </StyledResumePreviewWrapper>
    </MyDialog>
  );
};

export default ResumeModal;
