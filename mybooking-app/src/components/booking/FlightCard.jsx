import { Plane } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import StatusBadge from "./StatusBadge";
import PassengerTable from "./PassengerTable";

function AirlineHeader({ flight }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={flight.airlineLogo}
        alt={flight.airline}
        className="w-6 h-6 rounded-full object-contain bg-white"
      />
      <span className="font-semibold text-sm text-text-primary">
        {flight.airline}
      </span>
      <span className="bg-gray-100 text-[11px] rounded-md px-2 py-0.5 font-mono text-text-secondary">
        {flight.flightNumber}
      </span>
      <span className="ml-auto text-xs text-text-muted">
        {flight.duration}
      </span>
    </div>
  );
}

function RouteDisplay({ flight }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Departure */}
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-wider text-text-muted">
          {t("overview.departure")}
        </p>
        <p className="text-3xl font-bold text-text-primary leading-none mt-1">
          {flight.departure.time}
        </p>
        <p className="text-xs text-text-secondary mt-1">
          {flight.departure.airport} ({flight.departure.code})
        </p>
        <p className="text-xs text-text-muted">{flight.departure.date}</p>
      </div>

      {/* Route line */}
      <div className="flex-1 flex items-center mx-4 md:mx-6 mt-2">
        <div className="flex-1 border-t border-dashed border-gray-300" />
        <Plane size={18} className="mx-2 text-text-muted rotate-0" />
        <div className="flex-1 border-t border-dashed border-gray-300" />
      </div>

      {/* Arrival */}
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wider text-text-muted">
          {t("overview.arrival")}
        </p>
        <p className="text-3xl font-bold text-text-primary leading-none mt-1">
          {flight.arrival.time}
        </p>
        <p className="text-xs text-text-secondary mt-1">
          {flight.arrival.airport} ({flight.arrival.code})
        </p>
        <p className="text-xs text-text-muted">{flight.arrival.date}</p>
      </div>
    </div>
  );
}

export default function FlightCard({ flight, passengers }) {
  const isCancelled = flight.status === "cancelled";

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white rounded-2xl border p-5 md:p-6 transition-all duration-200
        ${isCancelled ? "border-red-200 opacity-60" : "border-gray-100"}
      `}
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        <AirlineHeader flight={flight} />
        <RouteDisplay flight={flight} />
        <div className="mt-4">
          <StatusBadge
            status={flight.status}
            checkinDate={flight.checkinDate}
            flightId={flight.id}
          />
        </div>
        <div className="mt-4">
          <PassengerTable passengers={passengers} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex gap-8">
        {/* Left: flight info ~35% */}
        <div className="w-[38%] shrink-0">
          <AirlineHeader flight={flight} />
          <RouteDisplay flight={flight} />
          <div className="mt-5">
            <StatusBadge
              status={flight.status}
              checkinDate={flight.checkinDate}
              flightId={flight.id}
            />
          </div>
        </div>

        {/* Right: passenger table ~65% */}
        <div className="flex-1 min-w-0">
          <PassengerTable passengers={passengers} />
        </div>
      </div>

      {/* Cancelled overlay label */}
      {isCancelled && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="text-red-400/20 text-6xl font-black uppercase rotate-[-12deg] select-none">
            Storniert
          </span>
        </div>
      )}
    </div>
  );
}
