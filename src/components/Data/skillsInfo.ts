import {
  SiJavascript,
  SiReact,
  SiRedux,
  SiWebpack,
  SiSocketdotio,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiMongodb,
  SiChartdotjs,
  SiFirebase,
  SiMui,
  SiStorybook,
  SiJest,
  SiSentry,
  SiMixpanel,
  SiLooker,
  SiApollographql,
  SiGraphql,
  SiTailwindcss,
} from "react-icons/si";
import { IoLogoNodejs } from "react-icons/io";
import { RiNextjsLine } from "react-icons/ri";
import { TbApi } from "react-icons/tb";

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
    skillName: "RTK Query",
    iconType: SiRedux,
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
    skillName: "REST API",
    iconType: TbApi,
    type: MAIN,
  },
  {
    skillName: "Material UI",
    iconType: SiMui,
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
    skillName: "Testing",
    iconType: SiJest,
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
    skillName: "Webpack 5",
    iconType: SiWebpack,
    type: ADDITIONAL,
  },
  {
    skillName: "WebSockets",
    iconType: SiSocketdotio,
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
