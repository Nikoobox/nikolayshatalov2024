import { FC } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ClipLoader } from "react-spinners";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFViewerProps {
  fileToView: string;
}

const WrappedLoader = () => (
  <div
    style={{
      height: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <ClipLoader />
  </div>
);

const PDFViewer: FC<PDFViewerProps> = ({ fileToView }) => {
  return (
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
  );
};

export default PDFViewer;
