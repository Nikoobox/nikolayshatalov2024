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

const SKILLS_WRAPPER_WIDTH = {
  xs: "100%", // 0px - 600px
  sm: "80%", // 600px - 960px
  md: "70%", // 960px - 1280px
  lg: "60%", // 1280px - 1920px
};

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
            sx={{
              width: SKILLS_WRAPPER_WIDTH,
            }}
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
            sx={{
              width: SKILLS_WRAPPER_WIDTH,
            }}
          >
            {additionalSkills}
          </Box>
        </Box>
      </PageSection>
    </>
  );
};
export default Skills;
