import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

export default function CheckinHeader({ referenceNumber, flightData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      {/* Blue accent line */}
      <div className="w-full h-1 bg-primary" />

      {/* Nav bar */}
      <div className="py-3 px-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/booking")}
          className="flex items-center gap-1 text-sm font-medium text-text-primary hover:text-primary transition-colors"
        >
          <ChevronLeft size={18} />
          {t("checkin.title")}
        </button>
        <span className="text-xs text-text-muted font-mono">
          REF: {referenceNumber}
        </span>
      </div>

      {/* Route info */}
      <div className="px-4 pb-5">
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">
          {t("checkin.routeTo", {
            from: `${flightData.departure.airport} (${flightData.departure.code})`,
            to: `${flightData.arrival.airport} (${flightData.arrival.code})`,
          })}
        </h1>

        <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-text-muted" />
            {flightData.departure.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-text-muted" />
            {flightData.departure.time} – {flightData.arrival.time}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <img
            src={flightData.airlineLogo}
            alt={flightData.airline}
            className="w-4 h-4 rounded-full object-contain"
          />
          <span className="text-sm text-text-secondary">{flightData.airline}</span>
          <span className="bg-gray-100 text-[11px] rounded-md px-2 py-0.5 font-mono text-text-secondary">
            {flightData.flightNumber}
          </span>
          <span className="text-xs text-text-muted">{flightData.class}</span>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-text-muted">{flightData.duration}</span>
        </div>
      </div>
    </div>
  );
}
