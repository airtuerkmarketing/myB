import { useState } from "react";
import { Plus, Minus, UtensilsCrossed, X } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MealSelector({ meals, selectedMeals, onSelectMeal, passengerName }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const count = selectedMeals.length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {t("checkin.meals")}
        </h2>
        {count > 0 && (
          <span className="text-sm text-primary font-medium">
            {t("checkin.mealsSelected", { count })}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        {t("checkin.chooseMeals", { name: passengerName })}
      </p>

      {/* Browse button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full h-12 rounded-[10px] border-dashed border-border hover:border-primary hover:bg-primary/[0.02] font-medium text-sm gap-2 mt-3 cursor-pointer"
      >
        <UtensilsCrossed size={16} />
        {t("checkin.browseMenu")}
      </Button>

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
                  className="hover:text-destructive transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Meal sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <div className="md:hidden flex justify-center pt-1 pb-2">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>
          <SheetHeader>
            <SheetTitle>Menü wählen</SheetTitle>
            <SheetDescription>{passengerName}</SheetDescription>
          </SheetHeader>

          <div className="p-5 flex flex-col gap-3">
            {meals.map((meal, index) => {
              const isSelected = selectedMeals.includes(meal.id);
              return (
                <button
                  key={meal.id}
                  onClick={() => onSelectMeal(meal.id)}
                  className={cn(
                    "w-full flex items-center gap-3.5 p-3.5 rounded-[10px] border text-left transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border/60 hover:border-border"
                  )}
                >
                  <span className="text-[32px] shrink-0">{meal.image}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {meal.name}
                      </span>
                      {index === 0 && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold rounded-full px-2 py-0.5">
                          Beliebt
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {meal.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-semibold text-foreground">
                      €{meal.price.toFixed(0)}
                    </span>
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
