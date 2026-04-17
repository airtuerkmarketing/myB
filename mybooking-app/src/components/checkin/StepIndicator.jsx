import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { key: 1, label: "Passagiere" },
  { key: 2, label: "Extras" },
  { key: 3, label: "Bestätigung" },
];

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-between px-4 mt-6 mb-2">
      {steps.map((step, i) => {
        const isActive = step.key === currentStep;
        const isCompleted = step.key < currentStep;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200",
                  isActive || isCompleted
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check size={14} strokeWidth={2.5} /> : step.key}
              </div>
              <span
                className={cn(
                  "text-[10px] text-center mt-1 whitespace-nowrap",
                  isActive
                    ? "text-primary font-semibold"
                    : isCompleted
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (after each step except last) */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-4",
                  step.key < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
