import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light-dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("tazga-theme") as Theme) || "dark";
  });

  useEffect(() => {
    // Apply the theme class on <html>
    document.documentElement.classList.remove("dark", "light-dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("tazga-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () =>
    setThemeState((t) => (t === "dark" ? "light-dark" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
