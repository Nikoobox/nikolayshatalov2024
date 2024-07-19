import {
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  ReactElement,
} from "react";

import { styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface Props extends DialogProps {
  title: string;
  onClose: Dispatch<SetStateAction<boolean>>;
  actions: ReactElement;
  minHeight?: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: `0 ${theme.spacing(2)}`,
  },
  "& .MuiDialogActions-root": {
    padding: `${theme.spacing(3)} ${theme.spacing(2.5)}`,
  },
  "& .MuiPaper-root": {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
}));

const MyDialog: FC<PropsWithChildren<Props>> = ({
  title,
  onClose,
  children,
  open,
  actions,
  fullScreen,
  minHeight,
  maxWidth,
}) => {
  return (
    <StyledDialog
      onClose={() => onClose(false)}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullScreen={fullScreen}
      maxWidth={maxWidth || "md"}
      fullWidth={true}
      PaperProps={{
        sx: {
          minHeight: minHeight || "95vh",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => onClose(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.customColors.grey,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </StyledDialog>
  );
};

export default MyDialog;
