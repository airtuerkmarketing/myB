import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

const statusConfig = {
  "checkin-open": {
    className: "bg-green-600 text-white font-semibold shadow-[0_0_0_3px_rgba(22,163,74,0.15)] animate-pulse-subtle",
    getLabel: (t) => t("overview.checkinStarted"),
    clickable: true,
  },
  "checkin-closed": {
    className: "bg-gray-100 text-gray-600 font-medium border border-gray-200",
    getLabel: (t) => t("overview.checkinClosed"),
    clickable: false,
  },
  "checkin-upcoming": {
    className: "bg-white text-gray-600 font-medium border border-gray-200",
    getLabel: (t, checkinDate) => t("overview.checkinStartsOn", { date: checkinDate }),
    clickable: false,
  },
  cancelled: {
    className: "bg-red-50 text-red-600 font-medium border border-red-200",
    getLabel: (t) => t("overview.cancelled"),
    clickable: false,
  },
};

export default function StatusBadge({ status, checkinDate, flightId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const config = statusConfig[status];
  if (!config) return null;

  const label = config.getLabel(t, checkinDate);
  const isClickable = config.clickable && flightId;

  return (
    <button
      onClick={isClickable ? () => navigate(`/checkin/${flightId}`) : undefined}
      className={`
        rounded-xl py-2.5 px-5 text-sm inline-flex items-center gap-2
        transition-all duration-200
        ${config.className}
        ${isClickable ? "cursor-pointer hover:opacity-90" : "cursor-default"}
      `}
    >
      {status === "checkin-open" && (
        <span className="w-2 h-2 bg-white rounded-full" />
      )}
      {label}
    </button>
  );
}
