import { useRef, FC, useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from "notistack";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextField } from "../FormFields";
import { PixelArrow, pixelBorder } from "../UI";
import { pixelFontFamily } from "../../theme/variables";
import { FORM_FIELDS } from "../../constants";
import { DEFAULT_VALUES } from "./DefaultValues";

const SUCCESS = "success";
const ERROR = "error";

// Teal pixel button that presses in like "Say hi"; grey outline while the
// form is still invalid.
const StyledButton = styled("button")(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.common.white
    : theme.palette.common.black;
  const shadow = isDarkMode ? "#000" : theme.palette.common.black;
  const muted = theme.palette.customColors.grey;

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    padding: "16px 24px",
    border: 0,
    cursor: "pointer",
    fontFamily: pixelFontFamily,
    fontSize: "14px",
    lineHeight: 1,
    background: theme.palette.customColors.tealAccent,
    color: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.black,
    boxShadow: `${pixelBorder(frame)}, 6px 6px 0 4px ${shadow}`,
    "&:hover:not(:disabled)": {
      transform: "translate(2px, 2px)",
      boxShadow: `${pixelBorder(frame)}, 2px 2px 0 4px ${shadow}`,
    },
    "&:active:not(:disabled)": {
      transform: "translate(6px, 6px)",
      boxShadow: pixelBorder(frame),
    },
    "&:disabled": {
      cursor: "not-allowed",
      background: "transparent",
      color: muted,
      boxShadow: pixelBorder(muted),
    },
  };
});

interface IFormInput {
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
}

const ContactForm: FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const [fileToAttach, setFileToAttach] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInput>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (form?.current) {
      sendEmail(form.current);
    }
  };

  const sendEmail = (formElement: HTMLFormElement) => {
    const formData = new FormData(formElement);

    if (fileToAttach) {
      formData.append("my_file", fileToAttach); // 'my_file' matches the parameter name in your EmailJS template
    }

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
        formElement,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
      )
      .then(
        (result) => {
          enqueueSnackbar("Your message was successfully sent to Nikolay!", {
            variant: SUCCESS,
          });
          reset();
          setFileToAttach(null);
          console.log(result.text);
        },
        (error) => {
          enqueueSnackbar(error?.text, {
            variant: ERROR,
          });
          reset();
          setFileToAttach(null);
          console.log(error.text);
        },
      );
  };

  return (
    <Box margin="auto" sx={{ width: { sm: "100%", md: "60%" } }}>
      <form ref={form} onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={4}>
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
        <Box
          mt={5}
          width="100%"
          display="flex"
          sx={{
            justifyContent: {
              xs: "center",
              md: "flex-end",
            },
          }}
        >
          <StyledButton type="submit" disabled={!isValid}>
            <PixelArrow width={8} height={14} />
            SEND
          </StyledButton>
        </Box>
      </form>
    </Box>
  );
};

export default ContactForm;
