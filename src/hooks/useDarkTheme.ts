import { useTheme } from "@mui/material/styles";

const useDarkTheme = () => {
  const theme = useTheme();
  return theme.palette.mode === "dark";
};

export default useDarkTheme;
