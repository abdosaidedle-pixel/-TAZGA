/**
 * TAZGA Brand Logo — uses the official Hiba Galal logo image.
 * Automatically switches between dark and light variants based on the active theme.
 *
 * - "azza-cream" theme (light): uses logo-hiba-galal-light.jpg (white bg + gold)
 * - "light-dark" / "dark" themes: uses logo-hiba-galal.jpg (dark brown bg + gold)
 *
 * Usage:
 *   <BrandLogo className="h-8 w-8" />           // icon only (square)
 *   <BrandLogo variant="full" className="h-10" /> // includes wordmark + tagline
 */

import { useTheme } from "@/lib/theme-context";

interface BrandLogoProps {
  className?: string;
  variant?: "icon" | "full";
}

export function BrandLogo({ className = "h-8 w-8", variant = "icon" }: BrandLogoProps) {
  const { theme } = useTheme();
  const logoSrc = theme === "azza-cream" ? "/logo-hiba-galal-light.jpg" : "/logo-hiba-galal.jpg";
  const isLightTheme = theme === "azza-cream";

  if (variant === "full") {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        <div
          className={`relative h-full aspect-square rounded-sm overflow-hidden border flex-shrink-0 ${
            isLightTheme ? "bg-white border-border" : "bg-secondary border-border"
          }`}
        >
          <img
            src={logoSrc}
            alt="TAZGA Jewelry — Hiba Galal Logo"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-serif font-bold tracking-[0.25em] text-foreground">TAZGA</span>
          <span className="font-arabic text-[8px] text-primary tracking-[0.2em] uppercase mt-0.5">
            هبه جلال
          </span>
        </div>
      </div>
    );
  }

  // Icon only — square container that adapts to theme
  return (
    <div
      className={`relative ${className} rounded-sm overflow-hidden border flex-shrink-0 ${
        isLightTheme ? "bg-white border-border" : "bg-secondary border-border"
      }`}
    >
      <img
        src={logoSrc}
        alt="TAZGA Jewelry — Hiba Galal Logo"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}
