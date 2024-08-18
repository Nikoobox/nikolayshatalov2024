import {
  createContext,
  useContext,
  FC,
  PropsWithChildren,
  useState,
} from "react";

import { createTheme, Theme } from "@mui/material/styles";

import { useCustomTheme } from "./useCustomTheme";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
  isResumeModalOpen: boolean;
  toggleResumeModal: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  theme: createTheme(),
  isResumeModalOpen: false,
  toggleResumeModal: () => {},
});

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const value = useCustomTheme();

  const toggleResumeModal = () => setIsResumeModalOpen((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{ ...value, isResumeModalOpen, toggleResumeModal }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
