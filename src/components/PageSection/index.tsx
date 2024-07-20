import { FC, PropsWithChildren } from "react";

import { Box, Typography, Container } from "@mui/material";

interface Props {
  header?: string;
}

const PageSection: FC<PropsWithChildren<Props>> = ({ children, header }) => {
  return (
    <Container maxWidth="lg">
      <Box py={10}>
        {header && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h1" mb={5}>
              {header}
            </Typography>
          </Box>
        )}

        {children}
      </Box>
    </Container>
  );
};
export default PageSection;
