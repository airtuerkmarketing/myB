import { Fragment, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Download, Send, Settings, Plus, Check, Circle, Accessibility } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useBooking } from "../../context/BookingContext";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import {
  getSegmentCheckinSummary,
  getPassenger,
  mergePassengers,
  formatCheckinDate,
} from "../../data/dummyData";
import { cn } from "@/lib/utils";

function joinNames(names, andWord) {
  if (names.length <= 1) return names[0] ?? "";
  return names.slice(0, -1).join(", ") + ` ${andWord} ` + names[names.length - 1];
}

function calcLayover(seg1, seg2) {
  const arr = new Date(`${seg1.arrival.date}T${seg1.arrival.time}:00`);
  const dep = new Date(`${seg2.departure.date}T${seg2.departure.time}:00`);
  const mins = Math.round((dep - arr) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function getSmartCTA(segment, summary, t) {
  const remaining = summary.total - summary.checkedIn;

  switch (segment.status) {
    case "checkin-open": {
      const opens = segment.checkinOpens ? new Date(segment.checkinOpens) : null;
      const now = new Date();
      const justOpened = opens && now - opens < 3600000 && now - opens > 0;
      return {
        label: justOpened ? t("overview.checkinJustOpened") : t("overview.checkinNow"),
        className: "bg-[#1C9218] text-white font-semibold cursor-pointer hover:brightness-110",
        pulse: justOpened,
        clickable: true,
        action: "checkin",
      };
    }
    case "partially-checked-in":
      return {
        label:
          remaining === 1
            ? t("overview.onePassengerRemaining")
            : t("overview.passengersRemaining", { count: remaining }),
        className: "bg-[#F59E0B] text-white font-semibold cursor-pointer hover:brightness-110",
        clickable: true,
        action: "checkin",
      };
    case "checked-in":
      return {
        label: t("overview.viewBoardingPasses"),
        className: "bg-[#0A82DF] text-white font-semibold cursor-pointer hover:brightness-110",
        clickable: true,
        action: "boardingpass",
      };
    case "checkin-upcoming":
      return {
        label: t("overview.checkinStartsOn", { date: formatCheckinDate(segment.checkinOpens) }),
        className: "bg-[#F7F7F7] text-[#717171] border border-[#EBEBEB] font-medium",
        clickable: false,
      };
    case "checkin-closed":
      return {
        label: t("overview.checkinClosedAirport"),
        className: "bg-[#F7F7F7] text-[#717171] border border-[#EBEBEB] font-medium",
        clickable: false,
      };
    case "cancelled":
      return {
        label: t("overview.cancelledFlight"),
        className: "bg-[#FFF5F5] text-[#D32F2F] border border-[#D32F2F]/20 font-medium",
        clickable: false,
      };
    default:
      return null;
  }
}

// ─── Route Overview (multi-segment only) ────────

function RouteOverview({ trip }) {
  const cities = [];
  trip.segments.forEach((seg, i) => {
    if (i === 0) cities.push(seg.departure.airport);
    cities.push(seg.arrival.airport);
  });

  return (
    <div className="px-5 pt-4 pb-3 border-b border-dashed border-[#EBEBEB]">
      <div className="flex items-center gap-1.5 flex-wrap">
        {cities.map((city, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <>
                <AirlineLogo airline={trip.segments[i - 1].airline.name} size="sm" className="mx-0.5" />
                <span className="text-[#B0B0B0] text-sm">→</span>
              </>
            )}
            <span
              className={cn(
                "text-sm font-medium",
                i === 0 || i === cities.length - 1 ? "text-[#222222]" : "text-[#717171]"
              )}
            >
              {city}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Airline Header ─────────────────────────────

function AirlineHeader({ segment }) {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
      <AirlineLogo airline={segment.airline.name} size="md" />
      <span className="text-sm font-semibold text-[#222222]">{segment.airline.name}</span>
      <span className="inline-flex bg-[#F7F7F7] text-[#717171] text-[11px] font-mono rounded-md px-1.5 py-0.5 border border-[#EBEBEB]">
        {segment.flightNumber}
      </span>
      <span className="text-[#B0B0B0]">|</span>
      <span className="text-xs text-[#717171]">{segment.duration}</span>
    </div>
  );
}

// ─── Flight Times ───────────────────────────────

function FlightTimes({ segment }) {
  const { t } = useTranslation();
  const daysDiff = (() => {
    const d1 = new Date(segment.departure.date);
    const d2 = new Date(segment.arrival.date);
    return Math.round((d2 - d1) / 86400000);
  })();

  return (
    <div className="px-5 pb-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start">
        <p className="text-[10px] uppercase tracking-widest text-[#717171] font-medium">
          {t("overview.departure")}
        </p>
        <div />
        <p className="text-[10px] uppercase tracking-widest text-[#717171] font-medium text-right">
          {t("overview.arrival")}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center mt-1">
        <p className="text-[28px] leading-none font-bold text-[#222222] tabular-nums">
          {segment.departure.time}
        </p>
        <div className="flex items-center gap-3 mx-4">
          <div className="flex-1 h-px border-t border-dashed border-[#EBEBEB] w-8" />
          <Plane size={16} className="text-[#B0B0B0] shrink-0" />
          <div className="flex-1 h-px border-t border-dashed border-[#EBEBEB] w-8" />
        </div>
        <div className="flex items-center justify-end gap-1">
          <p className="text-[28px] leading-none font-bold text-[#222222] tabular-nums">
            {segment.arrival.time}
          </p>
          {daysDiff > 0 && (
            <span className="text-[10px] font-semibold text-[#0A82DF] bg-[#0A82DF]/10 rounded px-1 py-0.5 -mt-3">
              +{daysDiff}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start mt-2">
        <div>
          <p className="text-sm font-medium text-[#222222]">
            {segment.departure.airport} ({segment.departure.code})
          </p>
          <p className="text-xs text-[#717171]">{segment.departure.date}</p>
        </div>
        <div />
        <div className="text-right">
          <p className="text-sm font-medium text-[#222222]">
            {segment.arrival.airport} ({segment.arrival.code})
          </p>
          <p className="text-xs text-[#717171]">{segment.arrival.date}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Layover Divider ────────────────────────────

function LayoverDivider({ prevSegment, nextSegment }) {
  const { t } = useTranslation();
  const duration = calcLayover(prevSegment, nextSegment);
  const city = prevSegment.arrival.airport;

  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="flex-1 border-t border-dashed border-[#EBEBEB]" />
      <span className="text-xs text-[#717171] whitespace-nowrap">
        {t("overview.layover", { city, duration })}
      </span>
      <div className="flex-1 border-t border-dashed border-[#EBEBEB]" />
    </div>
  );
}

// ─── Smart Status Badge ─────────────────────────

function SmartBadge({ segment }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const summary = getSegmentCheckinSummary(segment);
  const cta = getSmartCTA(segment, summary, t);
  if (!cta) return null;

  const handleClick = () => {
    if (!cta.clickable) return;
    if (cta.action === "checkin") {
      navigate(`/checkin/${segment.id}`);
    } else if (cta.action === "boardingpass") {
      navigate(`/boardingpass/${segment.id}`);
    }
  };

  return (
    <div className="px-5 pb-3 pt-3">
      <button
        onClick={cta.clickable ? handleClick : undefined}
        className={cn(
          "w-full rounded-[10px] py-3 text-center text-sm transition-all",
          cta.className,
          cta.pulse && "animate-pulse-subtle"
        )}
      >
        {cta.label}
      </button>
    </div>
  );
}

// ─── Partial Check-in Detail ────────────────────

function PartialCheckinDetail({ segment, booking }) {
  const { t } = useTranslation();
  const andWord = t("common.and");
  const checkedIn = [];
  const missing = [];

  for (const pd of segment.passengerDetails) {
    const pax = getPassenger(booking, pd.passengerId);
    if (!pax) continue;
    if (pd.checkedIn) checkedIn.push(pax.firstName);
    else missing.push(pax.firstName);
  }

  const checkedText =
    checkedIn.length === 1
      ? t("overview.oneCheckedIn", { name: checkedIn[0] })
      : t("overview.manyCheckedIn", { names: joinNames(checkedIn, andWord) });
  const missingText =
    missing.length === 1
      ? t("overview.oneMissing", { name: missing[0] })
      : t("overview.manyMissing", { names: joinNames(missing, andWord) });

  return (
    <p className="text-xs text-[#717171] px-5 pb-2">
      {checkedText} {missingText}
    </p>
  );
}

// ─── Cancelled Detail ───────────────────────────

function CancelledDetail() {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="px-5 pb-3">
      <button
        onClick={() => setShowInfo((p) => !p)}
        className="text-xs text-[#D32F2F] font-medium hover:underline cursor-pointer"
      >
        {t("overview.whatNow")}
      </button>
      {showInfo && (
        <p className="text-xs text-[#717171] mt-1">{t("overview.cancelledInfo")}</p>
      )}
    </div>
  );
}

// ─── Mobile Passenger List ──────────────────────

function MobilePassengers({ passengers, booking }) {
  const { t } = useTranslation();

  return (
    <div className="md:hidden flex flex-col gap-2.5 px-5 pb-4">
      {passengers.map((p) => (
        <Fragment key={p.id}>
          <div className="flex items-center gap-3 text-sm">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
                p.checkedIn ? "bg-[#E8F5E9] text-[#1C9218]" : "bg-[#F7F7F7] text-[#717171]"
              )}
            >
              {p.firstName[0]}
              {p.lastName[0]}
            </div>
            <span className="font-medium text-[#222222] truncate">
              {p.firstName} {p.lastName}
            </span>
            {p.checkedIn && <Check size={14} className="text-[#1C9218] shrink-0" />}
            {p.seat ? (
              <span className="ml-auto font-mono font-semibold text-xs text-[#222222] bg-[#F7F7F7] rounded-md px-1.5 py-0.5">
                {p.seat}
              </span>
            ) : (
              <span className="ml-auto text-xs text-[#B0B0B0]">&mdash;</span>
            )}
            {p.hasWheelchair && <Accessibility size={14} className="text-[#0A82DF] shrink-0" />}
          </div>
          {p.type === "infant" && p.linkedAdult && (
            <p className="text-[10px] text-[#717171] ml-11 -mt-1">
              {t("overview.infantLap", {
                name: getPassenger(booking, p.linkedAdult)?.firstName,
              })}
            </p>
          )}
        </Fragment>
      ))}
    </div>
  );
}

// ─── Desktop Passenger Table ────────────────────

function DesktopPassengers({ passengers, segment, booking }) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block">
      <div className="px-5 pt-4 pb-1 flex items-center gap-1.5">
        <span className="text-xs text-[#717171]">Airline PNR:</span>
        <span className="font-mono font-medium text-[#222222] text-xs">
          {segment.airlinePNR}
        </span>
      </div>

      <div className="px-5 pb-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EBEBEB]">
              <th className="pb-2 text-[11px] uppercase tracking-wider text-[#717171] font-medium pr-4">
                {t("overview.passenger")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-[#717171] font-medium pr-4">
                {t("overview.ticketNr")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-[#717171] font-medium pr-4 hidden lg:table-cell">
                {t("overview.luggage")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-[#717171] font-medium pr-4">
                {t("overview.seat")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-[#717171] font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((p) => (
              <Fragment key={p.id}>
                <tr className="border-b border-[#EBEBEB]/50 last:border-0">
                  <td className="py-2.5 pr-4 text-sm font-medium text-[#222222] whitespace-nowrap">
                    {p.title} {p.firstName} {p.lastName}
                    {p.hasWheelchair && (
                      <Accessibility size={12} className="text-[#0A82DF] inline ml-1.5" />
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-xs font-mono text-[#717171] whitespace-nowrap">
                    {p.ticketNumber}
                  </td>
                  <td className="py-2.5 pr-4 text-sm text-[#717171] hidden lg:table-cell">
                    {p.luggage}
                  </td>
                  <td className="py-2.5 pr-4">
                    {p.seat ? (
                      <span className="font-mono font-semibold text-xs text-[#222222] bg-[#F7F7F7] rounded-md px-1.5 py-0.5">
                        {p.seat}
                      </span>
                    ) : (
                      <span className="text-[#B0B0B0]">&mdash;</span>
                    )}
                  </td>
                  <td className="py-2.5">
                    {p.checkedIn ? (
                      <Check size={16} className="text-[#1C9218]" />
                    ) : (
                      <Circle size={16} className="text-[#EBEBEB]" />
                    )}
                  </td>
                </tr>
                {p.type === "infant" && p.linkedAdult && (
                  <tr>
                    <td colSpan={5} className="pb-1 pt-0">
                      <p className="text-[10px] text-[#717171] pl-0.5">
                        {t("overview.infantLap", {
                          name: getPassenger(booking, p.linkedAdult)?.firstName,
                        })}
                      </p>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Action Buttons ─────────────────────────────

function SegmentActions({ segment, onAddExtras }) {
  const { t } = useTranslation();
  const { getSegmentExtras } = useBooking();

  const showExtras = !["cancelled", "checkin-closed"].includes(segment.status);

  const extrasCount = useMemo(() => {
    const ext = getSegmentExtras(segment.id);
    let c = 0;
    for (const paxLug of Object.values(ext.luggage)) {
      if (typeof paxLug === "object" && paxLug !== null) {
        for (const qty of Object.values(paxLug)) c += qty;
      }
    }
    c += Object.keys(ext.seats).length;
    for (const mealIds of Object.values(ext.meals)) c += mealIds.length;
    return c;
  }, [getSegmentExtras, segment.id]);

  const handleExtras = () => onAddExtras?.(segment.id);

  return (
    <>
      {/* Desktop */}
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
        {showExtras && (
          <button
            onClick={handleExtras}
            className="relative shrink-0 h-9 px-4 bg-[#0A82DF] text-white text-xs font-semibold rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#0B6AB2] active:bg-[#06528A] transition-colors cursor-pointer"
          >
            <Plus size={14} />
            {t("overview.addExtras")}
            {extrasCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#0A82DF] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {extrasCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Mobile — CTA already shown by SmartBadge above */}
      <div className="md:hidden px-5 pb-5 pt-3 flex flex-col gap-2.5">
        {showExtras && (
          <button
            onClick={handleExtras}
            className="relative w-full h-[46px] bg-[#0A82DF] text-white font-semibold text-sm rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#0B6AB2] active:bg-[#06528A] transition-colors cursor-pointer"
          >
            <Plus size={16} />
            {t("overview.addExtras")}
            {extrasCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#0A82DF] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {extrasCount}
              </span>
            )}
          </button>
        )}

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

// ─── Segment Block ──────────────────────────────

function SegmentBlock({ segment, booking, onAddExtras }) {
  const passengers = mergePassengers(booking, segment);
  const isCancelled = segment.status === "cancelled";
  const isPartial = segment.status === "partially-checked-in";

  return (
    <div className={cn(isCancelled && "opacity-60")}>
      {/* Mobile */}
      <div className="md:hidden">
        <AirlineHeader segment={segment} />
        <FlightTimes segment={segment} />
        <SmartBadge segment={segment} />
        {isPartial && <PartialCheckinDetail segment={segment} booking={booking} />}
        {isCancelled && <CancelledDetail />}
        <MobilePassengers passengers={passengers} booking={booking} />
        <SegmentActions segment={segment} onAddExtras={onAddExtras} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[2fr_3fr]">
          <div className="border-r border-[#EBEBEB]">
            <AirlineHeader segment={segment} />
            <FlightTimes segment={segment} />
            <SmartBadge segment={segment} />
            {isPartial && <PartialCheckinDetail segment={segment} booking={booking} />}
            {isCancelled && <CancelledDetail />}
          </div>
          <DesktopPassengers passengers={passengers} segment={segment} booking={booking} />
        </div>
        <SegmentActions segment={segment} onAddExtras={onAddExtras} />
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────

export default function TripCard({ trip, booking, onAddExtras }) {
  const isMultiSegment = trip.segments.length > 1;

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-[16px] shadow-elevation-03 overflow-hidden">
      {isMultiSegment && <RouteOverview trip={trip} />}

      {trip.segments.map((seg, i) => (
        <Fragment key={seg.id}>
          {i > 0 && (
            <LayoverDivider prevSegment={trip.segments[i - 1]} nextSegment={seg} />
          )}
          <SegmentBlock segment={seg} booking={booking} onAddExtras={onAddExtras} />
        </Fragment>
      ))}
    </div>
  );
}
