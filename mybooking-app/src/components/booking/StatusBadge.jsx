import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";
import { getSegmentCheckinSummary } from "../../data/dummyData";

export default function StatusBadge({ status, checkinDate, flightId, segment }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  let partialLabel = "";
  if (status === "partially-checked-in" && segment) {
    const summary = getSegmentCheckinSummary(segment);
    partialLabel = `${summary.checkedIn}/${summary.total} eingecheckt`;
  }

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
    "partially-checked-in": {
      className:
        "bg-[#FFF8E1] text-[#F57C00] border border-[#F57C00]/20 font-semibold cursor-pointer hover:brightness-110",
      label: partialLabel,
      clickable: true,
    },
    "checked-in": {
      className:
        "bg-[#E8F5E9] text-[#1C9218] border border-[#1C9218]/20 font-medium cursor-default",
      label: t("overview.checkedIn") || "Eingecheckt",
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
