import { FC, useState } from "react";
import {
  HiOutlineDocumentDownload,
  HiOutlineExternalLink,
} from "react-icons/hi";

import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { resume, resumePreview } from "../Documents";
import MyDialog from "../MyDialog";
import { styling } from "../../constants";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const StyledResumePreviewWrapper = styled(Box)({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2px 0",
  "& img": {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    borderRadius: "4px",
    boxShadow: styling.SHADOW,
    transition: "opacity 0.3s ease",
  },
});

const ResumeModal: FC = () => {
  const { isResumeModalOpen, toggleResumeModal, isDarkMode } =
    useThemeContext();
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);

  return (
    <MyDialog
      open={isResumeModalOpen}
      onClose={toggleResumeModal}
      title="My Resume"
      actions={
        <Box
          display="flex"
          gap={3}
          sx={{ "& a": isDarkMode ? { color: "white" } : {} }}
        >
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            download="nikolay_shatalov_frontend_developer_resume.pdf"
          >
            <Typography
              variant="h3"
              sx={{ display: "flex", alignItems: "center" }}
            >
              Download
              <Box
                component={HiOutlineDocumentDownload}
                ml="6px"
                sx={{
                  "& svg": { width: 1 },
                }}
              />
            </Typography>
          </a>

          <a href={resume} target="_blank" rel="noopener noreferrer">
            <Typography
              variant="h3"
              sx={{ display: "flex", alignItems: "center" }}
            >
              View in browser
              <Box
                component={HiOutlineExternalLink}
                ml="6px"
                sx={{
                  "& svg": { width: 1 },
                }}
              />
            </Typography>
          </a>
        </Box>
      }
    >
      <StyledResumePreviewWrapper>
        {!isPreviewLoaded && (
          <CircularProgress
            sx={{ color: (theme) => theme.palette.customColors.blueDark }}
          />
        )}
        <img
          // If the image is already cached, `onLoad` can fire before React
          // attaches the handler — catch that via the ref's `complete` flag.
          ref={(node) => {
            if (node?.complete) setIsPreviewLoaded(true);
          }}
          src={resumePreview}
          alt="Nikolay Shatalov — Senior Frontend Engineer resume"
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
