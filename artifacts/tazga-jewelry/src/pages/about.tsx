import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { BrandLogo } from "@/components/brand-logo";
import { Check } from "lucide-react";

export default function About() {
  const { lang, t, dir } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div className="min-h-screen pt-24 pb-20" dir={dir}>
      <div className="container mx-auto px-4 md:px-8">

        {/* ─── HERO / TITLE ──────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto text-center mb-20 sm:mb-24">
          {/* Brand logo */}
          <div className="flex justify-center mb-6">
            <BrandLogo className="h-24 w-24 sm:h-32 sm:w-32" />
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
            {isAr ? "تازجا للمجوهرات" : "TAZGA Jewelry"}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl tracking-wider mb-6">
            {t("about.title")}
          </h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-8"></div>
          <p className="font-arabic text-xl sm:text-2xl text-primary mb-8 leading-relaxed" dir="rtl">
            {t("about.tagline")}
          </p>
          <div className="text-muted-foreground font-light text-base sm:text-lg leading-relaxed space-y-4 max-w-3xl mx-auto">
            <p>{t("about.intro_1")}</p>
            <p>{t("about.intro_2")}</p>
          </div>
        </div>

        {/* ─── OUR STORY (3-generation family narrative) ─────────────── */}
        <section className="mb-24 sm:mb-32 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[16/10] sm:aspect-[4/3] bg-secondary p-4 relative overflow-hidden order-1 md:order-1"
            >
              <div className="absolute inset-0 border border-primary/30 m-4 pointer-events-none" />
              <img
                src="/images/workshop.png"
                alt="TAZGA Workshop"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-2"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
                {t("about.story_eyebrow")}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-wider mb-6 leading-tight">
                {isAr ? "من ١٩٣٠ إلى اليوم" : "From 1930 to Today"}
              </h2>
              <div className="space-y-4 text-muted-foreground font-light text-base leading-relaxed">
                <p>{t("about.story_p1")}</p>
                <p>{t("about.story_p2")}</p>
                <p>{t("about.story_p3")}</p>
              </div>
              <p
                className={`mt-8 text-base sm:text-lg text-primary font-serif italic leading-relaxed border-${
                  isAr ? "r" : "l"
                }-2 border-primary ${isAr ? "pr-4" : "pl-4"}`}
                dir={dir}
              >
                {t("about.story_signature")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── ABOUT OUR PRODUCTS (new section) ──────────────────────── */}
        <section className="mb-24 sm:mb-32 bg-card border-y border-border py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
                {t("about.products_eyebrow")}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-wider mb-6">
                {t("about.products_title")}
              </h2>
              <div className="w-12 h-[1px] bg-primary mx-auto"></div>
            </div>

            {/* Intro paragraph */}
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-muted-foreground font-light text-base sm:text-lg leading-relaxed mb-4">
                {t("about.products_intro")}
              </p>
              <p className="text-foreground font-serif italic text-base sm:text-lg leading-relaxed">
                {t("about.products_outro")}
              </p>
            </div>

            {/* Two columns: Excellence & Moments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Crafted with Excellence */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background border border-border p-6 sm:p-8 text-center"
              >
                <h3 className="font-serif text-lg sm:text-xl tracking-wider mb-5 text-primary">
                  {t("about.products.excellence_title")}
                </h3>
                <ul className="space-y-3 text-sm sm:text-base text-muted-foreground font-light">
                  <li className="flex items-start gap-3 text-left rtl:text-right">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span>{t("about.products.excellence_1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-left rtl:text-right">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span>{t("about.products.excellence_2")}</span>
                  </li>
                </ul>
              </motion.div>

              {/* Crafted for Moments */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-background border border-border p-6 sm:p-8 text-center"
              >
                <h3 className="font-serif text-lg sm:text-xl tracking-wider mb-5 text-primary">
                  {t("about.products.moments_title")}
                </h3>
                <ul className="space-y-3 text-sm sm:text-base text-muted-foreground font-light">
                  <li className="flex items-start gap-3 text-left rtl:text-right">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span>{t("about.products.moments_1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-left rtl:text-right">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span>{t("about.products.moments_2")}</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── THE WORKSHOP (legacy content, kept for SEO) ───────────── */}
        <section className="mb-24 sm:mb-32 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: isAr ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-serif mb-3">
                {isAr ? "صناعة يدوية" : "HANDMADE IN CAIRO"}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-wider mb-6">
                {t("about.workshop_title")}
              </h2>
              <div className="space-y-4 text-muted-foreground font-light text-base leading-relaxed">
                <p>{t("about.workshop_p1")}</p>
                <p>{t("about.workshop_p2")}</p>
                <p
                  dir="rtl"
                  className="font-arabic text-lg text-right text-foreground/90 border-r-2 border-primary pr-4 mt-4"
                >
                  {t("about.workshop_p3_ar")}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isAr ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[16/10] sm:aspect-[4/3] bg-secondary p-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 border border-primary/30 m-4 pointer-events-none" />
              <img
                src="/images/workshop.png"
                alt="TAZGA Workshop"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* ─── ARABIC-ONLY "من نحن" SECTION (shown when lang=ar) ─────── */}
        {isAr && (
          <section className="mb-24 sm:mb-32 bg-secondary/40 border border-border py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 text-right" dir="rtl">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-wider mb-3 text-center">
                من نحن
              </h2>
              <div className="w-12 h-[1px] bg-primary mx-auto mb-8"></div>
              <div className="space-y-5 text-muted-foreground font-arabic font-light text-base sm:text-lg leading-relaxed">
                <p>{t("about.ar_about_p1")}</p>
                <p>{t("about.ar_about_p2")}</p>
                <p>{t("about.ar_about_p3")}</p>
                <p>{t("about.ar_about_p4")}</p>
                <p>{t("about.ar_about_p5")}</p>
                <p className="text-primary font-serif text-center text-lg sm:text-xl pt-4">
                  {t("about.ar_about_p6")}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ─── FEATURES (3-column) ──────────────────────────────────── */}
        <section className="border-y border-border py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">
                {t("about.feature_1_title")}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {t("about.feature_1_desc")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">
                {t("about.feature_2_title")}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {t("about.feature_2_desc")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">
                {t("about.feature_3_title")}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {t("about.feature_3_desc")}
              </p>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
