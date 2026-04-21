import { FC, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { alpha } from "@mui/material/styles";

import { ProjectProps } from "./ProjectProps";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import { getRandomColor } from "./helpers";

const LIVE_GREEN_LIGHT = "#22ff66";

const StyledCard = styled(Link, {
  shouldForwardProp: (prop) => prop !== "hoverColor",
})<{ hoverColor: string }>(({ theme, hoverColor }) => {
  const isDarkMode = theme.palette.mode === "dark";
  const liveAccent = isDarkMode
    ? theme.palette.customColors.greenAccent
    : LIVE_GREEN_LIGHT;
  return {
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    color: "inherit",
    borderRadius: theme.spacing(4),
    padding: theme.spacing(2.5),
    background: isDarkMode
      ? theme.palette.backgroundCustom.primary
      : theme.palette.common.white,
    border: `1px solid ${
      isDarkMode
        ? theme.palette.customColors.blueDark
        : theme.palette.customColors.greyLightest
    }`,
    transition: "border-color 0.2s ease",
    height: "100%",
    "&:hover": {
      borderColor: hoverColor,
    },
    "& .compact-arrow": {
      opacity: 0,
      transition: "opacity 0.2s ease",
    },
    "&:hover .compact-arrow": {
      opacity: 1,
    },
    [theme.breakpoints.down("sm")]: {
      "& .compact-arrow": {
        opacity: 1,
      },
    },
    "& .tool": {
      padding: "3px 8px",
      borderRadius: theme.spacing(1.5),
      background: isDarkMode
        ? alpha(theme.palette.customColors.greyLightest, 0.9)
        : theme.palette.customColors.greyLightest,
      color: theme.palette.customColors.grey900,
      fontSize: "11px",
      fontWeight: 500,
      lineHeight: "16px",
    },
    "& .status-dot": {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      display: "inline-block",
      marginRight: "6px",
    },
    "& .status-dot--live": {
      background: liveAccent,
      boxShadow: `0 0 6px ${liveAccent}`,
      animation: "livePulse 1.8s ease-in-out infinite",
    },
    "& .status-dot--retired": {
      background: theme.palette.customColors.grey,
    },
    "@keyframes livePulse": {
      "0%, 100%": {
        opacity: 1,
        boxShadow: `0 0 6px ${liveAccent}`,
      },
      "50%": {
        opacity: 0.55,
        boxShadow: `0 0 1px ${liveAccent}`,
      },
    },
  };
});

const CompactProjectCard: FC<ProjectProps> = ({
  name,
  tools,
  year,
  id,
  info,
  statusSimple,
}) => {
  const isLive = statusSimple === "Live";
  const { isDarkMode } = useThemeContext();
  const { ref, inView } = useInView({ threshold: 0.2 });
  const [hoverColor, setHoverColor] = useState<string>(() => getRandomColor());

  const techTools = tools.map((tool) => (
    <Typography className="tool" key={tool} component="span">
      {tool}
    </Typography>
  ));

  return (
    <motion.div
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={inView && { y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <StyledCard
        to={`/projects/${id}`}
        hoverColor={hoverColor}
        onMouseEnter={() => setHoverColor(getRandomColor())}
      >
        <Box
          display="flex"
          alignItems="baseline"
          justifyContent="space-between"
          gap={1}
          mb={1}
        >
          <Typography variant="h2" sx={{ fontWeight: 400 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="grey" noWrap>
            {year}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            color: isDarkMode ? "customColors.greyAccent" : "customColors.grey",
            mb: 2,
          }}
        >
          {info}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={0.75} mb={2}>
          {techTools}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt="auto"
          pt={1}
        >
          {statusSimple && (
            <Box display="flex" alignItems="center">
              <span
                className={`status-dot ${
                  isLive ? "status-dot--live" : "status-dot--retired"
                }`}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: "12px" }}
                color="grey"
              >
                {statusSimple}
              </Typography>
            </Box>
          )}
          <Box
            display="flex"
            alignItems="center"
            gap={0.25}
            className="compact-arrow"
            sx={{ ml: "auto" }}
          >
            <Typography variant="body2" sx={{ fontSize: "13px" }}>
              Details
            </Typography>
            <IoIosArrowForward />
          </Box>
        </Box>
      </StyledCard>
    </motion.div>
  );
};

export default CompactProjectCard;
