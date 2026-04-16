const steps = [
  { key: 1, label: "Passagiere" },
  { key: 2, label: "Extras" },
  { key: 3, label: "Bestätigung" },
];

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <div className="flex items-center justify-center gap-0 px-4 py-4">
      {steps.map((step, i) => {
        const isActive = step.key === currentStep;
        const isCompleted = step.key < currentStep;

        return (
          <div key={step.key} className="flex items-center">
            {/* Connector line (before each step except first) */}
            {i > 0 && (
              <div
                className={`w-10 md:w-16 h-0.5 ${
                  isCompleted || isActive ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}

            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-white shadow-[0_0_0_3px_rgba(10,130,223,0.15)]"
                      : isCompleted
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                {isCompleted ? "✓" : step.key}
              </div>
              <span
                className={`text-[10px] md:text-xs whitespace-nowrap ${
                  isActive
                    ? "font-semibold text-primary"
                    : isCompleted
                      ? "font-medium text-primary"
                      : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
