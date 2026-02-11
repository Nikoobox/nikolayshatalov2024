export interface ProjectProps {
  id: number;
  name: string;
  img: string;
  tools: string[];
  info: string;
  infoLong: string;
  address: string;
  repo: string;
  isResponsive: boolean;
  showLink: boolean;
  showRepo: boolean;
  overview?: string;
  year: number;
  isMainProject: boolean;
  status: string;
}
