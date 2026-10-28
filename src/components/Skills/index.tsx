import { FC } from "react";

import { Box } from "@mui/material";

import PageSection from "../PageSection";
import { SKILLS_DATA } from "../Data";
import { PixelHeading, PixelZigzag } from "../UI";
import Skill from "./Skill";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const MAIN = "main";
const ADDITIONAL = "additional";

const SKILLS_WRAPPER_WIDTH = {
  xs: "100%",
  sm: "80%",
  md: "70%",
  lg: "60%",
};

const renderSkills = ({ type }: { type: typeof MAIN | typeof ADDITIONAL }) =>
  SKILLS_DATA.filter((item) => item.type === type).map(
    ({ skillName, iconType: TechIcon }) => (
      <Skill
        key={skillName}
        skillName={skillName}
        iconType={TechIcon}
        size={type}
      />
    ),
  );

const Skills: FC = () => {
  const { theme } = useThemeContext();

  const mainSkills = renderSkills({ type: MAIN });
  const additionalSkills = renderSkills({ type: ADDITIONAL });

  return (
    <>
      {theme.palette.mode !== "dark" && (
        <PixelZigzag color={theme.palette.customColors.greyAccent} />
      )}

      <PageSection id="skills-destination">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box mb={8} mt={10}>
            <PixelHeading>Skills</PixelHeading>
          </Box>

          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            rowGap={{ xs: 5, sm: 6 }}
            columnGap={{ xs: 1, sm: 3 }}
            flexWrap="wrap"
            sx={{
              width: SKILLS_WRAPPER_WIDTH,
            }}
          >
            {mainSkills}
          </Box>

          <Box mb={6} mt={20}>
            <PixelHeading size="small">Additional Skills</PixelHeading>
          </Box>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            rowGap={{ xs: 4, sm: 5 }}
            columnGap={{ xs: 1, sm: 3 }}
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
