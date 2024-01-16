import { createContext, useContext, FC, PropsWithChildren } from "react";

import { createTheme, Theme } from "@mui/material/styles";

import { useDarkTheme } from "./useDarkTheme";

interface ThemeContextProps {
  mode: string;
  toggleDarkMode: () => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  toggleDarkMode: () => {},
  theme: createTheme(),
});

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useDarkTheme();

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
