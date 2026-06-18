import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, Search, X, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { cart, wishlist } = useCart();
  const { lang, toggleLanguage, t } = useLanguage();

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
    { name: "Shop", nameAr: "المتجر", href: "/shop" },
    { name: "Collections", nameAr: "المجموعات", href: "/collections" },
    { name: "About", nameAr: "عن تازجا", href: "/about" },
    { name: "Contact", nameAr: "تواصل معنا", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* ─── HEADER ─── */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled || location !== "/"
            ? "bg-background/95 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* LEFT — mobile hamburger + desktop nav */}
          <div className="flex items-center gap-6">
            <button
              className="md:hidden text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-[0.2em] uppercase font-serif transition-colors duration-300 ${
                    location === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {lang === "ar" ? link.nameAr : link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTER — Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
            <div className="font-serif text-2xl md:text-3xl tracking-[0.25em] font-bold text-foreground group-hover:text-primary transition-colors duration-500">
              TAZGA
            </div>
            <div className="font-arabic text-[10px] text-primary mt-0.5 tracking-widest" dir="rtl">
              هبة جبلي للحلي والمجوهرات
            </div>
          </Link>

          {/* RIGHT — Icons + Language toggle */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* Language toggle button */}
            <button
              onClick={toggleLanguage}
              className="text-xs tracking-widest font-serif border border-white/20 hover:border-primary text-foreground/70 hover:text-primary transition-all duration-300 px-2.5 py-1 hidden md:flex items-center gap-1"
              title={lang === "ar" ? "Switch to English" : "التحويل للعربية"}
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>

            <button className="text-foreground/70 hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist" className="text-foreground/70 hover:text-primary transition-colors hidden md:block relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="text-foreground/70 hover:text-primary transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
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
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="font-serif text-2xl tracking-[0.25em] font-bold">TAZGA</div>
                <div className="font-arabic text-xs text-primary mt-1" dir="rtl">هبة جبلي للحلي والمجوهرات</div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-foreground/60 hover:text-primary transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mb-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-serif tracking-wider hover:text-primary transition-colors block"
                  >
                    {lang === "ar" ? link.nameAr : link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile language toggle */}
            <button
              onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
              className="border border-white/20 hover:border-primary text-foreground/70 hover:text-primary transition-all px-6 py-3 font-serif tracking-widest text-sm"
            >
              {lang === "ar" ? "Switch to English" : "التحويل للعربية"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1">{children}</main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-card border-t border-border pt-20 pb-10 relative overflow-hidden">
        {/* Jewelry bg decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", backgroundSize: "60px 60px" }}
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-serif text-2xl tracking-[0.25em] mb-2 text-foreground">TAZGA</h3>
              <p className="font-arabic text-sm text-primary mb-4" dir="rtl">هبة جبلي للحلي والمجوهرات</p>
              <p className="text-muted-foreground max-w-sm font-light leading-relaxed text-sm">
                {t(
                  "معرض مجوهرات مصري رقمي حيث تلتقي 90 عامًا من الحرفية اليدوية بالفخامة العصرية. كل قطعة تحكي قصة.",
                  "A digital Egyptian jewelry gallery where 90 years of handcraft meets modern luxury. Every piece tells a story."
                )}
              </p>
              <a
                href="https://instagram.com/tazgajewelry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors text-sm font-serif tracking-widest"
              >
                <Instagram className="h-4 w-4" />
                @TAZGAJEWELRY
              </a>
            </div>

            <div>
              <h4 className="font-serif text-sm tracking-[0.2em] uppercase mb-6 text-foreground">
                {t("روابط", "Links")}
              </h4>
              <ul className="space-y-4 text-muted-foreground font-light text-sm">
                <li><Link href="/shop" className="hover:text-primary transition-colors">{t("المتجر", "Shop")}</Link></li>
                <li><Link href="/collections" className="hover:text-primary transition-colors">{t("المجموعات", "Collections")}</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">{t("عن تازجا", "Our Heritage")}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">{t("تواصل معنا", "Contact")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-sm tracking-[0.2em] uppercase mb-6 text-foreground">
                {t("خدمة العملاء", "Client Care")}
              </h4>
              <ul className="space-y-4 text-muted-foreground font-light text-sm">
                <li><Link href="/faq" className="hover:text-primary transition-colors">{t("الأسئلة الشائعة", "FAQ")}</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">{t("الشحن والإرجاع", "Shipping & Returns")}</Link></li>
                <li><Link href="/care" className="hover:text-primary transition-colors">{t("العناية بالمجوهرات", "Jewelry Care")}</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-muted-foreground gap-4">
            <p>© {new Date().getFullYear()} TAZGA Jewelry. {t("جميع الحقوق محفوظة.", "All rights reserved.")}</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">{t("سياسة الخصوصية", "Privacy Policy")}</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">{t("شروط الخدمة", "Terms of Service")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}