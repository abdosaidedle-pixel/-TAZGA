import { Instagram, Facebook, Twitter, MessageCircle, Youtube } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface SocialLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelEn: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://instagram.com/tazgajewelry",
    icon: Instagram,
    label: "إنستجرام",
    labelEn: "Instagram",
  },
  {
    href: "https://facebook.com/tazga",
    icon: Facebook,
    label: "فيسبوك",
    labelEn: "Facebook",
  },
  {
    href: "https://twitter.com/tazga",
    icon: Twitter,
    label: "تويتر",
    labelEn: "Twitter",
  },
  {
    href: "https://wa.me/201112098688",
    icon: MessageCircle,
    label: "واتساب",
    labelEn: "WhatsApp",
  },
  {
    href: "https://youtube.com/@tazgajewelry",
    icon: Youtube,
    label: "يوتيوب",
    labelEn: "YouTube",
  },
];

interface SocialIconsProps {
  variant?: "footer" | "header";
  size?: "sm" | "md" | "lg";
}

export function SocialIcons({
  variant = "footer",
  size = "md",
}: SocialIconsProps) {
  const { lang } = useLanguage();

  const sizeClasses = {
    sm: {
      box: "h-9 w-9",
      icon: "h-4 w-4",
    },
    md: {
      box: "h-11 w-11",
      icon: "h-5 w-5",
    },
    lg: {
      box: "h-12 w-12",
      icon: "h-5 w-5",
    },
  }[size];

  const variantClasses = {
    footer: "border-white/10 hover:border-primary hover:text-primary hover:bg-primary/10",
    header: "border-white/20 hover:border-primary hover:text-primary",
  }[variant];

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
      role="navigation"
      aria-label={lang === "ar" ? "روابط التواصل الاجتماعي" : "Social media links"}
    >
      {SOCIAL_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === "ar" ? link.label : link.labelEn}
            title={lang === "ar" ? link.label : link.labelEn}
            className={`social-icon flex items-center justify-center ${sizeClasses.box} ${variantClasses} border text-foreground/70 rounded-full backdrop-blur-sm`}
          >
            <Icon className={sizeClasses.icon} />
          </a>
        );
      })}
    </div>
  );
}
