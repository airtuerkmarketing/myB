import { useTranslation } from "../../hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto">
      <div className="max-w-3xl mx-auto border-t border-gray-200 py-4 px-6">
        {/* Desktop */}
        <div className="hidden sm:flex justify-between items-center">
          <div className="flex gap-4 text-xs text-text-muted">
            <a href="#" className="hover:text-gray-600 transition-colors">
              {t("footer.terms")}
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-gray-600 transition-colors">
              {t("footer.privacy")}
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-gray-600 transition-colors">
              {t("footer.legal")}
            </a>
          </div>
          <p className="text-xs text-text-muted">{t("footer.copyright")}</p>
        </div>

        {/* Mobile */}
        <div className="sm:hidden text-center pt-2 space-y-3">
          <div className="flex flex-col gap-2 text-xs text-text-muted">
            <a href="#" className="hover:text-gray-600 transition-colors">
              {t("footer.terms")}
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              {t("footer.legal")}
            </a>
          </div>
          <p className="text-xs text-text-muted">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
