import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

function MealSheet({ meals, selectedMeals, onToggle, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in-up [animation-duration:150ms]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="
          relative w-full md:max-w-md
          bg-white rounded-t-2xl md:rounded-2xl
          max-h-[80vh] overflow-y-auto
          animate-slide-up md:animate-fade-in-up
        "
      >
        {/* Handle bar (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-base text-text-primary">
            Bordverpflegung
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        {/* Meal list */}
        <div className="p-5 flex flex-col gap-3">
          {meals.map((meal, index) => {
            const isSelected = selectedMeals.includes(meal.id);
            return (
              <button
                key={meal.id}
                onClick={() => onToggle(meal.id)}
                className={`
                  w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left
                  transition-all duration-200
                  ${isSelected
                    ? "bg-primary/5 border-primary/20"
                    : "bg-white border-gray-100 hover:border-gray-200"
                  }
                `}
              >
                {/* Emoji */}
                <span className="text-2xl shrink-0">{meal.image}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-text-primary">
                      {meal.name}
                    </span>
                    {index === 0 && (
                      <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full px-2 py-0.5">
                        Beliebt
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                    {meal.description}
                  </p>
                </div>

                {/* Price + toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-base font-semibold text-text-primary">
                    €{meal.price.toFixed(0)}
                  </span>
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center
                      transition-all duration-200
                      ${isSelected
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MealSelector({ meals, selectedMeals, onSelectMeal, passengerName }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const count = selectedMeals.length;

  return (
    <div className="mt-8">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("checkin.meals")}
        </h2>
        {count > 0 && (
          <span className="text-primary text-sm font-medium">
            {t("checkin.mealsSelected", { count })}
          </span>
        )}
      </div>
      <p className="text-sm text-text-secondary mt-1">
        {t("checkin.chooseMeals", { name: passengerName })}
      </p>

      {/* Browse button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          mt-4 w-full border border-dashed border-gray-300 rounded-xl
          py-4 px-5 flex items-center justify-center gap-2
          text-sm font-medium text-text-primary
          hover:border-primary hover:border-solid hover:bg-blue-50/30
          transition-all duration-200
        "
      >
        <span>🍴</span>
        {t("checkin.browseMenu")}
      </button>

      {/* Selected meals preview */}
      {count > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {meals
            .filter((m) => selectedMeals.includes(m.id))
            .map((m) => (
              <span
                key={m.id}
                className="bg-primary/5 border border-primary/15 rounded-lg px-2.5 py-1 text-xs font-medium text-primary flex items-center gap-1.5"
              >
                {m.image} {m.name}
                <button
                  onClick={() => onSelectMeal(m.id)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Meal sheet */}
      {isOpen && (
        <MealSheet
          meals={meals}
          selectedMeals={selectedMeals}
          onToggle={onSelectMeal}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
