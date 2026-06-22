import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, type TranslationKey } from "./translations";

type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("tazga-lang") as Language) || "en";
  });

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle("font-arabic", lang === "ar");
    localStorage.setItem("tazga-lang", lang);
  }, [lang, dir]);

  const setLang = (l: Language) => setLangState(l);
  const toggleLanguage = () => setLangState((l) => (l === "ar" ? "en" : "ar"));

  /**
   * Translate a key from the dictionary.
   * Falls back to the key itself if not found (helps debugging).
   */
  const t = (key: TranslationKey | string): string => {
    const entry = (translations as Record<string, { ar: string; en: string }>)[key as string];
    if (!entry) {
      // eslint-disable-next-line no-console
      console.warn(`[i18n] Missing translation: ${key}`);
      return key as string;
    }
    return entry[lang] ?? entry.ar ?? (key as string);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
