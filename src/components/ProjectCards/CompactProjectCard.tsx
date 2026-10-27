import { FC, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { ProjectProps } from "./ProjectProps";
import { getNextColor } from "./helpers";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { PixelArrow, PixelTag, StatusLight, pixelBorder } from "../UI";
import { pixelBodyFontFamily, pixelFontFamily } from "../../theme/variables";

// Pixel window card: the frame turns a random accent color on hover (stays
// put; no lift).
const StyledCard = styled(Link, {
  shouldForwardProp: (prop) => prop !== "hoverColor",
})<{ hoverColor: string }>(({ theme, hoverColor }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const frame = isDarkMode
    ? theme.palette.customColors.greyAccent
    : theme.palette.common.black;
  const shadow = isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(34, 34, 34, 0.18)";
  const accent = hoverColor;

  return {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(3),
    textDecoration: "none",
    color: "inherit",
    background: isDarkMode
      ? theme.palette.customColors.charcoalBlack
      : theme.palette.common.white,
    boxShadow: `${pixelBorder(frame)}, 8px 8px 0 0 ${shadow}`,
    "&:hover": {
      boxShadow: `${pixelBorder(accent)}, 8px 8px 0 0 ${shadow}`,
    },
    "& .compact-arrow": {
      visibility: "hidden",
    },
    "&:hover .compact-arrow, &:focus-visible .compact-arrow": {
      visibility: "visible",
    },
    [theme.breakpoints.down("sm")]: {
      "& .compact-arrow": {
        visibility: "visible",
      },
    },
  };
});

const CompactProjectCard: FC<ProjectProps> = ({
  name,
  tools,
  id,
  info,
  statusSimple,
}) => {
  const { isDarkMode } = useThemeContext();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [hoverColor, setHoverColor] = useState(() => getNextColor());

  const techTools = tools.map((tool) => <PixelTag key={tool}>{tool}</PixelTag>);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 32, opacity: 0 }}
      animate={inView && { y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <StyledCard
        to={`/projects/${id}`}
        hoverColor={hoverColor}
        onMouseLeave={() => setHoverColor((previous) => getNextColor(previous))}
      >
        <Typography
          component="h3"
          sx={{
            fontFamily: pixelFontFamily,
            fontSize: "14px",
            lineHeight: 1.6,
            mb: 1.5,
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            fontFamily: pixelBodyFontFamily,
            fontSize: "20px",
            lineHeight: 1.3,
            letterSpacing: "0.5px",
            color: isDarkMode ? "customColors.greyAccent" : "customColors.grey",
            mb: 2.5,
          }}
        >
          {info}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
          {techTools}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt="auto"
        >
          {statusSimple && <StatusLight status={statusSimple} />}
          <Box
            className="compact-arrow"
            sx={{
              ml: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              fontFamily: pixelFontFamily,
              fontSize: "10px",
            }}
          >
            <PixelArrow />
            DETAILS
          </Box>
        </Box>
      </StyledCard>
    </motion.div>
  );
};

export default CompactProjectCard;
