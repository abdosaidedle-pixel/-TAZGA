import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

export default function About() {
  const { lang, t, dir } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div className="min-h-screen pt-24 pb-20" dir={dir}>
      <div className="container mx-auto px-4 md:px-8">

        {/* Intro */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="font-serif text-4xl md:text-6xl tracking-wider mb-6">
            {t("about.title")}
          </h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-8"></div>
          <p className="font-arabic text-2xl text-primary mb-8 leading-relaxed" dir="rtl">
            {t("about.tagline")}
          </p>
          <div className="text-muted-foreground font-light text-lg leading-relaxed space-y-6">
            <p>{t("about.intro_1")}</p>
            <p>{t("about.intro_2")}</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[16/10] sm:aspect-[4/3] bg-secondary p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 border border-primary/20 m-4 pointer-events-none" />
            <img src="/images/workshop.png" alt="TAZGA Workshop" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl tracking-wider mb-6">{t("about.workshop_title")}</h2>
            <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>{t("about.workshop_p1")}</p>
              <p>{t("about.workshop_p2")}</p>
              <p dir="rtl" className="font-arabic text-xl text-right mt-8 border-r-2 border-primary pr-6">
                {t("about.workshop_p3_ar")}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-y border-white/10 py-16">
          <div>
            <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">{t("about.feature_1_title")}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              {t("about.feature_1_desc")}
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">{t("about.feature_2_title")}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              {t("about.feature_2_desc")}
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">{t("about.feature_3_title")}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              {t("about.feature_3_desc")}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
