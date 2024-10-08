import { useRef, FC, useState } from "react";
import emailjs from "@emailjs/browser";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextField } from "../FormFields";
import { FORM_FIELDS } from "../../constants";
import { DEFAULT_VALUES } from "./DefaultValues";
import { FLAGS } from "../../helpers";
import MyDropzone from "../Dropzone";

const { getFlagNamePerEnvironment } = FLAGS;

const SUCCESS = "success";
const ERROR = "error";

const StyledButton = styled(Button)(({ theme, disabled }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const bgColorEnabled = isDarkMode
    ? "transparent"
    : theme.palette.customColors.tealAccent;
  return {
    border: `solid 2px ${
      disabled
        ? theme.palette.customColors.grey
        : theme.palette.commonCustom.front
    }`,
    background: disabled ? "transparent" : bgColorEnabled,
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
    svg: {
      width: theme.spacing(2.5),
      height: "auto",
      color: disabled
        ? theme.palette.customColors.grey
        : theme.palette.commonCustom.front,
    },

    "&:hover": {
      backgroundColor: disabled ? "transparent" : bgColorEnabled,
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

  const formDropzoneFlag = useFeatureFlagEnabled(
    getFlagNamePerEnvironment({
      flagTest: "formDropzoneFlagTest",
      flagProd: "formDropzoneFlagProd",
    })
  );

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
        }
      );
  };

  const onFileAttach = (file: File | null) => {
    if (file instanceof File) {
      setFileToAttach(file);
    }
  };

  return (
    <Box margin="auto" sx={{ width: { sm: "100%", md: "60%" } }}>
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
        <Box mt={3}>
          {formDropzoneFlag && <MyDropzone onFileAttach={onFileAttach} />}
        </Box>
        <Box
          mt={3}
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
            <Typography
              variant="h3"
              color={isValid ? "commonCustom.front" : "customColors.grey"}
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
