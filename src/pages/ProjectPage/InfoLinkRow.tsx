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

const InfoLinkRow: FC<InfoLinkRowProps> = ({ label, link, linkLabel }) => {
  const theme = useTheme();
  const isDarkMode = useDarkTheme();

  return (
    <Box
      display="flex"
      gap={2}
      alignItems={"center"}
      sx={{
        "& .site-link": {
          textDecorationColor: isDarkMode
            ? theme.palette.customColors.tealAccent
            : theme.palette.customColors.classicBlue,
        },
      }}
    >
      <Typography minWidth={LABEL_MIN_WIDTH}>{label}</Typography>
      <MyLink
        label={linkLabel}
        link={link}
        variant="h4"
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
