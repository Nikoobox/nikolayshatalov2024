import { FC } from "react";
import Wave from "react-wavify";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();

  const mainSkills = renderSkills({ type: MAIN });
  const additionalSkills = renderSkills({ type: ADDITIONAL });

  return (
    <>
      <Wave
        fill={theme.palette.common.white}
        paused={false}
        style={{
          display: "flex",
          background: theme.palette.customColors.blueDark,
          // position: "absolute",
          transform: "rotate(180)",
        }}
        options={{
          height: 40,
          amplitude: 40,
          speed: 0.1,
          points: 3,
        }}
      />

      <PageSection id="skills-destination">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography variant="h1" mb={5}>
            Skills
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={6}
            flexWrap="wrap"
            width="60%"
          >
            {mainSkills}
          </Box>

          <Typography variant="h1" mb={5} mt={20}>
            Additional Skills & Tools
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={6}
            flexWrap="wrap"
            width="60%"
          >
            {additionalSkills}
          </Box>
        </Box>
      </PageSection>
    </>
  );
};
export default Skills;
