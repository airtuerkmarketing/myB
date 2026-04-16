import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function CheckinFooter({ total, onCheckin, disabled, isProcessing = false }) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:sticky md:bottom-0 z-40 border-t border-border backdrop-blur-lg bg-card/90">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div>
          <p className="text-xs text-muted-foreground">{t("checkin.total")}</p>
          <p className="text-xl font-bold text-foreground">
            €{total.toFixed(2)}
          </p>
        </div>

        <Button
          size="lg"
          disabled={disabled}
          onClick={onCheckin}
          className={cn(
            "px-8 rounded-xl font-semibold",
            !disabled && !isProcessing && "animate-shimmer"
          )}
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
