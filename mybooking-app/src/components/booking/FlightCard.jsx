import { Plane } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { Card } from "@/components/ui/card";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import PassengerTable from "./PassengerTable";
import ActionButtons from "./ActionButtons";
import { formatCheckinDate } from "../../data/dummyData";

function AirlineHeader({ segment }) {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
      <AirlineLogo airline={segment.airline.name} size="md" />
      <span className="text-sm font-semibold text-foreground">
        {segment.airline.name}
      </span>
      <span className="inline-flex bg-muted text-muted-foreground text-[11px] font-mono rounded-md px-1.5 py-0.5 border border-border/50">
        {segment.flightNumber}
      </span>
      <span className="text-muted-foreground/30">|</span>
      <span className="text-xs text-muted-foreground">
        {segment.duration}
      </span>
    </div>
  );
}

function FlightTimes({ segment }) {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {t("overview.departure")}
          </p>
        </div>
        <div />
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {t("overview.arrival")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center mt-1">
        <p className="text-[32px] leading-none font-bold text-foreground tabular-nums">
          {segment.departure.time}
        </p>
        <div className="flex items-center gap-3 mx-4">
          <div className="flex-1 h-px border-t border-dashed border-border w-8" />
          <Plane size={16} className="text-muted-foreground/50 shrink-0" />
          <div className="flex-1 h-px border-t border-dashed border-border w-8" />
        </div>
        <p className="text-[32px] leading-none font-bold text-foreground tabular-nums text-right">
          {segment.arrival.time}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start mt-2">
        <div>
          <p className="text-sm font-medium text-foreground">
            {segment.departure.airport} ({segment.departure.code})
          </p>
          <p className="text-xs text-muted-foreground">
            {segment.departure.date}
          </p>
        </div>
        <div />
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {segment.arrival.airport} ({segment.arrival.code})
          </p>
          <p className="text-xs text-muted-foreground">
            {segment.arrival.date}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FlightCard({ segment, passengers }) {
  const isCancelled = segment.status === "cancelled";
  const checkinDate = formatCheckinDate(segment.checkinOpens);

  return (
    <Card
      className={cn(
        "rounded-2xl border-border/50 overflow-hidden shadow-none hover:shadow-md transition-shadow",
        isCancelled && "opacity-60 border-destructive/30"
      )}
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        <AirlineHeader segment={segment} />
        <FlightTimes segment={segment} />
        <div className="px-5 pb-3 pt-3">
          <StatusBadge
            status={segment.status}
            checkinDate={checkinDate}
            flightId={segment.id}
            segment={segment}
          />
        </div>
        <PassengerTable passengers={passengers} />
        {!isCancelled && <ActionButtons flight={segment} />}
      </div>

      {/* Desktop layout — 2-column grid */}
      <div className="hidden md:grid md:grid-cols-[340px_1fr]">
        <div className="border-r border-border/50">
          <AirlineHeader segment={segment} />
          <FlightTimes segment={segment} />
          <div className="px-5 pb-5 pt-3">
            <StatusBadge
              status={segment.status}
              checkinDate={checkinDate}
              flightId={segment.id}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1">
            <PassengerTable
              passengers={passengers}
              airlineRef={segment.airlinePNR}
            />
          </div>
          {!isCancelled && <ActionButtons flight={segment} />}
        </div>
      </div>

      {isCancelled && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="text-destructive/10 text-6xl font-black uppercase rotate-[-12deg] select-none">
            Storniert
          </span>
        </div>
      )}
    </Card>
  );
}
