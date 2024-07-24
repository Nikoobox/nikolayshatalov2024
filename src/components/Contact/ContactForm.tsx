import { useState, useRef, useEffect, FC } from "react";
import emailjs from "@emailjs/browser";
import { ClipLoader } from "react-spinners";

import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { IoPaperPlaneOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useForm, SubmitHandler } from "react-hook-form";

import { TextField } from "../FormFields";

const StyledButton = styled(Button)(({ theme }) => ({
  border: `solid 2px ${theme.palette.common.white}`,
  borderRadius: theme.spacing(4),
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
  marginTop: theme.spacing(3),
  svg: {
    width: theme.spacing(2.5),
    height: "auto",
  },
}));

interface IFormInput {
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
}

const DEFAULT_VALUES = {
  user_name: "",
  user_email: "",
  subject: "",
  message: "",
};

const FORM_FIELDS = {
  USER_NAME: {
    name: "user_name",
    label: "Your Name",
  },
  USER_EMAIL: {
    name: "user_email",
    label: "Your Email",
  },
  SUBJECT: {
    name: "subject",
    label: "Subject",
  },
  MESSAGE: {
    name: "message",
    label: "Message",
  },
};

const ContactForm: FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const {
    control,
    handleSubmit,
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
    console.log("sendEmail formElement", formElement);
    emailjs
      .sendForm(
        process.env.REACT_APP_YOUR_SERVICE_ID as string,
        process.env.REACT_APP_YOUR_TEMPLATE_ID as string,
        formElement,
        process.env.REACT_APP_YOUR_PUBLIC_KEY as string
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <Box width="60%" margin="auto">
      <Box>
        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* <input
              {...register("user_name", { required: true, maxLength: 128 })}
            />
            <input
              {...register("user_email", { required: true, maxLength: 128 })}
            />
            <input
              {...register("subject", { required: true, maxLength: 128 })}
            />
            <input
              {...register("message", { required: true, maxLength: 512 })}
            /> */}

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

          <StyledButton type="submit" disabled={!isValid}>
            <Typography
              color={`${!isValid ? "customColors.grey" : "common.white"}`}
              variant="h2"
            >
              Send
            </Typography>
            <IoPaperPlaneOutline
              style={{
                marginLeft: "6px",
                color: `${!isValid ? "customColors.grey" : "common.white"}`, //fix
              }}
            />
          </StyledButton>
        </form>
      </Box>
    </Box>
  );
};

export default ContactForm;
