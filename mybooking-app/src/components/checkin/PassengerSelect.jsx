import { Check } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function getInitials(firstName, lastName) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function CheckboxCircle({ checked }) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
        checked
          ? "bg-primary border-primary"
          : "bg-background border-border"
      )}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </div>
  );
}

export default function PassengerSelect({ passengers, selectedPassengers, onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-foreground">
        {t("checkin.whosFlying")}
      </h2>
      <Separator className="mt-3" />

      {passengers.map((p) => {
        const isSelected = selectedPassengers.includes(p.id);
        return (
          <button
            key={p.id}
            onClick={() => onToggle(p.id)}
            className={cn(
              "w-full flex items-center gap-3 py-4 border-b border-border/30 cursor-pointer transition-all duration-150 text-left",
              isSelected && "bg-primary/[0.03] rounded-xl px-3 -mx-3"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                {getInitials(p.firstName, p.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {p.firstName} {p.lastName}
              </p>
              <div className="flex items-center gap-2">
                {p.seat ? (
                  <span className="text-xs text-muted-foreground">
                    Seat {p.seat}
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-amber-600">
                      Kein Sitz
                    </span>
                    <span className="text-xs text-muted-foreground">—</span>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      {t("checkin.chooseSeat")}
                    </button>
                  </>
                )}
              </div>
            </div>

            <CheckboxCircle checked={isSelected} />
          </button>
        );
      })}
    </div>
  );
}
