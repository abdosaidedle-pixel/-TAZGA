import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function NotFound() {
  const { t, dir } = useLanguage();
  return (
    <div className="min-h-screen w-full flex items-center justify-center" dir={dir}>
      <div className="max-w-md mx-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-serif tracking-wider mb-2">404</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t("common.loading") === "جارٍ التحميل..."
            ? "عذراً، الصفحة التي تبحث عنها غير موجودة."
            : "Sorry, the page you are looking for could not be found."}
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 font-serif tracking-widest text-xs uppercase hover:bg-primary/90 transition-colors"
        >
          {t("common.loading") === "جارٍ التحميل..." ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
