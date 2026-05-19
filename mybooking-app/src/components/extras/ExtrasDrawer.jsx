import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Luggage, Armchair, UtensilsCrossed, Check, Minus, Plus, X, Plane,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBooking } from "../../context/BookingContext";
import { useTranslation } from "../../hooks/useTranslation";
import { extrasCatalog, getPassenger, mergePassengers } from "../../data/dummyData";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

// ─── Media query hook ──────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

// ─── Seat map generation ───────────────────────────
const ROWS = 30;
const COLS = ["A", "B", "C", "D", "E", "F"];
const EXIT_ROWS = [12, 13];
const FRONT_ROWS = [1, 2, 3, 4, 5];

function generateOccupied(segmentId) {
  const seed = [...segmentId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i) => ((seed * 9301 + 49297 + i * 233) % 233280) / 233280;
  const occ = new Set();
  for (let r = 1; r <= ROWS; r++) {
    for (let ci = 0; ci < COLS.length; ci++) {
      if (rng(r * 10 + ci) > 0.55) occ.add(`${r}${COLS[ci]}`);
    }
  }
  return occ;
}

function getSeatPrice(row) {
  if (EXIT_ROWS.includes(row)) return extrasCatalog.seatPricing.exit;
  if (FRONT_ROWS.includes(row)) return extrasCatalog.seatPricing.front;
  return extrasCatalog.seatPricing.standard;
}

// ─── Route Info ────────────────────────────────────
function RouteInfo({ segment }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#717171] pb-2">
      <span className="font-semibold text-[#222222]">{segment.departure.code}</span>
      <Plane size={14} className="text-[#0A82DF]" />
      <span className="font-semibold text-[#222222]">{segment.arrival.code}</span>
      <span className="text-[#B0B0B0]">·</span>
      <span>{segment.flightNumber}</span>
      <span className="text-[#B0B0B0]">·</span>
      <span>{segment.departure.date}</span>
    </div>
  );
}

