import { FC, ElementType } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { pixelBodyFontFamily } from "../../theme/variables";
import { pixelBorder } from "../UI";

const SLOT_SIZES = {
  main: { slot: 80, icon: 40, label: "22px" },
  additional: { slot: 64, icon: 32, label: "20px" },
};

// Inventory slot: lifts one step and gets a teal frame on hover.
const StyledSkill = styled(Box)(({ theme }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.customColors.greyAccent
    : theme.palette.common.black;
  const dropShadow = isDarkMode
    ? "6px 6px 0 0 rgba(0, 0, 0, 0.6)"
    : `6px 6px 0 0 ${theme.palette.customColors.greyAccent}`;
  const accent = theme.palette.customColors.tealAccent;

  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "120px",
    "& .slot": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDarkMode
        ? theme.palette.customColors.charcoalBlack
        : theme.palette.common.white,
      boxShadow: `${pixelBorder(frame)}, ${dropShadow}`,
    },
    "&:hover .slot": {
      transform: "translateY(-4px)",
      boxShadow: `${pixelBorder(accent)}, ${dropShadow}`,
    },
  };
});

interface Props {
  skillName: string;
  iconType: ElementType;
  size?: keyof typeof SLOT_SIZES;
}

const Skill: FC<Props> = ({ skillName, iconType: TechIcon, size = "main" }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { slot, icon, label } = SLOT_SIZES[size];

  return (
    <motion.div
      ref={ref}
      initial={{ y: 32, opacity: 0 }}
      animate={inView && { y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <StyledSkill>
        <Box className="slot" width={slot} height={slot}>
          <TechIcon size={icon} color="currentColor" aria-hidden="true" />
        </Box>
        <Typography
          mt={2}
          whiteSpace="nowrap"
          sx={{ fontFamily: pixelBodyFontFamily, fontSize: label, lineHeight: 1 }}
        >
          {skillName}
        </Typography>
      </StyledSkill>
    </motion.div>
  );
};
export default Skill;
