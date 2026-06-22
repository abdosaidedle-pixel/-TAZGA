import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

interface ThemeToggleProps {
  variant?: "compact" | "full";
}

export function ThemeToggle({ variant = "compact" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  if (variant === "full") {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 text-xs tracking-widest font-serif border border-white/20 hover:border-primary text-foreground/70 hover:text-primary transition-all duration-300 px-3 py-1.5"
        title={t("theme.toggle")}
        aria-label={t("theme.toggle")}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">
          {isDark ? t("theme.lightDark") : t("theme.dark")}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-track"
      title={t("theme.toggle")}
      aria-label={t("theme.toggle")}
      role="switch"
      aria-checked={!isDark}
    >
      <span
        className={`theme-toggle-thumb ${!isDark ? "is-active" : ""}`}
      >
        {isDark ? (
          <Moon className="h-2.5 w-2.5" />
        ) : (
          <Sun className="h-2.5 w-2.5" />
        )}
      </span>
    </button>
  );
}
