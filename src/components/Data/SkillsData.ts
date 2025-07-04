import {
  SiJavascript,
  SiReact,
  SiRedux,
  SiRuby,
  SiRubyonrails,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiMongodb,
  SiChartdotjs,
  SiFirebase,
  SiTestinglibrary,
  SiMockserviceworker,
  SiMui,
  SiStorybook,
  SiJest,
  SiReduxsaga,
  SiSentry,
  SiMixpanel,
  SiLooker,
  SiApollographql,
  SiGraphql,
  SiTailwindcss,
} from "react-icons/si";
import { IoLogoNodejs } from "react-icons/io";
import { RiNextjsLine } from "react-icons/ri";

const MAIN = "main";
const ADDITIONAL = "additional";

export const SKILLS_DATA = [
  {
    skillName: "Typescript",
    iconType: SiTypescript,
    type: MAIN,
  },
  {
    skillName: "Javascript",
    iconType: SiJavascript,
    type: MAIN,
  },
  {
    skillName: "React",
    iconType: SiReact,
    type: MAIN,
  },
  {
    skillName: "NextJS",
    iconType: RiNextjsLine,
    type: MAIN,
  },
  {
    skillName: "Redux",
    iconType: SiRedux,
    type: MAIN,
  },
  {
    skillName: "Redux-saga",
    iconType: SiReduxsaga,
    type: MAIN,
  },

  {
    skillName: "Material UI",
    iconType: SiMui,
    type: MAIN,
  },
  {
    skillName: "Graphql",
    iconType: SiGraphql,
    type: MAIN,
  },
  {
    skillName: "Apollo",
    iconType: SiApollographql,
    type: MAIN,
  },

  {
    skillName: "Tailwindcss",
    iconType: SiTailwindcss,
    type: MAIN,
  },

  {
    skillName: "HTML5",
    iconType: SiHtml5,
    type: MAIN,
  },
  {
    skillName: "CSS",
    iconType: SiCss3,
    type: MAIN,
  },
  {
    skillName: "Jest",
    iconType: SiJest,
    type: MAIN,
  },
  {
    skillName: "Testing Library",
    iconType: SiTestinglibrary,
    type: MAIN,
  },
  {
    skillName: "MSW",
    iconType: SiMockserviceworker,
    type: MAIN,
  },
  {
    skillName: "Storybook",
    class: "skill-name",
    iconType: SiStorybook,
    type: ADDITIONAL,
  },
  {
    skillName: "Chart.js",
    iconType: SiChartdotjs,
    type: ADDITIONAL,
  },
  {
    skillName: "Sentry",
    iconType: SiSentry,
    type: ADDITIONAL,
  },
  {
    skillName: "Mixpanel",
    iconType: SiMixpanel,
    type: ADDITIONAL,
  },
  {
    skillName: "Ruby",
    iconType: SiRuby,
    type: ADDITIONAL,
  },
  {
    skillName: "Rails",
    iconType: SiRubyonrails,
    type: ADDITIONAL,
  },
  {
    skillName: "Looker",
    iconType: SiLooker,
    type: ADDITIONAL,
  },
  {
    skillName: "Node.js",
    iconType: IoLogoNodejs,
    type: ADDITIONAL,
  },
  {
    skillName: "MongoDB",
    iconType: SiMongodb,
    type: ADDITIONAL,
  },
  {
    skillName: "Firebase",
    iconType: SiFirebase,
    type: ADDITIONAL,
  },
];
