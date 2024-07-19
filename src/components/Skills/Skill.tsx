import { FC, ElementType } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
  skillName: string;
  iconType: ElementType;
}

const Skill: FC<Props> = ({ skillName, iconType: TechIcon }) => {
  return (
    <Box
      key={skillName}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <TechIcon color="primary" size="48px" />
      <Typography variant="h3" mt={1}>
        {skillName}
      </Typography>
    </Box>
  );
};
export default Skill;
