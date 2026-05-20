import { ArrowDown, AlertTriangle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

function calcLayoverMinutes(seg1, seg2) {
  const arr = new Date(`${seg1.arrival.date}T${seg1.arrival.time}:00`);
  const dep = new Date(`${seg2.departure.date}T${seg2.departure.time}:00`);
  return Math.round((dep - arr) / 60000);
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export default function StopoverBanner({ prevSegment, nextSegment }) {
  const { t } = useTranslation();
  const mins = calcLayoverMinutes(prevSegment, nextSegment);
  const duration = formatDuration(mins);
  const city = prevSegment.arrival.airport;

  const arrTerminal = prevSegment.arrival.terminal;
  const depTerminal = nextSegment.departure.terminal;
  const hasTerminalChange =
    arrTerminal && depTerminal && arrTerminal !== depTerminal;

  const isShort = mins < 60;

  const progress = 65;

  return (
    <div className="mx-4 my-1">
      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-3.5 py-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FBBF24] flex items-center justify-center shrink-0 mt-0.5">
            <ArrowDown size={16} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#92400E]">
                {t("overview.stopover.title", { city })}
              </span>
              <span className="text-[11px] font-semibold text-[#92400E] bg-[#FDE68A] px-2 py-0.5 rounded-full whitespace-nowrap">
                {duration}
              </span>
              {isShort && (
                <span className="text-[10px] text-[#DC2626] font-medium flex items-center gap-0.5">
                  <AlertTriangle size={10} />
                  {t("overview.stopover.tight")}
                </span>
              )}
            </div>

            {hasTerminalChange && (
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#92400E]">
                <AlertTriangle size={12} className="text-[#F59E0B] shrink-0" />
                <span>
                  {t("overview.stopover.terminalChange", {
                    from: arrTerminal,
                    to: depTerminal,
                  })}
                </span>
              </div>
            )}

            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[9px] text-[#92400E]/70 mb-1">
                <span>
                  {prevSegment.arrival.time}{" "}
                  {t("overview.stopover.landed")}
                </span>
                <span>
                  {nextSegment.departure.time} {t("overview.departure")}
                </span>
              </div>
              <div className="h-1.5 bg-[#FDE68A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#F59E0B] border-2 border-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
