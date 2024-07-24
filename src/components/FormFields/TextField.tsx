import { FC } from "react";
import { Controller, UseFormReturn, RegisterOptions } from "react-hook-form";

import { TextField as MuiTextField, TextFieldProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

export type Props = {
  name: string;
  label: string;
  required?: boolean;
  control: UseFormReturn<any>["control"];
  rules?: RegisterOptions;
  numRows?: number;
  errors?: { [key: string]: { message?: string } };
} & TextFieldProps;

const StyledMuiTextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-input": {
    padding: `${theme.spacing(3)} ${theme.spacing(3)}`,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(5),

    "& .MuiOutlinedInput-notchedOutline": {
      border: `2px solid ${theme.palette.common.white}`,
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: `3px solid ${theme.palette.common.white}`,
      },
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: `3px solid ${theme.palette.common.white}`,
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      border: `2px solid ${theme.palette.common.white}`,
    },
    "& .MuiInputBase-multiline": {
      resize: "both",
    },
  },
  "& .MuiInputBase-multiline": {
    padding: 0,
  },
}));

const TextField: FC<Props> = (props) => {
  const { control, name, label, required, rules, errors, ...rest } = props;

  const theme = useTheme();

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
                color: theme.palette.common.white,
                top: theme.spacing(1),
                left: theme.spacing(1),
                background: theme.palette.primary.main,
              },
              sx: {
                "& .MuiFormLabel-asterisk": {
                  color: theme.palette.common.white,
                  "&.Mui-error": {
                    color: theme.palette.common.white,
                  },
                },
                "&.MuiInputLabel-shrink": {
                  paddingRight: theme.spacing(1),
                  paddingLeft: theme.spacing(1),
                },
              },
            }}
            sx={{
              input: {
                color: theme.palette.common.white,
              },
              textarea: {
                resize: "both",
                color: theme.palette.common.white,
                marginRight: "16px",
                marginBottom: "24px",
              },
            }}
            FormHelperTextProps={{
              style: { color: theme.palette.customColors.purpleAccent },
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
