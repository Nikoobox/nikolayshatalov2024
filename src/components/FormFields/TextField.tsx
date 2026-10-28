import { FC } from "react";
import { Controller, UseFormReturn, RegisterOptions } from "react-hook-form";

import { TextField as MuiTextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useThemeContext } from "../../theme/ThemeContextProvider";
import { pixelBorder } from "../UI";
import { pixelBodyFontFamily } from "../../theme/variables";

export type Props = {
  name: string;
  label: string;
  required?: boolean;
  control: UseFormReturn<any>["control"];
  rules?: RegisterOptions;
  numRows?: number;
  errors?: { [key: string]: { message?: string } };
} & TextFieldProps;

const StyledMuiTextField = styled(MuiTextField)(({ theme }) => {
  const frame = theme.palette.commonCustom.front;

  return {
    "& .MuiOutlinedInput-input": {
      padding: `${theme.spacing(2.5)} ${theme.spacing(3)}`,
      fontFamily: pixelBodyFontFamily,
      fontSize: "24px",
      lineHeight: 1.3,
      letterSpacing: "0.5px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      background:
        theme.palette.mode === "dark"
          ? theme.palette.customColors.charcoalBlack
          : theme.palette.common.white,
      boxShadow: pixelBorder(frame),
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "&.Mui-focused": {
        boxShadow: pixelBorder(theme.palette.customColors.tealAccent),
      },
      "&.Mui-error": {
        boxShadow: pixelBorder(theme.palette.customColors.redAccent),
      },
      "& .MuiInputBase-multiline": {
        resize: "vertical",
      },
    },
    "& .MuiInputBase-multiline": {
      padding: 0,
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      marginTop: theme.spacing(1.5),
      fontFamily: pixelBodyFontFamily,
      fontSize: "20px",
      letterSpacing: "0.5px",
    },
  };
});

const TextField: FC<Props> = ({
  control,
  name,
  label,
  required,
  rules,
  errors,
  ...rest
}) => {
  const { theme } = useThemeContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        const errorMessage = errors?.[name]?.message;

        return (
          <StyledMuiTextField
            {...field}
            label={label}
            InputLabelProps={{
              style: {
                color: theme.palette.commonCustom.front,
                top: theme.spacing(0.5),
                left: theme.spacing(1),
                background: theme.palette.backgroundCustom.primary,
              },
              sx: {
                fontFamily: pixelBodyFontFamily,
                fontSize: "22px",
                letterSpacing: "0.5px",
                "& .MuiFormLabel-asterisk": {
                  color: theme.palette.commonCustom.front,
                  "&.Mui-error": {
                    color: theme.palette.commonCustom.front,
                  },
                },
                "&.MuiInputLabel-shrink": {
                  paddingRight: theme.spacing(1),
                  paddingLeft: theme.spacing(1),
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-input": {
                color: theme.palette.commonCustom.front,
                "&:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.backgroundCustom.primary} inset`,
                },
              },
              input: {
                color: theme.palette.commonCustom.front,
              },
              textarea: {
                resize: "both",
                color: theme.palette.commonCustom.front,
                marginRight: "16px",
                marginBottom: "24px",
              },
            }}
            FormHelperTextProps={{
              style: { color: theme.palette.customColors.redAccent },
            }}
            variant="outlined"
            required={required}
            error={!!errorMessage}
            helperText={errorMessage}
            {...rest}
          />
        );
      }}
    />
  );
};

export default TextField;
