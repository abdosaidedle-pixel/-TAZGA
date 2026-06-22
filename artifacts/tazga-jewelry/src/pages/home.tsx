import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Truck, ShieldCheck, Gem, RefreshCw, Lock, ArrowRight, Heart, ShoppingBag, Star, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { productsService } from "@/lib/services/products.service";
import { collectionsService } from "@/lib/services/collections.service";
import { settingsService } from "@/lib/services/settings.service";
import { db, isFirestoreAvailable } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Product, Collection, HomepageSettings } from "@/lib/types";
import { InstagramBanner } from "@/components/instagram-banner";
import { useRealtimeDataWithDefault } from "@/hooks/use-realtime-data";

// ── Hero slides (Azza Fahmy style — full-width rotating banners) ──────────
const HERO_SLIDES = [
  {
    image: "/images/hero.png",
    eyebrow_en: "The Heritage Collection",
    eyebrow_ar: "مجموعة التراث",
    title_en: "Craftsmanship Across Generations",
    title_ar: "حرفية تمتد عبر الأجيال",
    cta_en: "Discover the Collection",
    cta_ar: "اكتشف المجموعة",
    link: "/collections/heritage",
  },
  {
    image: "/images/category-rings.png",
    eyebrow_en: "Signature Rings",
    eyebrow_ar: "خواتم مميزة",
    title_en: "Every Piece Tells a Story",
    title_ar: "كل قطعة تحكي قصة",
    cta_en: "Shop Rings",
    cta_ar: "تسوق الخواتم",
    link: "/collections/rings",
  },
  {
    image: "/images/category-necklaces.png",
    eyebrow_en: "Handcrafted Necklaces",
    eyebrow_ar: "قلائد مصنوعة يدوياً",
    title_en: "Wearable Art from Cairo",
    title_ar: "فن قابل للارتداء من القاهرة",
    cta_en: "Shop Necklaces",
    cta_ar: "تسوق القلائد",
    link: "/collections/necklaces",
  },
];

