import { useCallback, useState, SyntheticEvent } from "react";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import { DATA_HELPERS } from "../../helpers";

const { megabytesToBytes } = DATA_HELPERS;

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& .document-icon": {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: theme.palette.customColors.greyAccent,
  },
}));

const StyledDiv = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: `${theme.spacing(5)} ${theme.spacing(3)}`,
  border: `2px solid ${theme.palette.customColors.blueDark}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.customColors.blueDark,
  outline: "none",
  transition: "border .2s ease",
  //   "&.dropzone--focused": {
  //     borderColor: theme.palette.customColors.greenAccent,
  //   },
  "&.dropzone--accept": {
    borderColor: theme.palette.customColors.greenAccent,
  },
  "&.dropzone--reject": {
    borderColor: theme.palette.customColors.redAccent,
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
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: megabytesToBytes(5),
    maxFiles: 1,
  });

  const dropzoneClass = classNames({
    "dropzone--focused": isFocused,
    "dropzone--accept": isDragAccept,
    "dropzone--reject": isDragReject,
  });

  const clearFile = (e: SyntheticEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setFile(null);
  };

  const dropZoneMessage = isDragActive ? (
    isDragReject ? (
      <Typography color="customColors.redAccent">
        File type not accepted or file is too large
      </Typography>
    ) : (
      <Typography color="customColors.greenAccent">
        Drop the files here ..
      </Typography>
    )
  ) : (
    <Typography color="customColors.grey">
      Drag 'n' drop your file here, or click to select files
    </Typography>
  );

  return (
    <div className="container">
      <StyledDiv {...getRootProps({ className: dropzoneClass })}>
        <input {...getInputProps()} />

        {!file && dropZoneMessage}

        {file && (
          <StyledBox>
            <HiOutlineDocumentText className="document-icon" />
            <Typography color="customColors.greyAccent" ml={1} mr={2}>
              {file.name}
            </Typography>

            <IconButton onClick={clearFile}>
              <IoCloseOutline color="white" style={{ fontSize: "28px" }} />
            </IconButton>
          </StyledBox>
        )}
      </StyledDiv>
    </div>
  );
};

export default MyDropzone;
