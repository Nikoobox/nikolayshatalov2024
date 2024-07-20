import { FC } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PageSection from "../PageSection";

const Contact: FC = () => {
  return (
    <PageSection>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h1" mb={5} color="common.white">
          Contact
        </Typography>
      </Box>
    </PageSection>
  );
};
export default Contact;
