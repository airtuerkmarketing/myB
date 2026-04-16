import { Check } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

function getInitials(firstName, lastName) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function CheckboxCircle({ checked }) {
  return (
    <div
      className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
        transition-all duration-200
        ${checked
          ? "bg-primary border-primary scale-100"
          : "bg-white border-gray-300 scale-100"
        }
      `}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </div>
  );
}

export default function PassengerSelect({ passengers, selectedPassengers, onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-text-primary">
        {t("checkin.whosFlying")}
      </h2>
      <div className="border-t border-gray-100 mt-3">
        {passengers.map((p) => {
          const isSelected = selectedPassengers.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={`
                w-full flex items-center gap-3 py-4 border-b border-gray-50
                cursor-pointer transition-all duration-150 text-left
                ${isSelected ? "bg-blue-50/50 rounded-xl px-3 -mx-3" : ""}
              `}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
                {getInitials(p.firstName, p.lastName)}
              </div>

              {/* Name + Seat */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-text-primary">
                  {p.firstName} {p.lastName}
                </p>
                <div className="flex items-center gap-2">
                  {p.seat ? (
                    <span className="text-xs text-text-muted">
                      Seat {p.seat}
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-amber-600">
                        Kein Sitz zugewiesen
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        {t("checkin.chooseSeat")}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Checkbox */}
              <CheckboxCircle checked={isSelected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
