import { useState, useRef, useEffect, FC } from "react";
import emailjs from "@emailjs/browser";
import { ClipLoader } from "react-spinners";
import { Box, Typography, Button } from "@mui/material";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { TextField } from "../FormFields";

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
    label: "Name",
  },
  USER_EMAIL: {
    name: "user_email",
    label: "Email",
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
  console.log("### isValid", isValid);
  console.log("*** isDirty", isDirty);
  console.log("EEE errors", errors);
  return (
    <Box width="60%" margin="auto">
      <Box>
        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={0.5}>
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
            {/* <TextField
              name={FORM_FIELDS.SUBJECT.name}
              label={FORM_FIELDS.SUBJECT.label}
              control={control}
              required
              // errors={errors}
            /> */}
            {/* <TextField
              name={FORM_FIELDS.MESSAGE.name}
              label={FORM_FIELDS.MESSAGE.label}
              control={control}
              required
              // errors={errors}
            />  */}
          </Box>

          {/* <input type="submit" /> */}
          <Button disabled={!isValid} sx={{ marginTop: "8px" }} size="large">
            <Typography color="common.white" variant="h3">
              Submit
            </Typography>
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ContactForm;
