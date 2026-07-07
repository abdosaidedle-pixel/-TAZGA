/**
 * TAZGA Brand Logo — uses the official Hiba Galal logo image.
 *
 * Usage:
 *   <BrandLogo className="h-8 w-8" />           // icon only (square)
 *   <BrandLogo variant="full" className="h-10" /> // includes wordmark + tagline
 *
 * The logo image is a square (828x828) containing:
 *  - A gold calligraphic symbol
 *  - The word "TAZGA" in gold
 *  - Arabic text below
 *  - Deep brown background
 */

interface BrandLogoProps {
  className?: string;
  variant?: "icon" | "full";
}

export function BrandLogo({ className = "h-8 w-8", variant = "icon" }: BrandLogoProps) {
  if (variant === "full") {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        <img
          src="/logo-hiba-galal.jpg"
          alt="TAZGA Jewelry — Hiba Galal Logo"
          className="h-full w-auto object-contain rounded-sm"
          loading="eager"
          fetchPriority="high"
        />
        <div className="flex flex-col leading-none">
          <span className="font-serif font-bold tracking-[0.25em] text-foreground">TAZGA</span>
          <span className="font-arabic text-[8px] text-primary tracking-[0.2em] uppercase mt-0.5">
            هبه جلال
          </span>
        </div>
      </div>
    );
  }

  // Icon only — the square logo (which already contains the brand name in the image)
  return (
    <img
      src="/logo-hiba-galal.jpg"
      alt="TAZGA Jewelry — Hiba Galal Logo"
      className={`${className} object-contain rounded-sm`}
      loading="eager"
      fetchPriority="high"
    />
  );
}
