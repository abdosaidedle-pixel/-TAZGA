import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import type { Theme } from "@/lib/theme-context";

const THEME_LABELS: Record<Theme, { ar: string; en: string; icon: React.ComponentType<{ className?: string }> }> = {
  "azza-cream": { ar: "كريمي", en: "Cream", icon: Palette },
  "light-dark": { ar: "غامق خفيف", en: "Light Dark", icon: Sun },
  "dark": { ar: "غامق", en: "Dark", icon: Moon },
};

interface ThemeToggleProps {
  variant?: "compact" | "full";
}

export function ThemeToggle({ variant = "compact" }: ThemeToggleProps) {
  const { theme, cycleTheme } = useTheme();
  const { t } = useLanguage();

  const current = THEME_LABELS[theme];
  const Icon = current.icon;

  if (variant === "full") {
    return (
      <button
        onClick={cycleTheme}
        className="flex items-center gap-2 text-xs tracking-widest font-serif border border-current/20 hover:border-primary text-foreground/70 hover:text-primary transition-all duration-300 px-3 py-1.5"
        title={`${t("theme.toggle")} — ${current.en}`}
        aria-label={`${t("theme.toggle")} — ${current.en}`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{current.en}</span>
      </button>
    );
  }

  // Compact: a small square icon button that cycles through themes
  return (
    <button
      onClick={cycleTheme}
      className="h-8 w-8 flex items-center justify-center border border-current/20 hover:border-primary text-foreground/80 hover:text-primary transition-all duration-300 rounded-full"
      title={`${t("theme.toggle")} — ${current.en} (${current.ar})`}
      aria-label={`${t("theme.toggle")} — ${current.en}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
