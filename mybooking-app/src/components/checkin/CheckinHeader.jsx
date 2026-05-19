import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CheckinHeader({ referenceNumber, segment }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-full h-1 bg-primary" />

      <div className="py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/booking")}
            className="h-9 w-9 rounded-full"
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="text-sm font-medium text-foreground">
            {t("checkin.title")}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">
          REF: {referenceNumber}
        </span>
      </div>

      <Separator />

      <div className="px-4 mt-5 pb-5">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          {t("checkin.routeTo", {
            from: `${segment.departure.airport} (${segment.departure.code})`,
            to: `${segment.arrival.airport} (${segment.arrival.code})`,
          })}
        </h1>

        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {segment.departure.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {segment.departure.time} – {segment.arrival.time}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <AirlineLogo airline={segment.airline.name} size="sm" />
          <span className="text-sm font-medium text-foreground">{segment.airline.name}</span>
          <Badge variant="mono">{segment.flightNumber}</Badge>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{segment.cabinClass}</span>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{segment.duration}</span>
        </div>
      </div>
    </div>
  );
}
