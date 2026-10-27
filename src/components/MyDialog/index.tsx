import {
  FC,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  ReactElement,
} from "react";

import { styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { Box, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { pixelBorder } from "../UI";
import { pixelFontFamily } from "../../theme/variables";

interface Props extends DialogProps {
  title: string;
  onClose: Dispatch<SetStateAction<boolean>>;
  actions: ReactElement;
  minHeight?: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;

  return {
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(10, 15, 20, 0.8)",
    },
    "& .MuiPaper-root": {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      borderRadius: 0,
      overflow: "visible",
      background: isDarkMode
        ? theme.palette.customColors.charcoalBlack
        : theme.palette.common.white,
      boxShadow: `${pixelBorder(frame)}, 12px 12px 0 0 rgba(0, 0, 0, 0.6)`,
    },
    "& .MuiDialogTitle-root": {
      padding: theme.spacing(3, 8, 2, 3),
      fontFamily: pixelFontFamily,
      fontSize: "14px",
      lineHeight: 1.6,
      textTransform: "uppercase",
    },
    "& .MuiDialogContent-root": {
      padding: `0 ${theme.spacing(3)}`,
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(3),
      gap: theme.spacing(3),
      flexWrap: "wrap",
    },
  };
});

const StyledCloseButton = styled("button")(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2.5),
  top: theme.spacing(2.5),
  width: 28,
  height: 28,
  padding: 0,
  border: 0,
  cursor: "pointer",
  fontFamily: pixelFontFamily,
  fontSize: "12px",
  lineHeight: 1,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.common.black,
  background: "transparent",
  boxShadow: pixelBorder(theme.palette.customColors.greyAccent, 2),
  "&:hover": {
    background: theme.palette.customColors.tealAccent,
    color: theme.palette.customColors.charcoalBlack,
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
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullScreen={fullScreen}
      maxWidth={maxWidth || "md"}
      fullWidth={true}
      PaperProps={{ sx: { minHeight: minHeight || "92vh" } }}
    >
      <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
      <StyledCloseButton
        type="button"
        aria-label="close"
        onClick={() => onClose(false)}
      >
        X
      </StyledCloseButton>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Box display="flex" gap={3} flexWrap="wrap">
          {actions}
        </Box>
      </DialogActions>
    </StyledDialog>
  );
};

export default MyDialog;
