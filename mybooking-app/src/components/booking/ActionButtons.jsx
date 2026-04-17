import { useNavigate } from "react-router-dom";
import { Download, Send, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../../hooks/useTranslation";

export default function ActionButtons({ flight }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isCheckinOpen = flight.status === "checkin-open";

  return (
    <>
      {/* Desktop — horizontal bar inside card */}
      <div className="hidden md:flex items-center gap-2 px-5 py-4 border-t border-border/50">
        <Button variant="outline" size="sm" className="rounded-[10px] h-9 text-xs font-medium gap-1.5">
          <Download size={14} />
          {t("overview.downloadTicket")}
        </Button>
        <Button variant="outline" size="sm" className="rounded-[10px] h-9 text-xs font-medium gap-1.5">
          <Send size={14} />
          {t("overview.sendTicket")}
        </Button>
        <Button variant="outline" size="sm" className="rounded-[10px] h-9 text-xs font-medium gap-1.5">
          <Settings size={14} />
          {t("overview.manageBooking")}
        </Button>
        <Button size="sm" className="rounded-[10px] h-9 text-xs font-medium gap-1.5 ml-auto">
          <Plus size={14} />
          {t("overview.addExtras")}
        </Button>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex gap-3 px-5 pb-5">
        {isCheckinOpen && (
          <Button
            className="flex-1 rounded-[10px] h-11 font-semibold"
            onClick={() => navigate(`/checkin/${flight.id}`)}
          >
            {t("overview.checkinStarted")}
          </Button>
        )}
        <Button variant="outline" className="rounded-[10px] h-11 gap-1.5">
          <Plus size={16} />
          {t("overview.extras")}
        </Button>
      </div>
    </>
  );
}
