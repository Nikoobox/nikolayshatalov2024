import { COLORS } from "../../theme";

const BORDER_COLORS = [
  COLORS.PURPLE_ACCENT,
  COLORS.GREEN_ACCENT,
  COLORS.TEAL_ACCENT,
  COLORS.YELLOW_ACCENT,
  COLORS.RED_ACCENT,
];

export const getRandomColor = () =>
  BORDER_COLORS[Math.floor(Math.random() * BORDER_COLORS.length)];
