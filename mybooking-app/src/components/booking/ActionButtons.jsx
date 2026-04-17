import { useNavigate } from "react-router-dom";
import { Download, Send, Settings, Plus } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

export default function ActionButtons({ flight }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isCheckinOpen = flight.status === "checkin-open";

  return (
    <>
      {/* Desktop — horizontal bar with flex-wrap */}
      <div className="hidden md:flex items-center gap-2 px-5 py-3 border-t border-[#EBEBEB] flex-wrap">
        <button className="shrink-0 h-9 px-3 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#F0F0F0] transition-colors cursor-pointer">
          <Download size={14} />
          {t("overview.downloadTicket")}
        </button>
        <button className="shrink-0 h-9 px-3 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#F0F0F0] transition-colors cursor-pointer">
          <Send size={14} />
          {t("overview.sendTicket")}
        </button>
        <button className="shrink-0 h-9 px-3 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#F0F0F0] transition-colors cursor-pointer">
          <Settings size={14} />
          {t("overview.manageBooking")}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => alert("Extras coming soon")}
          className="shrink-0 h-9 px-4 bg-[#0A82DF] text-white text-xs font-semibold rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#0B6AB2] active:bg-[#06528A] transition-colors cursor-pointer"
        >
          <Plus size={14} />
          {t("overview.addExtras")}
        </button>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-5 pb-5 pt-3 flex flex-col gap-2.5">
        {isCheckinOpen && (
          <button
            onClick={() => navigate(`/checkin/${flight.id}`)}
            className="w-full h-[46px] bg-[#1C9218] text-white font-semibold text-sm rounded-[10px] hover:brightness-110 transition-all cursor-pointer"
          >
            {t("overview.checkinNow")}
          </button>
        )}

        <button
          onClick={() => alert("Extras coming soon")}
          className="w-full h-[46px] bg-[#0A82DF] text-white font-semibold text-sm rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#0B6AB2] active:bg-[#06528A] transition-colors cursor-pointer"
        >
          <Plus size={16} />
          {t("overview.addExtras")}
        </button>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button className="shrink-0 h-9 px-3 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
            <Download size={14} />
            {t("overview.eticket")}
          </button>
          <button className="shrink-0 h-9 px-3 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
            <Send size={14} />
            {t("overview.send")}
          </button>
          <button className="shrink-0 h-9 px-3 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
            <Settings size={14} />
            {t("overview.manage")}
          </button>
        </div>
      </div>
    </>
  );
}
