import { FC } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFViewerProps {
  fileToView: string;
}

const PDFViewer: FC<PDFViewerProps> = ({ fileToView }) => {
  const theme = useTheme();

  const WrappedLoader = () => (
    <div
      style={{
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: theme.palette.customColors.tealAccent }} />
    </div>
  );
  return (
    <>
      <Document
        file={fileToView}
        onLoadError={(err) => console.log("Document load err", err)}
        loading={<WrappedLoader />}
      >
        <Page
          pageNumber={1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
    </>
  );
};

export default PDFViewer;
