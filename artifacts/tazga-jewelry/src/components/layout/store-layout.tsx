import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, Search, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { SocialIcons } from "@/components/social-icons";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { cart, wishlist } = useCart();
  const { lang, toggleLanguage, t, dir } = useLanguage();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { nameKey: "nav.shop", href: "/shop" },
    { nameKey: "nav.collections", href: "/collections" },
    { nameKey: "nav.about", href: "/about" },
    { nameKey: "nav.contact", href: "/contact" },
  ];

  // Announcement bar messages (cycle)
  const announcements =
    lang === "ar"
      ? [
          "شحن مجاني للطلبات فوق 500$",
          "صناعة يدوية منذ 1930",
          "إرجاع مجاني خلال 14 يوم",
        ]
      : [
          "Free shipping on orders over $500",
          "Handcrafted since 1930",
          "Complimentary 14-day returns",
        ];
  const [annIdx, setAnnIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setAnnIdx((i) => (i + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(id);
  }, [announcements.length]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground" dir={dir}>
      {/* ─── ANNOUNCEMENT BAR ─── */}
      <div className="bg-secondary text-secondary-foreground text-center text-[11px] tracking-[0.2em] uppercase py-2.5 font-serif">
        <AnimatePresence mode="wait">
          <motion.span
            key={annIdx}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.4 }}
            className="inline-block"
          >
            {announcements[annIdx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ─── HEADER ─── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border py-2 sm:py-3 shadow-sm"
            : "bg-background border-b border-border py-3 sm:py-4"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-3">
          {/* LEFT — mobile hamburger + desktop nav */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1">
            <button
              className="md:hidden text-foreground hover:text-primary transition-colors p-1"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t("common.open_menu")}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <nav className="hidden md:flex items-center gap-4 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase font-serif transition-colors duration-300 relative group ${
                    location === link.href
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {t(link.nameKey)}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 ${
                      location === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTER — Logo (Azza Fahmy style: centered, serif, refined) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
            <div className="header-logo font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.25em] sm:tracking-[0.35em] font-bold text-foreground group-hover:text-primary transition-colors duration-500">
              TAZGA
            </div>
            <div
              className="font-arabic text-[8px] sm:text-[9px] text-primary mt-0.5 tracking-[0.25em] sm:tracking-[0.3em] uppercase"
              dir="rtl"
            >
              {t("brand.tagline")}
            </div>
          </Link>

          {/* RIGHT — Icons + Language toggle + Theme toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-5 flex-1 justify-end">
            {/* Theme toggle */}
            <div className="hide-mobile">
              <ThemeToggle />
            </div>

            {/* Language toggle button */}
            <button
              onClick={toggleLanguage}
              className="text-[10px] sm:text-xs tracking-widest font-serif border border-current/20 hover:border-primary text-foreground/80 hover:text-primary transition-all duration-300 px-2 sm:px-2.5 py-1 hidden md:flex items-center gap-1"
              title={lang === "ar" ? t("lang.switch_hint_en") : t("lang.switch_hint_ar")}
              aria-label={lang === "ar" ? t("lang.switch_hint_en") : t("lang.switch_hint_ar")}
            >
              {lang === "ar" ? t("lang.switch_to_en") : t("lang.switch_to_ar")}
            </button>

            <button
              className="hide-search-mobile text-foreground/80 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <Link
              href="/wishlist"
              className="text-foreground/80 hover:text-primary transition-colors hidden sm:block relative"
              aria-label={t("wishlist.title")}
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="text-foreground/80 hover:text-primary transition-colors relative"
              aria-label={t("cart.title")}
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MOBILE MENU ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl p-6 sm:p-8 overflow-y-auto"
            dir={dir}
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="font-serif text-2xl tracking-[0.35em] font-bold">TAZGA</div>
                <div className="font-arabic text-xs text-primary mt-1 tracking-widest" dir="rtl">
                  {t("brand.tagline")}
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground/60 hover:text-primary transition-colors"
                aria-label={t("common.close")}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-5 mb-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-serif tracking-[0.15em] hover:text-primary transition-colors block uppercase"
                  >
                    {t(link.nameKey)}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile controls */}
            <div className="flex flex-col gap-4 mb-10 pb-10 border-b border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-serif text-muted-foreground">
                  {t("theme.toggle")}
                </span>
                <ThemeToggle variant="full" />
              </div>
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="border border-current/20 hover:border-primary text-foreground/80 hover:text-primary transition-all px-6 py-3 font-serif tracking-widest text-sm"
              >
                {lang === "ar" ? t("lang.switch_hint_en") : t("lang.switch_hint_ar")}
              </button>
            </div>

            {/* Mobile social icons */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest font-serif text-muted-foreground mb-4 text-center">
                {t("footer.follow_us")}
              </p>
              <SocialIcons size="md" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1">{children}</main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-secondary text-secondary-foreground pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12 md:mb-16">
            <div className="col-span-2 sm:col-span-2 md:col-span-2">
              <h3 className="font-serif text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.35em] mb-2 text-secondary-foreground">
                TAZGA
              </h3>
              <p className="font-arabic text-xs sm:text-sm text-primary mb-3 sm:mb-4" dir="rtl">
                {t("brand.tagline")}
              </p>
              <p className="text-secondary-foreground/80 max-w-sm font-light leading-relaxed text-xs sm:text-sm">
                {t("footer.about")}
              </p>

              {/* Social icons in footer brand column */}
              <div className="mt-5 sm:mt-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest font-serif text-secondary-foreground/60 mb-3">
                  {t("footer.follow_us")}
                </p>
                <SocialIcons variant="footer" size="sm" />
              </div>
            </div>

            <div>
              <h4 className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 sm:mb-5 md:mb-6 text-secondary-foreground">
                {t("footer.links")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-secondary-foreground/80 font-light text-xs sm:text-sm">
                <li><Link href="/shop" className="hover:text-primary transition-colors">{t("nav.shop")}</Link></li>
                <li><Link href="/collections" className="hover:text-primary transition-colors">{t("nav.collections")}</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">{t("nav.about")}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">{t("nav.contact")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 sm:mb-5 md:mb-6 text-secondary-foreground">
                {t("footer.client_care")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-secondary-foreground/80 font-light text-xs sm:text-sm">
                <li><Link href="/faq" className="hover:text-primary transition-colors">{t("footer.faq")}</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">{t("footer.shipping")}</Link></li>
                <li><Link href="/care" className="hover:text-primary transition-colors">{t("footer.care")}</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-5 sm:pt-6 md:pt-8 border-t border-secondary-foreground/10 text-[10px] sm:text-xs text-secondary-foreground/70 gap-3 sm:gap-4">
            <p className="text-center md:text-left">© {new Date().getFullYear()} TAZGA Jewelry. {t("footer.rights")}</p>
            <div className="flex gap-4 md:gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
