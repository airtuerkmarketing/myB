import { useNavigate } from "react-router-dom";
import { Download, Send, Settings, Plus } from "lucide-react";
import Button from "../ui/Button";
import { useTranslation } from "../../hooks/useTranslation";

export default function ActionButtons({ flight }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isCheckinOpen = flight.status === "checkin-open";

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex gap-3 mt-3">
        <Button variant="outline" size="sm" icon={Download}>
          {t("overview.downloadTicket")}
        </Button>
        <Button variant="outline" size="sm" icon={Send}>
          {t("overview.sendTicket")}
        </Button>
        <Button variant="outline" size="sm" icon={Settings}>
          {t("overview.manageBooking")}
        </Button>
        <Button variant="primary" size="sm" icon={Plus}>
          {t("overview.addExtras")}
        </Button>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex gap-3 mt-4">
        {isCheckinOpen && (
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate(`/checkin/${flight.id}`)}
          >
            {t("overview.checkinStarted")}
          </Button>
        )}
        <Button variant="outline" size="md" icon={Plus}>
          {t("overview.extras")}
        </Button>
      </div>
    </>
  );
}
