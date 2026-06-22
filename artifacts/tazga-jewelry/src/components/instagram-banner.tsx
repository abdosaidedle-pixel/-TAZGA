import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { db, isFirestoreAvailable } from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useLanguage } from "@/lib/language-context";

interface InstagramSlide {
  url: string;
  caption?: string;
}

const DEFAULT_SLIDES: InstagramSlide[] = [
  { url: "/images/category-rings.png", caption: "خاتم فرعوني ذهبي" },
  { url: "/images/category-necklaces.png", caption: "قلادة تراثية" },
  { url: "/images/category-bracelets.png", caption: "سوار ذهب خالص" },
  { url: "/images/category-earrings.png", caption: "أقراط كلاسيكية" },
  { url: "/images/category-heritage.png", caption: "مجوهرات مصرية أصيلة" },
  { url: "/images/hero.png", caption: "تازجا — صناعة يدوية" },
];

export function InstagramBanner() {
  const [slides, setSlides] = useState<InstagramSlide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [intervalMs, setIntervalMs] = useState(3500);
  const { t, dir } = useLanguage();

  // Listen to Firestore for admin-controlled banner images
  useEffect(() => {
    if (!isFirestoreAvailable()) {
      // In mock mode, just keep the default slides
      return;
    }
    const unsubscribe = onSnapshot(doc(db, "settings", "instagramBanner"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.slides && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
        if (data.intervalMs) setIntervalMs(data.intervalMs);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, slides.length, intervalMs]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="py-16 border-t border-white/5 relative overflow-hidden" aria-label="Instagram Gallery">
      {/* Jewelry pattern bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e'%3E%3Cpath d='M40 0L50 20L40 40L30 20z'/%3E%3Cpath d='M0 40L20 30L40 40L20 50z'/%3E%3Cpath d='M80 40L60 30L40 40L60 50z'/%3E%3Cpath d='M40 80L30 60L40 40L50 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4 mb-10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-2"
        >
          <a
            href="https://instagram.com/tazgajewelry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <Instagram className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
              @TAZGAJEWELRY
            </span>
          </a>
          <p className="text-muted-foreground text-sm font-serif tracking-widest uppercase mt-1">
            {t("instagram.follow_cta")}
          </p>
          <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Main large featured slide */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 mb-6">
        <div className="relative aspect-[16/7] overflow-hidden border border-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={slides[current]?.url}
              alt={slides[current]?.caption || "TAZGA Instagram"}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </AnimatePresence>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
          {/* Caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-6 left-0 right-0 text-center"
            >
              {slides[current]?.caption && (
                <p className="font-arabic text-white text-lg drop-shadow-lg" dir="rtl">
                  {slides[current].caption}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all"
            aria-label={t("instagram.prev")}
          >
            <ChevronLeft className="h-5 w-5 rtl-flip-x" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all"
            aria-label={t("instagram.next")}
          >
            <ChevronRight className="h-5 w-5 rtl-flip-x" />
          </button>

          {/* Pause/Play */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="absolute top-3 right-3 w-8 h-8 bg-background/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all"
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "bg-primary w-6 h-1.5"
                  : "bg-white/20 w-1.5 h-1.5 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 max-w-5xl mx-auto px-4 scrollbar-hide">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden border-2 transition-all duration-300 ${
              i === current ? "border-primary scale-105" : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={slide.url}
              alt={slide.caption || `Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
