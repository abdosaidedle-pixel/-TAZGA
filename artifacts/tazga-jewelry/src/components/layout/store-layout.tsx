import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { cart, wishlist } = useCart();

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
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled || location !== "/"
            ? "bg-background/90 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-wider uppercase text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.2em] font-bold text-foreground">
              TAZGA
            </h1>
            <p className="font-arabic text-xs text-primary mt-1 tracking-widest" dir="rtl">
              هبة جبلي للحلي والمجوهرات
            </p>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-foreground hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist" className="text-foreground hover:text-primary transition-colors hidden md:block relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-serif">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="text-foreground hover:text-primary transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-serif">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-[60] bg-background p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-serif text-2xl tracking-[0.2em]">TAZGA</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-serif tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-t border-border pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-serif text-2xl tracking-[0.2em] mb-4">TAZGA</h3>
              <p className="text-muted-foreground max-w-sm font-light leading-relaxed">
                A digital Egyptian jewelry gallery where 90 years of handcraft meets modern luxury. Every pixel, like every piece, feels like polished gold.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-6 tracking-wider">LINKS</h4>
              <ul className="space-y-4 text-muted-foreground font-light text-sm">
                <li><Link href="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
                <li><Link href="/collections" className="hover:text-primary transition-colors">Collections</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">Our Heritage</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-6 tracking-wider">CLIENT CARE</h4>
              <ul className="space-y-4 text-muted-foreground font-light text-sm">
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/care" className="hover:text-primary transition-colors">Jewelry Care</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TAZGA Jewelry. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}