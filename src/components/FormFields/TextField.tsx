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

const TextField: FC<Props> = ({
  control,
  name,
  label,
  required,
  rules,
  errors,
  ...rest
}) => {
  const theme = useTheme();

  console.log("TextField ...name", name);
  console.log("rules", rules);
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const errorMessage = errors?.[name]?.message;
        console.log("-errorMessage", errorMessage);
        console.log("-fieldState", fieldState);
        console.log("-field", field);
        return (
          <MuiTextField
            {...field}
            label={label}
            InputLabelProps={{
              style: { color: theme.palette.customColors.greyAccent }, // Change label text color here
            }}
            // inputProps={{ pattern: rules }}
            // inputProps={{
            //   type: "text",
            //   inputMode: "numeric",
            //   pattern: "d*",
            //   min: 0,
            //   maxLength: 5,
            //   validate:{(val)=>console.log('val',val)}
            // }}
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
