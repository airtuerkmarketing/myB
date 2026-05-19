import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  ChevronLeft, Smartphone, Download, Mail, Share2, X, Plane,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useTranslation } from "../hooks/useTranslation";
import { flattenSegments, getPassenger } from "../data/dummyData";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Dummy QR Code SVG ─────────────────────────────
function QRCode({ data }) {
  const seed = [...data].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i) => ((seed * 9301 + 49297 + i * 233) % 233280) / 233280;
  const size = 25;
  const cells = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const isBorder = x < 2 || y < 2 || x >= size - 2 || y >= size - 2;
      const isCorner =
        (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      const isFinder =
        isCorner &&
        ((x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7));

      let fill = false;
      if (isFinder) {
        const lx = x < 7 ? x : x >= size - 7 ? x - (size - 7) : x;
        const ly = y < 7 ? y : y >= size - 7 ? y - (size - 7) : y;
        fill = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
      } else if (!isBorder) {
        fill = rng(y * size + x) > 0.48;
      }

      if (fill) {
        cells.push(
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#222222" />
        );
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-[200px] h-[200px]">
      <rect width={size} height={size} fill="white" />
      {cells}
    </svg>
  );
}

// ─── Perforation Line ──────────────────────────────
function Perforation() {
  return (
    <div className="relative h-6 -mx-[1px]">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#F7F7F7]" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-[#F7F7F7]" />
      <div className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-[#E0E0E0]" />
    </div>
  );
}

// ─── Boarding Time (30min before departure) ────────
function getBoardingTime(departureTime) {
  const [h, m] = departureTime.split(":").map(Number);
  let totalMin = h * 60 + m - 30;
  if (totalMin < 0) totalMin += 24 * 60;
  const bh = Math.floor(totalMin / 60) % 24;
  const bm = totalMin % 60;
  return `${String(bh).padStart(2, "0")}:${String(bm).padStart(2, "0")}`;
}

// ─── Format date ───────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

// ─── Single Boarding Pass Card ─────────────────────
function BoardingPassCard({ segment, passenger, passengerDetail, t }) {
  const boardingTime = getBoardingTime(segment.departure.time);

  return (
    <div className="bg-white rounded-[16px] shadow-elevation-01 overflow-hidden">
      {/* 1. Header */}
      <div className="bg-[#0A82DF] text-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AirlineLogo airline={segment.airline.name} size="sm" className="border-2 border-white/30" />
            <span className="text-sm font-semibold">{segment.airline.name}</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold leading-none">{segment.flightNumber}</p>
            <p className="text-sm opacity-80 mt-0.5">{formatDate(segment.departure.date)}</p>
          </div>
        </div>
      </div>

      {/* 2. Route */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-[36px] font-bold leading-none text-[#222222]">{segment.departure.code}</p>
            <p className="text-xs text-[#717171] mt-1">{segment.departure.airport}</p>
            {segment.departure.terminal && (
              <p className="text-[10px] text-[#999] mt-0.5">Terminal {segment.departure.terminal}</p>
            )}
          </div>

          <div className="flex-1 mx-4 flex items-center justify-center relative">
            <div className="w-full border-t-2 border-dashed border-[#D4D4D4]" />
            <div className="absolute bg-white px-2">
              <Plane size={20} className="text-[#0A82DF] rotate-0" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[36px] font-bold leading-none text-[#222222]">{segment.arrival.code}</p>
            <p className="text-xs text-[#717171] mt-1">{segment.arrival.airport}</p>
            {segment.arrival.terminal && (
              <p className="text-[10px] text-[#999] mt-0.5">Terminal {segment.arrival.terminal}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-semibold text-[#222222]">{segment.departure.time}</p>
          <p className="text-xs text-[#999]">{segment.duration}</p>
          <p className="text-lg font-semibold text-[#222222]">{segment.arrival.time}</p>
        </div>
      </div>

      {/* Perforation */}
      <Perforation />

      {/* 3. Details Grid */}
      <div className="px-5 pb-2 grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#999]">{t("boardingpass.passenger")}</p>
          <p className="text-sm font-bold text-[#222222] mt-0.5 leading-tight">
            {passenger.lastName}, {passenger.firstName}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#999]">{t("boardingpass.seat")}</p>
          <p className="text-xl font-bold text-[#222222] mt-0.5 leading-none">
            {passengerDetail.seat ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#999]">{t("boardingpass.gate")}</p>
          <p className="text-xl font-bold text-[#222222] mt-0.5 leading-none">
            {passengerDetail.boardingPass?.gate ?? "TBD"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#999]">{t("boardingpass.class")}</p>
          <p className="text-sm font-semibold text-[#222222] mt-0.5">{segment.cabinClass}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#999]">{t("boardingpass.luggage")}</p>
          <p className="text-sm font-semibold text-[#222222] mt-0.5">{passengerDetail.luggage}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#999]">{t("boardingpass.boarding")}</p>
          <p className="text-sm font-semibold text-[#222222] mt-0.5">{boardingTime}</p>
        </div>
      </div>

      {/* 4. QR Code */}
      <div className="px-5 pb-5 pt-3 flex flex-col items-center">
        <QRCode data={passengerDetail.boardingPass?.qrCode ?? passengerDetail.ticketNumber} />
        <p className="text-[10px] text-[#999] font-mono mt-2 tracking-wider">
          {passengerDetail.ticketNumber}
        </p>
      </div>
    </div>
  );
}

// ─── Passenger Tabs ────────────────────────────────
function PassengerTabs({ passengers, activeIndex, onSelect }) {
  if (passengers.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 px-4 overflow-x-auto scrollbar-hide">
      {passengers.map((pax, i) => (
        <button
          key={pax.id}
          onClick={() => onSelect(i)}
          className={cn(
            "px-3 py-1.5 text-sm whitespace-nowrap rounded-full transition-all",
            i === activeIndex
              ? "font-bold text-[#222222] bg-white shadow-sm"
              : "text-[#717171] hover:text-[#222222]"
          )}
        >
          {pax.firstName}
        </button>
      ))}
    </div>
  );
}

// ─── Dots Indicator ────────────────────────────────
function DotsIndicator({ total, active }) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-3">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-200",
            i === active ? "w-6 h-2 bg-[#0A82DF]" : "w-2 h-2 bg-[#D4D4D4]"
          )}
        />
      ))}
    </div>
  );
}

// ─── Brightness Tip ────────────────────────────────
function BrightnessTip({ onDismiss, t }) {
  return (
    <div className="mx-4 mt-4 flex items-center gap-2 bg-[#F7F7F7] rounded-[10px] px-3 py-2 text-xs text-[#717171] text-center">
      <span className="flex-1">{t("boardingpass.brightnessTip")}</span>
      <button onClick={onDismiss} className="shrink-0 p-0.5 hover:text-[#222222] transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Action Buttons ────────────────────────────────
function ActionButtons({ t }) {
  const action = (key) => () => alert(t(`boardingpass.${key}`));

  return (
    <div className="px-4 mt-5 space-y-2.5 pb-8">
      <Button
        onClick={action("saveWallet")}
        className="w-full h-[46px] rounded-[10px] bg-[#222222] hover:bg-[#333333] text-white text-sm font-semibold"
      >
        <Smartphone size={18} className="mr-2" />
        {t("boardingpass.saveWallet")}
      </Button>
      <Button
        variant="outline"
        onClick={action("downloadPdf")}
        className="w-full h-[46px] rounded-[10px] border-[#EBEBEB] text-[#222222] text-sm font-medium"
      >
        <Download size={18} className="mr-2" />
        {t("boardingpass.downloadPdf")}
      </Button>
      <Button
        variant="outline"
        onClick={action("sendEmail")}
        className="w-full h-[46px] rounded-[10px] border-[#EBEBEB] text-[#222222] text-sm font-medium"
      >
        <Mail size={18} className="mr-2" />
        {t("boardingpass.sendEmail")}
      </Button>
      <Button
        variant="ghost"
        onClick={action("share")}
        className="w-full h-[46px] rounded-[10px] text-[#717171] text-sm font-medium"
      >
        <Share2 size={18} className="mr-2" />
        {t("boardingpass.share")}
      </Button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────
export default function BoardingPassPage() {
  const { segmentId, passengerId } = useParams();
  const { booking } = useBooking();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const carouselRef = useRef(null);
  const isScrolling = useRef(false);

  const segments = useMemo(() => flattenSegments(booking), [booking]);
  const segment = segments.find((s) => s.id === segmentId);

  const checkedInPassengers = useMemo(() => {
    if (!segment) return [];

    if (passengerId) {
      const pd = segment.passengerDetails.find((p) => p.passengerId === passengerId);
      if (!pd) return [];
      const pax = getPassenger(booking, passengerId);
      return pax ? [{ passenger: pax, detail: pd }] : [];
    }

    return segment.passengerDetails
      .filter((pd) => pd.checkedIn && pd.boardingPass)
      .map((pd) => {
        const pax = getPassenger(booking, pd.passengerId);
        return pax ? { passenger: pax, detail: pd } : null;
      })
      .filter(Boolean);
  }, [segment, passengerId, booking]);

  const scrollToIndex = useCallback((i) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.children[i];
    if (!card) return;
    isScrolling.current = true;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIndex(i);
    setTimeout(() => { isScrolling.current = false; }, 400);
  }, []);

  const handleScroll = useCallback(() => {
    if (isScrolling.current) return;
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.children[0]?.offsetWidth ?? 1;
    const gap = 16;
    const idx = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.max(0, Math.min(idx, checkedInPassengers.length - 1)));
  }, [checkedInPassengers.length]);

  useEffect(() => {
    if (passengerId && checkedInPassengers.length === 1) return;
    if (passengerId) {
      const idx = checkedInPassengers.findIndex((p) => p.passenger.id === passengerId);
      if (idx > 0) setActiveIndex(idx);
    }
  }, [passengerId, checkedInPassengers]);

  if (!segment || checkedInPassengers.length === 0) {
    return (
      <main className="flex-1 bg-[#F7F7F7] min-h-[100dvh] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[#717171] mb-4">{t("boardingpass.notFound")}</p>
          <Button
            onClick={() => navigate("/booking")}
            className="rounded-[10px] bg-[#222222] hover:bg-[#333333] text-white"
          >
            {t("checkin.backToOverview")}
          </Button>
        </div>
      </main>
    );
  }

  const isMulti = checkedInPassengers.length > 1;

  return (
    <main className="flex-1 bg-[#F7F7F7] min-h-[100dvh]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#F7F7F7]/90 backdrop-blur-lg">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => navigate("/booking")}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#222222]" />
          </button>
          <h1 className="text-base font-semibold text-[#222222]">{t("boardingpass.title")}</h1>
        </div>

        {isMulti && (
          <PassengerTabs
            passengers={checkedInPassengers.map((p) => p.passenger)}
            activeIndex={activeIndex}
            onSelect={scrollToIndex}
          />
        )}
      </div>

      {/* Brightness Tip */}
      {showTip && <BrightnessTip onDismiss={() => setShowTip(false)} t={t} />}

      {/* Carousel / Single Card */}
      {isMulti ? (
        <>
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 mt-4 scrollbar-hide"
            style={{ scrollPaddingInline: 16 }}
          >
            {checkedInPassengers.map(({ passenger, detail }) => (
              <div key={passenger.id} className="snap-center shrink-0 w-[calc(100vw-32px)] max-w-md">
                <BoardingPassCard
                  segment={segment}
                  passenger={passenger}
                  passengerDetail={detail}
                  t={t}
                />
              </div>
            ))}
          </div>
          <DotsIndicator total={checkedInPassengers.length} active={activeIndex} />
        </>
      ) : (
        <div className="px-4 mt-4 max-w-md mx-auto">
          <BoardingPassCard
            segment={segment}
            passenger={checkedInPassengers[0].passenger}
            passengerDetail={checkedInPassengers[0].detail}
            t={t}
          />
        </div>
      )}

      {/* Actions */}
      <div className="max-w-md mx-auto">
        <ActionButtons t={t} />
      </div>
    </main>
  );
}
