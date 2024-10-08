import { FC } from "react";
import {
  HiOutlineDocumentDownload,
  HiOutlineExternalLink,
} from "react-icons/hi";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { resume } from "../Documents";
import MyDialog from "../MyDialog";
import PDFViewer from "../PDFViewer";
import { styling } from "../../constants";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const StyledPDFViewerWrapper = styled(Box)({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  padding: "2px 0",
  "& .react-pdf__Page__canvas": {
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "4px",
    boxShadow: styling.SHADOW,
  },
  "& .react-pdf__Page": {
    height: "100%",
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
            download="Nikolay_Shatalov_frontend_developer_resume.pdf"
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
      <StyledPDFViewerWrapper>
        <PDFViewer fileToView={resume} />
      </StyledPDFViewerWrapper>
    </MyDialog>
  );
};

export default ResumeModal;