// ─── Passenger pill selector ───────────────────────
function PassengerPills({ passengers, activeId, onSelect }) {
  if (passengers.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {passengers.map((pax) => (
        <button
          key={pax.id}
          onClick={() => onSelect(pax.id)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            pax.id === activeId
              ? "bg-[#222222] text-white"
              : "bg-[#F7F7F7] text-[#717171] hover:bg-[#EBEBEB]"
          )}
        >
          {pax.firstName} {pax.lastName}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TAB 1: LUGGAGE
// ═══════════════════════════════════════════════════
function LuggageTab({ segment, passengers, segmentExtras, segmentId }) {
  const { t } = useTranslation();
  const { setLuggage } = useBooking();
  const [activePax, setActivePax] = useState(passengers[0]?.id);

  const pax = passengers.find((p) => p.id === activePax) ?? passengers[0];
  const pd = segment.passengerDetails.find((d) => d.passengerId === pax?.id);
  const selectedId = segmentExtras.luggage[pax?.id] ?? null;

  return (
    <div className="space-y-4">
      <PassengerPills passengers={passengers} activeId={activePax} onSelect={setActivePax} />

      {/* Inclusive luggage */}
      {pd && (
        <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] px-4 py-3">
          <Check size={16} className="text-[#1C9218] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#222222]">
              {pd.luggage} {t("extras.inclusive")}
            </p>
            <p className="text-xs text-[#717171]">{t("extras.luggageDesc")}</p>
          </div>
        </div>
      )}

      {/* Add-on options */}
      <div className="space-y-2">
        {extrasCatalog.luggage.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setLuggage(segmentId, pax.id, isSelected ? null : item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-[10px] border transition-all text-left",
                isSelected
                  ? "border-[#0A82DF] bg-[#EFF6FF]"
                  : "border-[#EBEBEB] bg-white hover:border-[#D4D4D4]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "border-[#0A82DF] bg-[#0A82DF]" : "border-[#D4D4D4]"
                )}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#222222]">{item.name}</p>
                  <p className="text-xs text-[#717171]">{item.description}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#222222] shrink-0 ml-3">
                €{item.price.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TAB 2: SEAT MAP
// ═══════════════════════════════════════════════════
function SeatTab({ segment, passengers, segmentExtras, segmentId }) {
  const { t } = useTranslation();
  const { setSeat } = useBooking();
  const [activePax, setActivePax] = useState(passengers[0]?.id);

  const occupied = useMemo(() => generateOccupied(segmentId), [segmentId]);

  const takenByPassengers = useMemo(() => {
    const map = {};
    for (const pd of segment.passengerDetails) {
      if (pd.seat) map[pd.seat] = pd.passengerId;
    }
    for (const [pId, seatCode] of Object.entries(segmentExtras.seats)) {
      map[seatCode] = pId;
    }
    return map;
  }, [segment, segmentExtras.seats]);

  const currentSeat = segmentExtras.seats[activePax] ??
    segment.passengerDetails.find((pd) => pd.passengerId === activePax)?.seat ?? null;

  const handleSeatClick = (seatCode) => {
    if (occupied.has(seatCode)) return;
    const takenBy = takenByPassengers[seatCode];
    if (takenBy && takenBy !== activePax) return;

    if (currentSeat === seatCode) {
      setSeat(segmentId, activePax, null);
    } else {
      setSeat(segmentId, activePax, seatCode);
    }
  };

  return (
    <div className="space-y-4">
      <PassengerPills passengers={passengers} activeId={activePax} onSelect={setActivePax} />

      {currentSeat && (
        <div className="flex items-center justify-between bg-[#EFF6FF] border border-[#BFDBFE] rounded-[10px] px-4 py-2.5">
          <span className="text-sm text-[#222222]">
            {passengers.find((p) => p.id === activePax)?.firstName}: <strong>{currentSeat}</strong>
          </span>
          <span className="text-xs text-[#0A82DF] font-medium">
            €{getSeatPrice(parseInt(currentSeat, 10)).toFixed(2)}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-[#717171]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[#F7F7F7] border border-[#EBEBEB]" />
          {t("extras.seatFree")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[#D4D4D4]" />
          {t("extras.seatOccupied")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[#0A82DF]" />
          {t("extras.seatYours")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[#E8F5E9] border border-[#A5D6A7]" />
          {t("extras.extraLegroom")}
        </span>
      </div>

      {/* Seat map */}
      <div className="overflow-y-auto max-h-[400px] pr-1">
        <div className="flex flex-col items-center gap-1">
          {/* Column headers */}
          <div className="grid grid-cols-[repeat(3,28px)_20px_repeat(3,28px)] gap-1 mb-1">
            {COLS.slice(0, 3).map((c) => (
              <div key={c} className="text-center text-[10px] font-medium text-[#999]">{c}</div>
            ))}
            <div />
            {COLS.slice(3).map((c) => (
              <div key={c} className="text-center text-[10px] font-medium text-[#999]">{c}</div>
            ))}
          </div>

          {Array.from({ length: ROWS }, (_, ri) => {
            const row = ri + 1;
            const isExit = EXIT_ROWS.includes(row);
            return (
              <div key={row} className="flex items-center gap-0">
                <div className="grid grid-cols-[repeat(3,28px)_20px_repeat(3,28px)] gap-1">
                  {COLS.map((col, ci) => {
                    const code = `${row}${col}`;
                    const isOcc = occupied.has(code);
                    const takenBy = takenByPassengers[code];
                    const isMine = takenBy === activePax || currentSeat === code;
                    const isOtherPax = takenBy && takenBy !== activePax;
                    const isExitSeat = isExit;

                    let bg = "bg-[#F7F7F7] border-[#EBEBEB] hover:bg-[#E8E8E8] cursor-pointer";
                    if (isOcc) bg = "bg-[#D4D4D4] cursor-not-allowed";
                    else if (isMine) bg = "bg-[#0A82DF] text-white cursor-pointer";
                    else if (isOtherPax) bg = "bg-[#BFDBFE] cursor-not-allowed";
                    else if (isExitSeat) bg = "bg-[#E8F5E9] border-[#A5D6A7] hover:bg-[#C8E6C9] cursor-pointer";

                    const el = (
                      <button
                        key={col}
                        disabled={isOcc || isOtherPax}
                        onClick={() => handleSeatClick(code)}
                        className={cn(
                          "w-7 h-7 rounded text-[9px] font-medium border transition-all flex items-center justify-center",
                          bg
                        )}
                      >
                        {isMine ? <Check size={12} /> : null}
                      </button>
                    );

                    if (ci === 3) {
                      return [
                        <div key="aisle" className="w-5 flex items-center justify-center text-[9px] text-[#B0B0B0] font-mono">
                          {row}
                        </div>,
                        el,
                      ];
                    }
                    return el;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TAB 3: MEALS
// ═══════════════════════════════════════════════════
function MealsTab({ segment, passengers, segmentExtras, segmentId }) {
  const { t } = useTranslation();
  const { toggleMeal } = useBooking();
  const [activePax, setActivePax] = useState(passengers[0]?.id);

  const selectedMeals = segmentExtras.meals[activePax] ?? [];

  return (
    <div className="space-y-4">
      <PassengerPills passengers={passengers} activeId={activePax} onSelect={setActivePax} />

      <div className="space-y-2">
        {extrasCatalog.meals.map((meal) => {
          const isSelected = selectedMeals.includes(meal.id);
          return (
            <button
              key={meal.id}
              onClick={() => toggleMeal(segmentId, activePax, meal.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border transition-all text-left",
                isSelected
                  ? "border-[#0A82DF] bg-[#EFF6FF]"
                  : "border-[#EBEBEB] bg-white hover:border-[#D4D4D4]"
              )}
            >
              <span className="text-2xl shrink-0">{meal.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#222222]">{meal.name}</p>
                  {meal.popular && (
                    <span className="px-1.5 py-0.5 bg-[#FEF3C7] text-[#92400E] text-[10px] font-semibold rounded">
                      {t("extras.popular")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#717171] truncate">{meal.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold text-[#222222]">€{meal.price.toFixed(2)}</span>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "border-[#0A82DF] bg-[#0A82DF]" : "border-[#D4D4D4]"
                )}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// EXTRAS CONTENT (shared between Sheet and Dialog)
// ═══════════════════════════════════════════════════
function ExtrasContent({ segment, onClose }) {
  const { t } = useTranslation();
  const { booking, getSegmentExtras, getSegmentExtrasTotal } = useBooking();

  const passengers = useMemo(
    () => mergePassengers(booking, segment).filter((p) => p.type !== "infant"),
    [booking, segment]
  );

  const segmentExtras = getSegmentExtras(segment.id);
  const total = getSegmentExtrasTotal(segment.id);

  const extrasCount = useMemo(() => {
    let c = 0;
    c += Object.keys(segmentExtras.luggage).length;
    c += Object.keys(segmentExtras.seats).length;
    for (const mealIds of Object.values(segmentExtras.meals)) c += mealIds.length;
    return c;
  }, [segmentExtras]);

  const handleApply = () => {
    toast({
      title: t("extras.saved"),
      description: extrasCount > 0
        ? t("extras.extrasSelected", { count: extrasCount })
        : t("extras.noExtras"),
      variant: "default",
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <RouteInfo segment={segment} />

        <Tabs defaultValue="luggage" className="mt-2">
          <TabsList className="w-full grid grid-cols-3 h-11 bg-[#F7F7F7] rounded-[10px] p-1">
            <TabsTrigger
              value="luggage"
              className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5"
            >
              <Luggage size={14} />
              {t("extras.luggage")}
            </TabsTrigger>
            <TabsTrigger
              value="seats"
              className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5"
            >
              <Armchair size={14} />
              {t("extras.seatSelection")}
            </TabsTrigger>
            <TabsTrigger
              value="meals"
              className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5"
            >
              <UtensilsCrossed size={14} />
              {t("extras.meals")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="luggage" className="mt-4">
            <LuggageTab
              segment={segment}
              passengers={passengers}
              segmentExtras={segmentExtras}
              segmentId={segment.id}
            />
          </TabsContent>

          <TabsContent value="seats" className="mt-4">
            <SeatTab
              segment={segment}
              passengers={passengers}
              segmentExtras={segmentExtras}
              segmentId={segment.id}
            />
          </TabsContent>

          <TabsContent value="meals" className="mt-4">
            <MealsTab
              segment={segment}
              passengers={passengers}
              segmentExtras={segmentExtras}
              segmentId={segment.id}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky footer */}
      <div className="border-t border-[#EBEBEB] bg-white px-5 py-4 flex items-center justify-between gap-4">
        <div>
          {total > 0 ? (
            <>
              <p className="text-xs text-[#717171]">{t("extras.extrasSelected", { count: extrasCount })}</p>
              <p className="text-lg font-bold text-[#222222]">€{total.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-sm text-[#717171]">{t("extras.noExtras")}</p>
          )}
        </div>
        <button
          onClick={handleApply}
          className="h-[46px] px-8 bg-[#222222] hover:bg-[#333333] text-white font-semibold text-sm rounded-[10px] transition-colors"
        >
          {t("extras.addToBooking")}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN EXPORT: RESPONSIVE EXTRAS DRAWER
// ═══════════════════════════════════════════════════
export default function ExtrasDrawer({ open, onClose, segment }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  if (!segment) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent
          side="bottom"
          className="max-h-[92dvh] rounded-t-2xl flex flex-col p-0"
        >
          <SheetHeader className="px-5 pt-5 pb-0">
            <SheetTitle className="text-lg font-bold text-[#222222]">
              {t("extras.title")}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {t("extras.title")}
            </SheetDescription>
          </SheetHeader>
          <ExtrasContent segment={segment} onClose={onClose} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-lg font-bold text-[#222222]">
            {t("extras.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("extras.title")}
          </DialogDescription>
        </DialogHeader>
        <ExtrasContent segment={segment} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
