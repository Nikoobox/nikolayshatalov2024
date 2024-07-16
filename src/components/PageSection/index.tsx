import { FC, PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
  header?: string;
}

const PageSection: FC<PropsWithChildren<Props>> = ({ children, header }) => {
  return (
    <Box py={10}>
      {header && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h3" mb={5}>
            {header}
          </Typography>
        </Box>
      )}

      {children}
    </Box>
  );
};
export default PageSection;
