import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status, checkinDate, flightId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const configs = {
    "checkin-open": {
      className:
        "bg-[#1C9218] text-white font-semibold cursor-pointer hover:brightness-110",
      label: t("overview.checkinStarted"),
      clickable: true,
    },
    "checkin-upcoming": {
      className:
        "bg-white text-[#717171] border border-[#EBEBEB] font-medium cursor-default",
      label: t("overview.checkinStartsOn", { date: checkinDate }),
      clickable: false,
    },
    "checkin-closed": {
      className:
        "bg-[#F7F7F7] text-[#717171] border border-[#EBEBEB] font-medium cursor-default",
      label: t("overview.checkinClosed"),
      clickable: false,
    },
    cancelled: {
      className:
        "bg-[#FFF5F5] text-[#D32F2F] border border-[#D32F2F]/20 font-medium cursor-default",
      label: t("overview.cancelled"),
      clickable: false,
    },
  };

  const config = configs[status];
  if (!config) return null;

  return (
    <button
      onClick={config.clickable && flightId ? () => navigate(`/checkin/${flightId}`) : undefined}
      className={cn(
        "w-full rounded-[10px] py-3 text-center text-sm transition-all",
        config.className
      )}
    >
      {config.label}
    </button>
  );
}