export default function Home() {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const { toast } = useToast();
  const { lang, t, dir } = useLanguage();

  const [email, setEmail] = useState("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  // ─── Real-time subscriptions: admin edits appear instantly for all users ───
  const { data: featuredProducts } = useRealtimeDataWithDefault<Product[]>(
    (cb) => productsService.subscribeAll((products) => {
      cb(products.filter((p) => p.isFeatured && p.inStock).slice(0, 8));
    }),
    [],
    []
  );

  const { data: dbCollections } = useRealtimeDataWithDefault<Collection[]>(
    (cb) => collectionsService.subscribeAll(cb),
    [],
    []
  );

  const { data: homeSettings } = useRealtimeDataWithDefault<Partial<HomepageSettings>>(
    (cb) => settingsService.subscribeHomepage(cb),
    [],
    {}
  );

  // Hero slideshow
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // Featured products carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmittingNewsletter(true);
    try {
      if (isFirestoreAvailable()) {
        await addDoc(collection(db, "newsletter"), {
          email: email.trim().toLowerCase(),
          createdAt: serverTimestamp(),
        });
      }
      toast({ title: t("home.newsletter.success_title"), description: t("home.newsletter.success_body") });
      setEmail("");
    } catch (err) {
      toast({ title: t("home.newsletter.fail_title"), description: String(err), variant: "destructive" });
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({ title: t("home.product.added_to_cart"), description: `${product.name} ${t("home.product.added_desc")}` });
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: t("home.product.removed_from_wishlist") });
    } else {
      addToWishlist(product);
      toast({ title: t("home.product.added_to_wishlist") });
    }
  };

  const trustIndicators = [
    { icon: Truck, key: "home.trust.fast_shipping" },
    { icon: ShieldCheck, key: "home.trust.quality_guarantee" },
    { icon: Gem, key: "home.trust.handcrafted" },
    { icon: RefreshCw, key: "home.trust.easy_returns" },
    { icon: Lock, key: "home.trust.secure_payment" },
  ] as const;

  const staticCollections = [
    { name: "Rings", nameAr: "خواتم", coverImage: "/images/category-rings.png", slug: "rings" },
    { name: "Necklaces", nameAr: "قلائد", coverImage: "/images/category-necklaces.png", slug: "necklaces" },
    { name: "Bracelets", nameAr: "أساور", coverImage: "/images/category-bracelets.png", slug: "bracelets" },
    { name: "Earrings", nameAr: "أقراط", coverImage: "/images/category-earrings.png", slug: "earrings" },
    { name: "Heritage", nameAr: "تراث", coverImage: "/images/category-heritage.png", slug: "heritage" },
  ];
  const displayCollections = dbCollections.length > 0 ? dbCollections : staticCollections;

  const reviews = [
    { id: 1, rating: 5, titleKey: "review.1.title", bodyKey: "review.1.body", customerName: "Farida K." },
    { id: 2, rating: 5, titleKey: "review.2.title", bodyKey: "review.2.body", customerName: "Sherif A." },
    { id: 3, rating: 5, titleKey: "review.3.title", bodyKey: "review.3.body", customerName: "Laila M." },
  ];

  const slide = HERO_SLIDES[currentSlide];
  const isAr = lang === "ar";

  return (
    <div className="w-full overflow-hidden bg-background text-foreground" dir={dir}>
      {/* ─── HERO SLIDESHOW (Azza Fahmy style) ──────────────────────────── */}
      <section className="relative h-[70vh] min-h-[440px] sm:h-[80vh] md:h-[88vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={isAr ? slide.title_ar : slide.title_en}
              className="w-full h-full object-cover"
              fetchPriority={currentSlide === 0 ? "high" : "low"}
              loading={currentSlide === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] text-primary font-serif mb-3 sm:mb-4">
                {isAr ? slide.eyebrow_ar : slide.eyebrow_en}
              </p>
              <h1
                className={`hero-title font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6 sm:mb-8 text-foreground ${
                  isAr ? "font-arabic" : ""
                }`}
                dir={isAr ? "rtl" : "ltr"}
              >
                {isAr ? slide.title_ar : slide.title_en}
              </h1>
              <Link
                href={slide.link}
                className="hero-cta inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 md:px-10 py-3 sm:py-4 uppercase tracking-[0.2em] text-xs sm:text-sm transition-all duration-300 font-serif group"
              >
                {isAr ? slide.cta_ar : slide.cta_en}
                <ArrowRight className="h-4 w-4 rtl-flip-x group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-10">
          <button
            onClick={() => setCurrentSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="h-8 w-8 sm:h-10 sm:w-10 border border-current/30 hover:border-primary hover:text-primary text-foreground/70 transition-all flex items-center justify-center rounded-full bg-background/40 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rtl-flip-x" />
          </button>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? "bg-primary w-6 sm:w-10" : "bg-foreground/30 w-3 sm:w-4 hover:bg-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <button
            onClick={() => setCurrentSlide((s) => (s + 1) % HERO_SLIDES.length)}
            className="h-8 w-8 sm:h-10 sm:w-10 border border-current/30 hover:border-primary hover:text-primary text-foreground/70 transition-all flex items-center justify-center rounded-full bg-background/40 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 rtl-flip-x" />
          </button>
        </div>
      </section>

      {/* ─── TRUST BAR ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className="trust-bar-item flex flex-col items-center gap-2 text-foreground/80 hover:text-primary transition-colors min-w-[100px]"
              >
                <indicator.icon className="h-5 w-5 stroke-[1.5]" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-center font-serif">
                  {t(indicator.key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COLLECTIONS GRID (Azza Fahmy style) ───────────────────────── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
              {isAr ? "استكشف عالم تازجا" : "Explore the World of TAZGA"}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] mb-4">
              {t("home.collections.title")}
            </h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              {t("home.collections.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {displayCollections.map((col, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                className="group relative aspect-[3/4] overflow-hidden border border-border"
              >
                <Link href={`/collections/${col.slug}`} className="block w-full h-full">
                  <img
                    src={col.coverImage || "/images/category-rings.png"}
                    alt={isAr ? (col.nameAr || col.name) : col.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
                  <div className="absolute bottom-0 w-full p-3 sm:p-4 md:p-5 text-center">
                    <h3 className="font-serif text-sm sm:text-base md:text-lg tracking-wider mb-1 text-foreground">
                      {isAr ? (col.nameAr || col.name) : col.name}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {isAr ? "اكتشف" : "Discover"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS CAROUSEL ─────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-card border-y border-border">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
                  {isAr ? "قطع مختارة" : "Curated Pieces"}
                </p>
                <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] mb-2">
                  {t("home.bestsellers.title")}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  {t("home.bestsellers.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={scrollPrev}
                  className="h-10 w-10 border border-border hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4 rtl-flip-x" />
                </button>
                <button
                  onClick={scrollNext}
                  className="h-10 w-10 border border-border hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4 rtl-flip-x" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-[0_0_70%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] min-w-0 pl-3 sm:pl-4"
                  >
                    <div className="group">
                      <div className="relative aspect-[3/4] bg-secondary mb-3 sm:mb-4 overflow-hidden border border-border">
                        <img
                          src={product.images?.[0] || "/images/category-rings.png"}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="product-card-actions absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2">
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className={`h-9 w-9 sm:h-10 sm:w-10 bg-background/90 backdrop-blur-md flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors ${
                              isInWishlist(product.id) ? "text-primary" : ""
                            }`}
                            aria-label={t("home.product.added_to_wishlist")}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-primary" : ""}`} />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="h-9 sm:h-10 px-4 sm:px-5 bg-primary text-primary-foreground font-serif tracking-[0.15em] text-[10px] sm:text-xs uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            {t("home.product.add")}
                          </button>
                        </div>
                      </div>
                      <div className="text-center">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="font-serif text-xs sm:text-sm md:text-base tracking-wide hover:text-primary transition-colors line-clamp-1 block mb-1"
                        >
                          {product.name}
                        </Link>
                        {product.nameAr && (
                          <p className="font-arabic text-[10px] sm:text-xs text-muted-foreground mb-1" dir="rtl">
                            {product.nameAr}
                          </p>
                        )}
                        <p className="text-primary font-medium text-xs sm:text-sm tracking-wide">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-serif border-b border-primary pb-1 text-foreground hover:text-primary transition-colors group"
              >
                {t("home.bestsellers.view_all")}
                <ArrowRight className="h-4 w-4 rtl-flip-x group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── BRAND STORY ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: isAr ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-[4/5] overflow-hidden p-3 sm:p-4">
                <div className="absolute inset-0 border border-primary/40 m-3 sm:m-4" />
                <img
                  src="/images/workshop.png"
                  alt="TAZGA Workshop"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isAr ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
                {isAr ? "منذ 1930" : "Since 1930"}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] mb-8 leading-tight">
                {t("home.story.title")}
              </h2>
              <div className="space-y-5 text-muted-foreground font-light text-base leading-relaxed mb-10">
                <p>{t("home.story.body_en")}</p>
                <p dir="rtl" className="font-arabic text-lg text-right text-foreground/90 border-r-2 border-primary pr-4">
                  {t("home.story.body_ar")}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center border-t border-border pt-8">
                <div>
                  <div className="text-3xl md:text-4xl font-serif text-primary mb-1">90+</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-serif">
                    {t("home.story.stat_years")}
                  </div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-serif text-primary mb-1">50K+</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-serif">
                    {t("home.story.stat_clients")}
                  </div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-serif text-primary mb-1">20K+</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-serif">
                    {t("home.story.stat_pieces")}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────── */}
      {(!homeSettings || homeSettings.showTestimonials !== false) && (
        <section className="py-20 md:py-28 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
              {isAr ? "آراء عملائنا" : "Client Words"}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.1em] mb-4">
              {t("home.testimonials.title")}
            </h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mb-14" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-background/60 border border-border p-8 flex flex-col items-center text-foreground"
                >
                  <div className="flex gap-1 text-primary mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-primary" : "text-muted"}`} />
                    ))}
                  </div>
                  <h3 className="font-serif text-base mb-3">{t(review.titleKey)}</h3>
                  <p className="text-muted-foreground font-light text-sm italic mb-6 flex-1 leading-relaxed" dir={isAr ? "rtl" : "ltr"}>
                    &ldquo;{t(review.bodyKey)}&rdquo;
                  </p>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/80 font-serif">
                    — {review.customerName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── INSTAGRAM BANNER ────────────────────────────────────────── */}
      <InstagramBanner />

      {/* ─── NEWSLETTER ──────────────────────────────────────────────── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-5 stroke-[1.5]" />
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
              {isAr ? "نشرة تازجا" : "TAZGA Newsletter"}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl tracking-[0.1em] mb-4">
              {t("home.newsletter.title")}
            </h2>
            <p className="text-muted-foreground mb-8 font-light text-sm md:text-base max-w-md mx-auto">
              {t("home.newsletter.body")}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t("home.newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border h-12 rounded-none focus-visible:ring-primary focus-visible:border-primary text-center sm:text-left font-serif"
              />
              <Button
                type="submit"
                disabled={submittingNewsletter}
                className="h-12 px-8 rounded-none bg-primary text-primary-foreground font-serif tracking-[0.2em] text-xs uppercase hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                {submittingNewsletter ? t("home.newsletter.subscribing") : t("home.newsletter.subscribe")}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
