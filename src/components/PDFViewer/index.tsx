import { Document, Page, pdfjs } from "react-pdf";
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ClipLoader } from "react-spinners";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import { resume } from "../Documents";
// import "./pdf-viewer.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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

const PdfViewer = () => {
  return (
    <Document
      file={resume}
      onLoadError={(err) => console.log("Document load err", err)}
      className="pdf-viewer-wrapper"
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

export default PdfViewer;
