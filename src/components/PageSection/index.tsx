import { FC, PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Box, Typography, Container } from "@mui/material";

import PageSubheader from "./PageSubheader";

interface Props {
  header?: string;
  id?: string;
}

interface PageSectionComponent extends FC<PropsWithChildren<Props>> {
  PageSubheader: typeof PageSubheader;
}

const PageSection: PageSectionComponent = ({ children, header, id }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  return (
    <Container maxWidth="lg" id={id}>
      <Box py={10}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView && { opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          {header && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h1" mb={5}>
                {header}
              </Typography>
            </Box>
          )}
        </motion.div>
        {children}
      </Box>
    </Container>
  );
};

// Attach PageSubheader as a static property of PageSection
PageSection.PageSubheader = PageSubheader;

export default PageSection;
