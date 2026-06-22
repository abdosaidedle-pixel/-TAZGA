import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * TAZGA Theme System — inspired by Azza Fahmy's color palette
 *
 * 3 themes available:
 *  - "dark"        : Ultra-dark luxury (current default, #050505 bg, rose gold accent)
 *  - "light-dark"  : Warm beige-tinted dark (softer dark, easier on eyes)
 *  - "azza-cream"  : Cream white background with gold + navy accents (Azza Fahmy style)
 */
export type Theme = "dark" | "light-dark" | "azza-cream";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  /** Cycle through all themes in order: dark → light-dark → azza-cream → dark */
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "azza-cream",
  setTheme: () => {},
  toggleTheme: () => {},
  cycleTheme: () => {},
});

const THEME_ORDER: Theme[] = ["azza-cream", "light-dark", "dark"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "azza-cream";
    return (localStorage.getItem("tazga-theme") as Theme) || "azza-cream";
  });

  useEffect(() => {
    // Apply the theme class on <html>
    document.documentElement.classList.remove("dark", "light-dark", "azza-cream");
    document.documentElement.classList.add(theme);
    localStorage.setItem("tazga-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () =>
    setThemeState((t) => (t === "dark" ? "azza-cream" : "dark"));

  const cycleTheme = () => {
    setThemeState((current) => {
      const idx = THEME_ORDER.indexOf(current);
      const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
