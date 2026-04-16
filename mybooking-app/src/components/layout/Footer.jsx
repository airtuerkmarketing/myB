import { useTranslation } from "../../hooks/useTranslation";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto">
      <div className="max-w-3xl mx-auto py-4 px-6">
        <Separator className="mb-4" />
        {/* Desktop */}
        <div className="hidden sm:flex justify-between items-center">
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

        {/* Mobile */}
        <div className="sm:hidden text-center space-y-3">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              {t("footer.terms")}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
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
