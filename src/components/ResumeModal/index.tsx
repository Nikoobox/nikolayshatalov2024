import { FC } from "react";
import {
  HiOutlineDocumentDownload,
  HiOutlineExternalLink,
} from "react-icons/hi";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { resume, resumePreview } from "../Documents";
import MyDialog from "../MyDialog";
import { styling } from "../../constants";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const StyledResumePreviewWrapper = styled(Box)({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  padding: "2px 0",
  "& img": {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    borderRadius: "4px",
    boxShadow: styling.SHADOW,
  },
});

const ResumeModal: FC = () => {
  const { isResumeModalOpen, toggleResumeModal, isDarkMode } =
    useThemeContext();

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
        <img
          src={resumePreview}
          alt="Nikolay Shatalov — Senior Frontend Engineer resume"
        />
      </StyledResumePreviewWrapper>
    </MyDialog>
  );
};

export default ResumeModal;
