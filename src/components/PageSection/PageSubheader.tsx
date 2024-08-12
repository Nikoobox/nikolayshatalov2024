import { FC, PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Typography } from "@mui/material";

interface Props {
  color?: string;
}

const PageSubheader: FC<PropsWithChildren<Props>> = ({ children, color }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView && { opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
    >
      <Typography variant="h1" color={color}>
        {children}
      </Typography>
    </motion.div>
  );
};
export default PageSubheader;
