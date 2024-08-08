import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDiv = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: "2px",
  borderRadius: "2px",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  "&.dropzone--focused": {
    borderColor: "#2196f3",
  },
  "&.dropzone--accept": {
    borderColor: "#00e676",
  },
  "&.dropzone--reject": {
    borderColor: "#ff1744",
  },
}));

const MyDropzone = () => {
  const [file, setFile] = useState<File | null>(null);
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log("acceptedFiles: ", acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const dropzoneClass = classNames({
    "dropzone--focused": isFocused,
    "dropzone--accept": isDragAccept,
    "dropzone--reject": isDragReject,
  });

  console.log("file", file);

  console.log("file?.name", file?.name);

  return (
    <div className="container">
      <StyledDiv {...getRootProps({ className: dropzoneClass })}>
        <input {...getInputProps()} />

        {isDragActive ? (
          <Box>Drop the files here ...</Box>
        ) : (
          <Box>Drag 'n' drop some files here, or click to select files</Box>
        )}
      </StyledDiv>

      {file && (
        <Typography color="common.white" mt={2}>
          {file.name}
        </Typography>
      )}
    </div>
  );
};

export default MyDropzone;
