import { Fragment, useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane, Download, Send, Settings, Plus, Check, Circle,
  Accessibility, ChevronDown, Info,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useBooking } from "../../context/BookingContext";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import {
  getSegmentCheckinSummary,
  getPassenger,
  mergePassengers,
  flattenSegments,
  formatCheckinDate,
} from "../../data/dummyData";
import { cn } from "@/lib/utils";

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

function getStatusPill(segment, t) {
  const summary = getSegmentCheckinSummary(segment);
  const remaining = summary.total - summary.checkedIn;

  switch (segment.status) {
    case "checkin-open": {
      const opens = segment.checkinOpens ? new Date(segment.checkinOpens) : null;
      const now = new Date();
      const justOpened = opens && now - opens < 3600000 && now - opens > 0;
      return {
        label: t("overview.checkinNow"),
        className: "bg-[#1C9218] text-white px-3.5 py-2 rounded-[10px] text-xs font-semibold cursor-pointer",
        pulse: justOpened,
        clickable: true,
        action: "checkin",
      };
    }
    case "partially-checked-in":
      return {
        label: t("overview.passengersRemaining", { count: remaining }),
        className: "bg-[#F59E0B] text-white px-3.5 py-2 rounded-[10px] text-xs font-semibold cursor-pointer",
        clickable: true,
        action: "checkin",
      };
    case "checked-in":
      return {
        label: t("overview.viewBoardingPasses"),
        className: "bg-[#0A82DF] text-white px-3.5 py-2 rounded-[10px] text-xs font-semibold cursor-pointer",
        clickable: true,
        action: "boardingpass",
      };
    case "checkin-upcoming":
      return {
        label: t("overview.checkinStartsOn", { date: formatCheckinDate(segment.checkinOpens) }),
        className: "bg-[#F7F7F7] text-[#717171] border border-[#EBEBEB] px-3.5 py-2 rounded-[10px] text-xs font-medium",
        clickable: false,
      };
    case "checkin-closed":
      return {
        label: t("overview.checkinClosedAirport"),
        className: "bg-[#F7F7F7] text-[#717171] border border-[#EBEBEB] px-3.5 py-2 rounded-[10px] text-xs font-medium",
        clickable: false,
      };
    case "cancelled":
      return {
        label: t("overview.cancelledFlight"),
        className: "bg-[#FFF5F5] text-[#D32F2F] border border-[#D32F2F]/20 px-3.5 py-2 rounded-[10px] text-xs font-medium",
        clickable: false,
      };
    default:
      return null;
  }
}

// ─── Airline Row ──────────────────────────────────

function AirlineRow({ segment }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pill = getStatusPill(segment, t);

  const handlePillClick = (e) => {
    e.stopPropagation();
    if (!pill?.clickable) return;
    if (pill.action === "checkin") navigate(`/checkin/${segment.id}`);
    else if (pill.action === "boardingpass") navigate(`/boardingpass/${segment.id}`);
  };

  return (
    <div className="flex items-center justify-between px-4 pt-3.5 pb-0">
      <div className="flex items-center gap-2">
        <AirlineLogo airline={segment.airline.name} size="md" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#222222]">{segment.airline.name}</span>
          <span className="text-[11px] text-[#717171]">
            {segment.flightNumber} · {segment.duration}
          </span>
        </div>
      </div>
      {pill && (
        <button
          onClick={pill.clickable ? handlePillClick : undefined}
          className={cn("shrink-0 transition-all whitespace-nowrap", pill.className, pill.pulse && "animate-pulse-soft")}
        >
          {pill.label}
        </button>
      )}
    </div>
  );
}

// ─── Flight Times (compact) ────────────────────────

