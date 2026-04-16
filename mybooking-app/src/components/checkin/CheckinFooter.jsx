import Button from "../ui/Button";
import { useTranslation } from "../../hooks/useTranslation";

export default function CheckinFooter({ total, onCheckin, disabled }) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:sticky md:bottom-0 z-40 border-t border-gray-100 backdrop-blur-lg bg-white/90">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Total */}
        <div>
          <p className="text-xs text-text-muted">{t("checkin.total")}</p>
          <p className="text-xl font-bold text-text-primary">
            €{total.toFixed(2)}
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          disabled={disabled}
          onClick={onCheckin}
          className={`px-8 ${!disabled ? "animate-shimmer" : ""}`}
        >
          {t("checkin.doCheckin")}
        </Button>
      </div>
    </div>
  );
}
