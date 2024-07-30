import { FC } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileToView: string;
}

const PDFViewer: FC<PDFViewerProps> = ({ fileToView }) => {
  const theme = useTheme();
  console.log("process.env.PUBLIC_URL", process.env.PUBLIC_URL);
  const WrappedLoader = () => (
    <div
      style={{
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: theme.palette.customColors.blueDark }} />
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
