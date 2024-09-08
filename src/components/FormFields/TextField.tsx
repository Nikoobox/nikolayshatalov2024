import { FC } from "react";
import { Controller, UseFormReturn, RegisterOptions } from "react-hook-form";

import { TextField as MuiTextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useThemeContext } from "../../theme/ThemeContextProvider";

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
    borderRadius: theme.spacing(2),

    "& .MuiOutlinedInput-notchedOutline": {
      border: `2px solid ${theme.palette.commonCustom.front}`,
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: `3px solid ${theme.palette.commonCustom.front}`,
      },
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: `3px solid ${theme.palette.commonCustom.front}`,
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      border: `2px solid ${theme.palette.commonCustom.front}`,
    },
    "& .MuiInputBase-multiline": {
      resize: "vertical",
    },
  },
  "& .MuiInputBase-multiline": {
    padding: 0,
  },
}));

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
                top: theme.spacing(1),
                left: theme.spacing(1),
                background: theme.palette.backgroundCustom.primary,
              },
              sx: {
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
