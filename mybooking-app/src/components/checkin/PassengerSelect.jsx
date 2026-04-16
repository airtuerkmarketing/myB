import { Check } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
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
          : "bg-card border-border"
      )}
    >
      {checked && <Check size={14} className="text-primary-foreground" strokeWidth={3} />}
    </div>
  );
}

export default function PassengerSelect({ passengers, selectedPassengers, onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-foreground">
        {t("checkin.whosFlying")}
      </h2>
      <div className="border-t border-border/50 mt-3">
        {passengers.map((p) => {
          const isSelected = selectedPassengers.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={cn(
                "w-full flex items-center gap-3 py-4 border-b border-border/30 cursor-pointer transition-all duration-150 text-left",
                isSelected && "bg-primary/5 rounded-xl px-3 -mx-3"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                {getInitials(p.firstName, p.lastName)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">
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
                        Kein Sitz zugewiesen
                      </span>
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
    </div>
  );
}
