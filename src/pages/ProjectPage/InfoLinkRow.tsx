import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FC } from "react";
import { useDarkTheme } from "@/hooks";
import { MyLink } from "@/components/UI";
import { LABEL_MIN_WIDTH } from "./configs";

interface InfoLinkRowProps {
  label: string;
  link: string;
  linkLabel: string;
}

const LABEL_FONT_WEIGHT = 500;

const InfoLinkRow: FC<InfoLinkRowProps> = ({ label, link, linkLabel }) => {
  const theme = useTheme();
  const isDarkMode = useDarkTheme();

  const labelUnderlineSx = {
    fontWeight: LABEL_FONT_WEIGHT,
    position: "relative",
    display: "inline-block",
    zIndex: 1,
    height: "max-content",
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      bottom: 1,
      width: "75%",
      height: "10px",
      background: isDarkMode
        ? theme.palette.customColors.tealAccent
        : theme.palette.customColors.classicBlue,
      opacity: 0.6,
      zIndex: -1,
    },
  };

  return (
    <Box
      display="flex"
      gap={{ sm: 2 }}
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        "& .site-link": {
          textDecorationColor: isDarkMode
            ? theme.palette.customColors.tealAccent
            : theme.palette.customColors.classicBlue,
        },
      }}
    >
      <Box minWidth={LABEL_MIN_WIDTH}>
        <Typography
          variant="h3"
          color={isDarkMode ? theme.palette.customColors.greyAccent : "inherit"}
          sx={labelUnderlineSx}
        >
          {label}
        </Typography>
      </Box>
      <MyLink
        label={linkLabel}
        link={link}
        variant="h3"
        color={
          isDarkMode
            ? theme.palette.customColors.tealAccent
            : theme.palette.customColors.classicBlue
        }
        className="site-link"
      />
    </Box>
  );
};

export default InfoLinkRow;
