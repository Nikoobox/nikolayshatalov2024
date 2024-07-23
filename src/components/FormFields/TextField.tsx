import { FC } from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";
import {
  useForm,
  SubmitHandler,
  Controller,
  Control,
  UseFormReturn,
  RegisterOptions,
} from "react-hook-form";

import { Box, TextField as MuiTextField, TextFieldProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type Props = {
  name: string;
  label: string;
  required?: boolean;
  control: UseFormReturn<any>["control"];
  rules?: RegisterOptions;
  errors?: { [key: string]: { message?: string } };
} & TextFieldProps;

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
          <MuiTextField
            {...field}
            label={label}
            InputLabelProps={{
              style: { color: theme.palette.customColors.greyAccent }, // Change label text color here
            }}
            sx={{
              input: {
                color: theme.palette.common.white,
              },
            }}
            variant="outlined"
            required={required}
            error={!!errorMessage} // Show error state if there's an error message
            helperText={errorMessage}
            {...rest}
          />
        );
      }}
    />
  );
};

export default TextField;
