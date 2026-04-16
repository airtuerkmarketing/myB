import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import { useTranslation } from "../../hooks/useTranslation";

export default function CheckinFooter({ total, onCheckin, disabled, isProcessing = false }) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:sticky md:bottom-0 z-40 border-t border-gray-100 dark:border-gray-800 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Total */}
        <div>
          <p className="text-xs text-text-muted">{t("checkin.total")}</p>
          <p className="text-xl font-bold text-text-primary dark:text-gray-100">
            €{total.toFixed(2)}
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          disabled={disabled}
          onClick={onCheckin}
          className={`px-8 ${!disabled && !isProcessing ? "animate-shimmer" : ""}`}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Wird verarbeitet...
            </>
          ) : (
            t("checkin.doCheckin")
          )}
        </Button>
      </div>
    </div>
  );
}
