import { useTranslation } from "../../hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto hidden sm:block">
      <div className="max-w-3xl mx-auto border-t border-border/50 py-5 px-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              {t("footer.terms")}
            </a>
            <span className="text-border">|</span>
            <a href="#" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
            <span className="text-border">|</span>
            <a href="#" className="hover:text-foreground transition-colors">
              {t("footer.legal")}
            </a>
          </div>
          <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
