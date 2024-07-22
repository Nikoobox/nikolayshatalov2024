import { FC, useState } from "react";
import {
  HiDownload,
  HiOutlineDocumentDownload,
  HiOutlineDocumentText,
  HiOutlineExternalLink,
} from "react-icons/hi";
import Wave from "react-wavify";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import PageSection from "../PageSection";
import { BIO_DATA } from "../Data";
import { resume } from "../Documents";
import MyDialog from "../MyDialog";
import PDFViewer from "../PDFViewer";
import { styling } from "../../constants";
import ContactForm from "./ContactForm";

const profileImg = `${process.env.PUBLIC_URL}/img/profile.jpg`;

const StyledImageWrapperBox = styled(Box)({
  overflow: "hidden",
  borderRadius: "50%",
  width: "260px",
  img: {
    width: "100%",
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  border: "2px white solid",
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  borderRadius: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const StyledPDFViewerWrapper = styled(Box)(({ theme }) => ({
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
}));

const Contact: FC = () => {
  const theme = useTheme();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <>
      <Wave
        fill={theme.palette.primary.main}
        paused={false}
        style={{ display: "flex", background: theme.palette.common.white }}
        options={{
          height: 40,
          amplitude: 40,
          speed: 0.1,
          points: 3,
        }}
      />

      <PageSection>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h1" mb={5} color="common.white">
            Contact
          </Typography>
        </Box>

        <Box
          display="flex"
          width="90%"
          justifyContent="center"
          alignItems="center"
          gap={6}
          margin="auto"
        >
          <StyledImageWrapperBox>
            <img src={profileImg} alt="profile" />
          </StyledImageWrapperBox>
          <Box width="50%">
            <Box>
              <Typography color="common.white" variant="h2">
                {BIO_DATA.contactSection}
              </Typography>
            </Box>
            <Box>
              {/* on smaller screens pdf is downloaded on click */}
              {/* <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              download="Nikolay_Shatalov_frontend_developer_resume.pdf"
            >
              My Resume
              <HiDownload style={{ marginLeft: "6px" }} />
            </a> */}

              {/*  Larger screens functionality*/}
              <StyledButton onClick={() => setIsOpenModal(true)}>
                <Typography
                  color="common.white"
                  variant="h3"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  View My Resume
                  <Box
                    component={HiOutlineDocumentText}
                    sx={{
                      marginLeft: "6px",
                      color: "common.white",
                      "& svg": { width: 1 },
                    }}
                  />
                </Typography>
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </PageSection>

      {/* contact form */}
      <PageSection>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h1" mb={5} color="common.white">
            Say Hi!
          </Typography>
        </Box>
        <ContactForm />
      </PageSection>

      <MyDialog
        open={isOpenModal}
        onClose={setIsOpenModal}
        title="My Resume"
        actions={
          <Box display="flex" gap={3}>
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
                  sx={{
                    marginLeft: "6px",
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
                  sx={{
                    marginLeft: "6px",
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
    </>
  );
};
export default Contact;
