import { FC } from "react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ProjectInfoRow from "./ProjectInfoRow";

interface InfoLinkRowProps {
  label: string;
  link: string;
  linkLabel: string;
}

const InfoLinkRow: FC<InfoLinkRowProps> = ({ label, link, linkLabel }) => {
  const theme = useTheme();

  return (
    <ProjectInfoRow
      label={label}
      value={
        <Box
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "inherit",
            wordBreak: "break-all",
            textDecoration: "underline",
            textDecorationColor: theme.palette.customColors.tealAccent,
            textDecorationThickness: "3px",
            textUnderlineOffset: "5px",
            "&:hover": {
              color: theme.palette.customColors.tealAccent,
            },
          }}
        >
          {linkLabel}
        </Box>
      }
    />
  );
};

export default InfoLinkRow;
