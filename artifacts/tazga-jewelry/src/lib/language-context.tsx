import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (ar: string, en: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  toggleLanguage: () => {},
  t: (ar) => ar,
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("tazga-lang") as Language) || "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("tazga-lang", lang);
  }, [lang, dir]);

  const toggleLanguage = () => setLang((l) => (l === "ar" ? "en" : "ar"));

  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
