import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status, checkinDate, flightId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const configs = {
    "checkin-open": {
      className:
        "bg-checkin-green text-white font-semibold cursor-pointer hover:brightness-110 shadow-[0_0_0_4px_hsl(var(--checkin-green)/0.15)]",
      label: t("overview.checkinStarted"),
      clickable: true,
    },
    "checkin-upcoming": {
      className:
        "bg-card border border-border text-muted-foreground font-medium cursor-default",
      label: t("overview.checkinStartsOn", { date: checkinDate }),
      clickable: false,
    },
    "checkin-closed": {
      className:
        "bg-muted text-muted-foreground border border-border/50 font-medium cursor-default",
      label: t("overview.checkinClosed"),
      clickable: false,
    },
    cancelled: {
      className:
        "bg-destructive/5 border border-destructive/20 text-destructive font-medium cursor-default",
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
        "w-full rounded-xl py-3 text-center text-sm transition-all",
        config.className
      )}
    >
      {config.label}
    </button>
  );
}
