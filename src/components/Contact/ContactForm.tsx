import { useRef, FC } from "react";
import emailjs from "@emailjs/browser";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useForm, SubmitHandler } from "react-hook-form";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextField } from "../FormFields";
import { FORM_FIELDS } from "../../constants";
import { DEFAULT_VALUES } from "./DefaultValues";

const SUCCESS = "success";
const ERROR = "error";

const StyledButton = styled(Button)(({ theme, disabled }) => ({
  border: `solid 2px ${
    disabled ? theme.palette.customColors.grey : theme.palette.common.white
  }`,
  borderRadius: theme.spacing(4),
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
  svg: {
    width: theme.spacing(2.5),
    height: "auto",
    color: disabled
      ? theme.palette.customColors.grey
      : theme.palette.common.white,
  },
}));

interface IFormInput {
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
}

const ContactForm: FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<IFormInput>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log("onSubmit-data", data);

    if (form?.current) {
      sendEmail(form.current);
    }
  };

  const sendEmail = (formElement: HTMLFormElement) => {
    emailjs
      .sendForm(
        process.env.REACT_APP_YOUR_SERVICE_ID as string,
        process.env.REACT_APP_YOUR_TEMPLATE_ID as string,
        formElement,
        process.env.REACT_APP_YOUR_PUBLIC_KEY as string
      )
      .then(
        (result) => {
          enqueueSnackbar("Your message was successfully sent to Nikolay!", {
            variant: SUCCESS,
          });
          reset();
          console.log(result.text);
        },
        (error) => {
          enqueueSnackbar(error?.text, {
            variant: ERROR,
          });
          reset();
          console.log(error.text);
        }
      );
  };

  return (
    <Box width="60%" margin="auto">
      <form ref={form} onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            name={FORM_FIELDS.USER_NAME.name}
            label={FORM_FIELDS.USER_NAME.label}
            control={control}
            errors={errors}
            required
            rules={{
              required: `${FORM_FIELDS.USER_NAME.label} is required`,
              maxLength: 256,
              minLength: {
                value: 2,
                message: `${FORM_FIELDS.USER_NAME.label} must be at least 2 characters long`,
              },
            }}
          />
          <TextField
            name={FORM_FIELDS.USER_EMAIL.name}
            label={FORM_FIELDS.USER_EMAIL.label}
            control={control}
            errors={errors}
            required
            rules={{
              required: `${FORM_FIELDS.USER_EMAIL.label} is required`,
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Entered value does not match email format",
              },
            }}
          />
          <TextField
            name={FORM_FIELDS.SUBJECT.name}
            label={FORM_FIELDS.SUBJECT.label}
            control={control}
            errors={errors}
            required
            rules={{
              required: `${FORM_FIELDS.SUBJECT.label} is required`,
              maxLength: 256,
              minLength: {
                value: 2,
                message: `${FORM_FIELDS.SUBJECT.label} must be at least 2 characters long`,
              },
            }}
          />
          <TextField
            name={FORM_FIELDS.MESSAGE.name}
            label={FORM_FIELDS.MESSAGE.label}
            control={control}
            errors={errors}
            rules={{
              required: `${FORM_FIELDS.MESSAGE.label} is required`,
              maxLength: 512,
              minLength: {
                value: 2,
                message: `${FORM_FIELDS.MESSAGE.label} must be at least 2 characters long`,
              },
            }}
            required
            multiline
            minRows={3}
          />
        </Box>
        <Box mt={3} width="100%" display="flex" justifyContent="flex-end">
          <StyledButton type="submit" disabled={!isValid}>
            <Typography
              variant="h3"
              color={isValid ? "common.white" : "customColors.grey"}
            >
              Send
            </Typography>
            <IoPaperPlaneOutline
              style={{
                marginLeft: "6px",
              }}
            />
          </StyledButton>
        </Box>
      </form>
    </Box>
  );
};

export default ContactForm;
