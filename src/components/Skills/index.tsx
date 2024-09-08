import { FC } from "react";
import Wave from "react-wavify";

import { Box } from "@mui/material";

import PageSection from "../PageSection";
import { SKILLS_DATA } from "../Data";
import Skill from "./Skill";
import { useThemeContext } from "../../theme/ThemeContextProvider";

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
  const { theme } = useThemeContext();

  const mainSkills = renderSkills({ type: MAIN });
  const additionalSkills = renderSkills({ type: ADDITIONAL });

  return (
    <>
      <Wave
        fill={theme.palette.backgroundCustom.secondary}
        paused={false}
        style={{
          display: "flex",
          background: theme.palette.backgroundCustom.primary,
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
          <PageSection.PageSubheader>
            <Box mb={5}>Skills</Box>
          </PageSection.PageSubheader>

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

          <PageSection.PageSubheader>
            <Box mb={5} mt={20}>
              Additional Skills & Tools
            </Box>
          </PageSection.PageSubheader>
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
