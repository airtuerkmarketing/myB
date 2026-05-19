import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { useTranslation } from "../../hooks/useTranslation";

export default function ScenarioSwitcher() {
  const { activeScenario, scenarioList, switchScenario } = useBooking();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = (id) => {
    switchScenario(id);
    setOpen(false);
    navigate("/booking");
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      {open && (
        <div className="mb-2 bg-[#222222] text-white rounded-[10px] shadow-elevation-01 overflow-hidden min-w-[240px]">
          <div className="px-3 py-2 border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/50">
            {t("scenario.title")}
          </div>
          {scenarioList.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSwitch(s.id)}
              className={`w-full text-left px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                s.id === activeScenario
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((p) => !p)}
        className="h-10 w-10 bg-[#222222] text-white rounded-[10px] shadow-elevation-01 flex items-center justify-center text-lg hover:bg-[#333333] transition-colors cursor-pointer"
        aria-label="Szenario wechseln"
      >
        🔧
      </button>
    </div>
  );
}