function CompactFlightTimes({ segment }) {
  const { t } = useTranslation();
  const daysDiff = (() => {
    const d1 = new Date(segment.departure.date);
    const d2 = new Date(segment.arrival.date);
    return Math.round((d2 - d1) / 86400000);
  })();

  return (
    <div className="px-4 pt-3.5 pb-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start">
        <p className="text-[9px] uppercase tracking-widest text-[#717171] font-medium">
          {t("overview.departure")}
        </p>
        <div />
        <p className="text-[9px] uppercase tracking-widest text-[#717171] font-medium text-right">
          {t("overview.arrival")}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center mt-0.5">
        <p className="text-[28px] leading-[1.1] font-bold text-[#222222] tabular-nums tracking-tight">
          {segment.departure.time}
        </p>
        <div className="flex items-center gap-1 mx-3 pt-3">
          <div className="w-[22px] h-0 border-t border-dashed border-[#DDDDDD]" />
          <Plane size={14} className="text-[#B0B0B0] shrink-0" />
          <div className="w-[22px] h-0 border-t border-dashed border-[#DDDDDD]" />
        </div>
        <p className="text-[28px] leading-[1.1] font-bold text-[#222222] tabular-nums tracking-tight text-right">
          {segment.arrival.time}
          {daysDiff > 0 && (
            <sup className="text-[9px] text-[#B0B0B0] font-normal ml-0.5">+{daysDiff}</sup>
          )}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start mt-1">
        <div>
          <p className="text-xs font-medium text-[#222222]">
            {segment.departure.airport} ({segment.departure.code})
          </p>
          <p className="text-[11px] text-[#B0B0B0]">{segment.departure.date}</p>
        </div>
        <div />
        <div className="text-right">
          <p className="text-xs font-medium text-[#222222]">
            {segment.arrival.airport} ({segment.arrival.code})
          </p>
          <p className="text-[11px] text-[#B0B0B0]">{segment.arrival.date}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Layover Divider ──────────────────────────────

function LayoverDivider({ prevSegment, nextSegment }) {
  const { t } = useTranslation();
  const duration = calcLayover(prevSegment, nextSegment);
  const city = prevSegment.arrival.airport;

  return (
    <div className="flex items-center gap-2 py-2 mx-4">
      <div className="flex-1 border-t border-dashed border-[#DDDDDD]" />
      <span className="text-[10px] text-[#717171] italic whitespace-nowrap">
        {t("overview.layover", { city, duration })}
      </span>
      <div className="flex-1 border-t border-dashed border-[#DDDDDD]" />
    </div>
  );
}

// ─── Cancelled Banner ────────────────────────────

function CancelledBanner() {
  const { t } = useTranslation();
  return (
    <div className="bg-[#FFF5F5] border-t border-[#D32F2F]/10 px-4 py-3">
      <p className="text-xs text-[#D32F2F]">{t("overview.cancelledInfo")}</p>
      <p className="text-xs text-[#0A82DF] font-medium mt-1 cursor-pointer hover:underline">
        {t("overview.cancelledAction.whatNow")}
      </p>
    </div>
  );
}

// ─── Animated Accordion Panel ────────────────────

function AccordionPanel({ open, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !contentRef.current) return;
    const ro = new ResizeObserver(() => {
      if (contentRef.current) setHeight(contentRef.current.scrollHeight);
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [open]);

  return (
    <div
      style={{ maxHeight: height, transition: "max-height 250ms ease-out" }}
      className="overflow-hidden"
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

// ─── Passenger List (Mobile) ────────────────────

function PassengerList({ passengers, booking }) {
  const { t } = useTranslation();

  return (
    <div className="md:hidden px-4 pt-2">
      {passengers.map((p, i) => (
        <div
          key={p.id}
          className={cn(
            "flex items-center gap-2 py-2.5",
            i < passengers.length - 1 && "border-b border-[#F7F7F7]"
          )}
        >
          <div className="w-7 h-7 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[9px] font-medium text-[#717171] shrink-0">
            {p.firstName[0]}{p.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#222222]">{p.firstName} {p.lastName}</p>
            <p className="text-[10px] text-[#B0B0B0]">
              {p.ticketNumber} · {p.luggage}
              {p.type === "child" && ` · ${t("overview.passenger")} (Kind)`}
              {p.type === "infant" && p.linkedAdult && (
                <> · {t("overview.infantLap", { name: getPassenger(booking, p.linkedAdult)?.firstName })}</>
              )}
            </p>
          </div>
          {p.seat ? (
            <span className="shrink-0 bg-[#F7F7F7] text-[#222222] font-mono text-[10px] font-medium rounded-md px-1.5 py-0.5">
              {p.seat}
            </span>
          ) : (
            <span className="shrink-0 text-[10px] text-[#B0B0B0]">&mdash;</span>
          )}
          {p.hasWheelchair && <Accessibility size={14} className="text-[#B0B0B0] shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// ─── Passenger Table (Desktop) ──────────────────

function PassengerTable({ passengers, segment, booking }) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block px-4 pt-2 pb-1 overflow-x-auto">
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
              <tr className="border-b border-[#F7F7F7] last:border-0">
                <td className="py-2.5 pr-4 text-sm font-medium text-[#222222] whitespace-nowrap">
                  {p.title} {p.firstName} {p.lastName}
                  {p.hasWheelchair && <Accessibility size={12} className="text-[#B0B0B0] inline ml-1.5" />}
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
                      {t("overview.infantLap", { name: getPassenger(booking, p.linkedAdult)?.firstName })}
                    </p>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Action Buttons ─────────────────────────────

function ActionButtons({ segments, onAddExtras }) {
  const { t } = useTranslation();
  const { getSegmentExtras } = useBooking();

  const firstActionable = segments.find(
    (s) => !["cancelled", "checkin-closed"].includes(s.status)
  );
  const showExtras = !!firstActionable;

  const extrasCount = useMemo(() => {
    let c = 0;
    for (const seg of segments) {
      const ext = getSegmentExtras(seg.id);
      for (const paxLug of Object.values(ext.luggage)) {
        if (typeof paxLug === "object" && paxLug !== null) {
          for (const qty of Object.values(paxLug)) c += qty;
        }
      }
      c += Object.keys(ext.seats).length;
      for (const mealIds of Object.values(ext.meals)) c += mealIds.length;
    }
    return c;
  }, [getSegmentExtras, segments]);

  const handleExtras = () => onAddExtras?.(firstActionable?.id);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-2 px-4 py-3 border-t border-[#EBEBEB] flex-wrap">
        <button className="shrink-0 h-9 px-4 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#F0F0F0] transition-colors cursor-pointer">
          <Download size={12} />
          {t("overview.downloadTicket")}
        </button>
        <button className="shrink-0 h-9 px-4 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#F0F0F0] transition-colors cursor-pointer">
          <Send size={12} />
          {t("overview.sendTicket")}
        </button>
        <button className="shrink-0 h-9 px-4 bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] text-xs font-medium rounded-[10px] flex items-center gap-1.5 whitespace-nowrap hover:bg-[#F0F0F0] transition-colors cursor-pointer">
          <Settings size={12} />
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

      {/* Mobile */}
      <div className="md:hidden px-4 py-3 flex flex-col gap-2">
        {showExtras && (
          <button
            onClick={handleExtras}
            className="relative w-full h-[42px] bg-[#0A82DF] text-white text-[13px] font-semibold rounded-[10px] flex items-center justify-center gap-1.5 hover:bg-[#0B6AB2] active:bg-[#06528A] transition-colors cursor-pointer"
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
        <div className="flex gap-1.5">
          <button className="flex-1 h-[34px] bg-[#F7F7F7] border border-[#EBEBEB] text-[#222222] text-[11px] rounded-[10px] flex items-center justify-center gap-1 cursor-pointer">
            <Download size={12} />
            {t("overview.eticket")}
          </button>
          <button className="flex-1 h-[34px] bg-[#F7F7F7] border border-[#EBEBEB] text-[#222222] text-[11px] rounded-[10px] flex items-center justify-center gap-1 cursor-pointer">
            <Send size={12} />
            {t("overview.send")}
          </button>
          <button className="flex-1 h-[34px] bg-[#F7F7F7] border border-[#EBEBEB] text-[#222222] text-[11px] rounded-[10px] flex items-center justify-center gap-1 cursor-pointer">
            <Settings size={12} />
            {t("overview.manage")}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main TripCard ──────────────────────────────

export default function TripCard({ trip, booking, onAddExtras, totalTrips }) {
  const { t } = useTranslation();
  const isMultiSegment = trip.segments.length > 1;
  const isCancelled = trip.segments.every((s) => s.status === "cancelled");
  const hasPartial = trip.segments.some((s) => s.status === "partially-checked-in");

  const autoExpand =
    hasPartial || (totalTrips === 1 && trip.segments.length === 1);

  const [expanded, setExpanded] = useState(autoExpand);

  const allPassengers = useMemo(() => {
    const seg = trip.segments[0];
    return seg ? mergePassengers(booking, seg) : [];
  }, [booking, trip]);

  return (
    <div className={cn(
      "bg-white border border-[#EBEBEB] rounded-[16px] shadow-elevation-03 overflow-hidden",
      isCancelled && "opacity-60"
    )}>
      {/* ═══ Always visible ═══ */}
      {trip.segments.map((seg, i) => (
        <Fragment key={seg.id}>
          {i > 0 && <LayoverDivider prevSegment={trip.segments[i - 1]} nextSegment={seg} />}
          <AirlineRow segment={seg} />
          <CompactFlightTimes segment={seg} />
        </Fragment>
      ))}

      {/* Cancelled banner instead of accordion */}
      {isCancelled && <CancelledBanner />}

      {/* ═══ Accordion trigger ═══ */}
      {!isCancelled && (
        <>
          <button
            onClick={() => setExpanded((p) => !p)}
            className={cn(
              "w-full border-t border-[#EBEBEB] px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors duration-200 active:bg-[#EBEBEB]",
              expanded ? "bg-white" : "bg-[#F7F7F7]"
            )}
          >
            <span className="text-xs text-[#717171]">
              {isMultiSegment
                ? t("overview.accordion.detailsMulti")
                : t("overview.accordion.details")}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "text-[#B0B0B0] transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>

          {/* ═══ Accordion content ═══ */}
          <AccordionPanel open={expanded}>
            <PassengerList passengers={allPassengers} booking={booking} />
            <PassengerTable passengers={allPassengers} segment={trip.segments[0]} booking={booking} />
            <div className="mt-1">
              <ActionButtons segments={trip.segments} onAddExtras={onAddExtras} />
            </div>
          </AccordionPanel>
        </>
      )}
    </div>
  );
}
