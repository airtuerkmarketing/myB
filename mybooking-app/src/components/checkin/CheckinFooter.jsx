import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function CheckinFooter({ total, onCheckin, disabled, isProcessing = false }) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        <div>
          <p className="text-xs text-muted-foreground">{t("checkin.total")}</p>
          <p className="text-xl font-bold text-foreground">
            €{total.toFixed(2)}
          </p>
        </div>

        <Button
          disabled={disabled}
          onClick={onCheckin}
          className={cn("rounded-[10px] h-11 px-8 font-semibold")}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Wird bearbeitet...
            </>
          ) : (
            t("checkin.doCheckin")
          )}
        </Button>
      </div>
    </div>
  );
}
