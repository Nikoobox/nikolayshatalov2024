export interface ProjectProps {
  id: number;
  name: string;
  img: string;
  imgLanding?: string;
  tools: string[];
  info: string;
  infoLong?: string;
  address: string;
  repo: string;
  isResponsive: boolean;
  showLink: boolean;
  showRepo: boolean;
  overview?: string;
  year: number;
  isMainProject: boolean;
  isFeatured?: boolean;
  status: string;
  statusSimple: string;
  techDescription: string;
  learningGoal?: string;
}
