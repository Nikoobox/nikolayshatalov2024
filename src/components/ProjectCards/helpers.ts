import { COLORS } from "../../theme";

const BORDER_COLORS = [
  COLORS.PURPLE_ACCENT,
  COLORS.GREEN_ACCENT,
  COLORS.TEAL_ACCENT,
  COLORS.YELLOW_ACCENT,
  COLORS.RED_ACCENT,
];

// random border color that never repeats the previous pick
export const getNextColor = (previous?: string) => {
  const options = BORDER_COLORS.filter((color) => color !== previous);
  return options[Math.floor(Math.random() * options.length)];
};
