import { FC, ElementType } from "react";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  skillName: string;
  iconType: ElementType;
}

const Skill: FC<Props> = ({ skillName, iconType: TechIcon }) => {
  const theme = useTheme();
  return (
    <Box
      key={skillName}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <TechIcon color={theme.palette.primary.main} size={theme.spacing(8)} />
      <Typography variant="body1" mt={1}>
        {skillName}
      </Typography>
    </Box>
  );
};
export default Skill;
