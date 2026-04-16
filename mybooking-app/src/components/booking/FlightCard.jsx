import { Plane } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { Card } from "@/components/ui/card";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import PassengerTable from "./PassengerTable";
import ActionButtons from "./ActionButtons";
import { bookingData } from "../../data/dummyData";

function AirlineHeader({ flight }) {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
      <AirlineLogo airline={flight.airline} size="md" />
      <span className="text-sm font-semibold text-foreground">
        {flight.airline}
      </span>
      <span className="inline-flex bg-muted text-muted-foreground text-[11px] font-mono rounded-md px-1.5 py-0.5 border border-border/50">
        {flight.flightNumber}
      </span>
      <span className="text-muted-foreground/30">|</span>
      <span className="text-xs text-muted-foreground">
        {flight.duration}
      </span>
    </div>
  );
}

function FlightTimes({ flight }) {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-2">
      {/* Labels row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {t("overview.departure")}
          </p>
        </div>
        <div /> {/* spacer */}
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {t("overview.arrival")}
          </p>
        </div>
      </div>

      {/* Times row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center mt-1">
        <p className="text-[32px] leading-none font-bold text-foreground tabular-nums">
          {flight.departure.time}
        </p>
        <div className="flex items-center gap-3 mx-4">
          <div className="flex-1 h-px border-t border-dashed border-border w-8" />
          <Plane size={16} className="text-muted-foreground/50 shrink-0" />
          <div className="flex-1 h-px border-t border-dashed border-border w-8" />
        </div>
        <p className="text-[32px] leading-none font-bold text-foreground tabular-nums text-right">
          {flight.arrival.time}
        </p>
      </div>

      {/* Airport + date row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start mt-2">
        <div>
          <p className="text-sm font-medium text-foreground">
            {flight.departure.airport} ({flight.departure.code})
          </p>
          <p className="text-xs text-muted-foreground">
            {flight.departure.date}
          </p>
        </div>
        <div /> {/* spacer */}
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {flight.arrival.airport} ({flight.arrival.code})
          </p>
          <p className="text-xs text-muted-foreground">
            {flight.arrival.date}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FlightCard({ flight, passengers }) {
  const isCancelled = flight.status === "cancelled";

  return (
    <Card
      className={cn(
        "rounded-2xl border-border/50 overflow-hidden shadow-none hover:shadow-md transition-shadow",
        isCancelled && "opacity-60 border-destructive/30"
      )}
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        <AirlineHeader flight={flight} />
        <FlightTimes flight={flight} />
        <div className="px-5 pb-3 pt-3">
          <StatusBadge
            status={flight.status}
            checkinDate={flight.checkinDate}
            flightId={flight.id}
          />
        </div>
        <PassengerTable passengers={passengers} />
        {!isCancelled && <ActionButtons flight={flight} />}
      </div>

      {/* Desktop layout — 2-column grid */}
      <div className="hidden md:grid md:grid-cols-[340px_1fr]">
        {/* Left: flight info */}
        <div className="border-r border-border/50">
          <AirlineHeader flight={flight} />
          <FlightTimes flight={flight} />
          <div className="px-5 pb-5 pt-3">
            <StatusBadge
              status={flight.status}
              checkinDate={flight.checkinDate}
              flightId={flight.id}
            />
          </div>
        </div>

        {/* Right: passenger table + action buttons */}
        <div className="flex flex-col">
          <div className="flex-1">
            <PassengerTable
              passengers={passengers}
              airlineRef={bookingData.airlineRef}
            />
          </div>
          {!isCancelled && <ActionButtons flight={flight} />}
        </div>
      </div>

      {/* Cancelled overlay */}
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
