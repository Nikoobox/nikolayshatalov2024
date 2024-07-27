import { FC, ElementType } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  skillName: string;
  iconType: ElementType;
}

const Skill: FC<Props> = ({ skillName, iconType: TechIcon }) => {
  const theme = useTheme();
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      animate={inView && { y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        key={skillName}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minWidth="90px"
      >
        <TechIcon color={theme.palette.primary.main} size={theme.spacing(8)} />
        <Typography variant="body1" mt={1}>
          {skillName}
        </Typography>
      </Box>
    </motion.div>
  );
};
export default Skill;
