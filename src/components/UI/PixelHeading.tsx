import { FC, PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Typography } from "@mui/material";

import { pixelFontFamily } from "../../theme/variables";
import { stepEase } from "./pixel";

const SIZES = {
  large: { xs: "18px", sm: "24px" },
  small: { xs: "12px", sm: "16px" },
};

interface Props {
  size?: keyof typeof SIZES;
}

const PixelHeading: FC<PropsWithChildren<Props>> = ({
  children,
  size = "large",
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView && { opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: stepEase(3) }}
    >
      <Typography
        component="h2"
        sx={{
          fontFamily: pixelFontFamily,
          fontSize: SIZES[size],
          lineHeight: 1.6,
          letterSpacing: "2px",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {children}
      </Typography>
    </motion.div>
  );
};

export default PixelHeading;
