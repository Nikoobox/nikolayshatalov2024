import { FC } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PageSection from "../PageSection";
import { SKILLS_DATA } from "../Data";
import Skill from "./Skill";

const MAIN = "main";
const ADDITIONAL = "additional";

const renderSkills = ({ type }: { type: string }) =>
  SKILLS_DATA.filter((item) => item.type === type).map(
    ({ skillName, iconType: TechIcon }) => (
      <Skill key={skillName} skillName={skillName} iconType={TechIcon} />
    )
  );

const Skills: FC = () => {
  const mainSkills = renderSkills({ type: MAIN });
  const additionalSkills = renderSkills({ type: ADDITIONAL });

  return (
    <PageSection>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h3" mb={5}>
          Projects
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={5}
          flexWrap="wrap"
          width="75%"
        >
          {mainSkills}
        </Box>

        <Typography variant="h3" mb={5} mt={20}>
          Additional Skills & Tools
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={5}
          flexWrap="wrap"
          width="75%"
        >
          {additionalSkills}
        </Box>
      </Box>
    </PageSection>
  );
};
export default Skills;
