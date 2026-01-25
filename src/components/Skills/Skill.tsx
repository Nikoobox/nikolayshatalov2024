import { FC, ElementType } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useThemeContext } from "../../theme/ThemeContextProvider";

interface Props {
  skillName: string;
  iconType: ElementType;
}

const Skill: FC<Props> = ({ skillName, iconType: TechIcon }) => {
  const { isDarkMode } = useThemeContext();
  const theme = useTheme();
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const iconColor = isDarkMode
    ? theme.palette.common.white
    : theme.palette.primary.main;

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
        width="88px"
      >
        <TechIcon color={iconColor} size={theme.spacing(8)} />
        <Typography variant="body1" mt={1}>
          {skillName}
        </Typography>
      </Box>
    </motion.div>
  );
};
export default Skill;
