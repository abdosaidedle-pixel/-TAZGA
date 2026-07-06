/**
 * TAZGA Brand Logo — elegant monogram "T" with a gem/diamond accent.
 * Pure SVG, scales perfectly at any size, theme-aware (uses currentColor).
 *
 * Usage:
 *   <BrandLogo className="h-8 w-8" />
 *   <BrandLogo variant="full" className="h-10" />  // includes wordmark
 */

interface BrandLogoProps {
  className?: string;
  variant?: "icon" | "full";
}

export function BrandLogo({ className = "h-8 w-8", variant = "icon" }: BrandLogoProps) {
  if (variant === "full") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <BrandLogoIcon className="h-full w-auto" />
        <div className="flex flex-col leading-none">
          <span className="font-serif font-bold tracking-[0.25em] text-foreground">TAZGA</span>
          <span className="font-arabic text-[8px] text-primary tracking-[0.2em] uppercase mt-0.5">
            هبه جلال
          </span>
        </div>
      </div>
    );
  }

  return <BrandLogoIcon className={className} />;
}

function BrandLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {/* Outer hexagon frame — like a gem setting */}
      <path
        d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z"
        strokeWidth="1.5"
        className="text-primary"
        stroke="currentColor"
        fill="none"
      />

      {/* Inner diamond shape — represents a gem */}
      <path
        d="M32 14 L46 32 L32 50 L18 32 Z"
        strokeWidth="1"
        className="text-primary/60"
        stroke="currentColor"
        fill="none"
      />

      {/* Letter T — the monogram */}
      <path
        d="M22 24 L42 24 M32 24 L32 44"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-foreground"
        stroke="currentColor"
        fill="none"
      />

      {/* Small accent dot at bottom — like a gem sparkle */}
      <circle cx="32" cy="50" r="1.5" className="text-primary" fill="currentColor" stroke="none" />
    </svg>
  );
}
