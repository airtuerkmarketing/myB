import { useState, useMemo, useEffect, Fragment } from "react";
import {
  Luggage, Armchair, UtensilsCrossed, Check, Minus, Plus, X, Plane, Briefcase,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBooking } from "../../context/BookingContext";
import { useTranslation } from "../../hooks/useTranslation";
import { extrasCatalog, mergePassengers } from "../../data/dummyData";
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

// ─── Seat map constants ────────────────────────────
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

// ─── Drag handle (mobile sheet) ────────────────────
function DragHandle() {
  return <div className="w-10 h-1 bg-[#DDDDDD] rounded-full mx-auto mt-3" />;
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
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer",
            pax.id === activeId
              ? "bg-[#0A82DF] text-white"
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
// TAB 1: LUGGAGE (Stepper + Passenger Chips)
// ═══════════════════════════════════════════════════
function LuggageTab({ segment, passengers, segmentExtras, segmentId }) {
  const { t } = useTranslation();
  const { addLuggage, removeLuggage } = useBooking();
  const pd = segment.passengerDetails[0];

  return (
    <div className="space-y-1">
      {pd && (
        <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] px-4 py-3 mb-3">
          <Check size={16} className="text-[#1C9218] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#222222]">
              {pd.luggage} {t("extras.inclusive")}
            </p>
            <p className="text-xs text-[#717171]">{t("extras.luggageDesc")}</p>
          </div>
        </div>
      )}

      {extrasCatalog.luggage.map((item) => {
        const paxWithItem = passengers.filter((p) => {
          const paxLug = segmentExtras.luggage[p.id];
          return paxLug && typeof paxLug === "object" && paxLug[item.id] > 0;
        });
        const qty = paxWithItem.length > 0
          ? (segmentExtras.luggage[paxWithItem[0].id]?.[item.id] ?? 0)
          : 0;
        const selectedPaxIds = new Set(paxWithItem.map((p) => p.id));

        const handleIncrement = () => {
          const newQty = qty + 1;
          const targets = selectedPaxIds.size > 0
            ? [...selectedPaxIds]
            : passengers.map((p) => p.id);
          targets.forEach((pid) => addLuggage(segmentId, pid, item.id, newQty));
        };

        const handleDecrement = () => {
          if (qty <= 1) {
            passengers.forEach((p) => removeLuggage(segmentId, p.id, item.id));
          } else {
            const newQty = qty - 1;
            [...selectedPaxIds].forEach((pid) =>
              addLuggage(segmentId, pid, item.id, newQty)
            );
          }
        };

        const togglePax = (paxId) => {
          if (selectedPaxIds.has(paxId)) {
            removeLuggage(segmentId, paxId, item.id);
          } else {
            addLuggage(segmentId, paxId, item.id, qty || 1);
          }
        };

        return (
          <div key={item.id}>
            <div className="flex items-center justify-between py-3 border-b border-[#F7F7F7]">
              <div className="flex items-center gap-3 min-w-0">
                <Briefcase size={20} className="text-[#717171] shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#222222]">{item.name}</p>
                  <p className="text-xs text-[#717171] mt-0.5">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-sm font-semibold text-[#222222]">
                  €{item.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={qty === 0}
                    onClick={handleDecrement}
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                      qty === 0
                        ? "border-[#EBEBEB] text-[#D4D4D4] cursor-not-allowed"
                        : "border-[#EBEBEB] text-[#717171] hover:border-[#222222] cursor-pointer"
                    )}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{qty}</span>
                  <button
                    onClick={handleIncrement}
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer",
                      qty > 0
                        ? "bg-[#0A82DF] text-white border-[#0A82DF]"
                        : "border-[#EBEBEB] text-[#717171] hover:border-[#222222]"
                    )}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {qty > 0 && passengers.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap py-2 pl-8">
                <span className="text-xs text-[#717171]">{t("extras.forWhom")}</span>
                {passengers.map((pax) => (
                  <button
                    key={pax.id}
                    onClick={() => togglePax(pax.id)}
                    className={cn(
                      "text-xs rounded-full px-3 py-1 transition-all cursor-pointer",
                      selectedPaxIds.has(pax.id)
                        ? "bg-[#0A82DF] text-white"
                        : "bg-[#F7F7F7] text-[#222222]"
                    )}
                  >
                    {pax.firstName}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
    setSeat(segmentId, activePax, currentSeat === seatCode ? null : seatCode);
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
            {getSeatPrice(parseInt(currentSeat, 10)) === 0
              ? t("extras.free")
              : `+€${getSeatPrice(parseInt(currentSeat, 10)).toFixed(2)}`}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-[#717171] flex-wrap">
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
          <span className="w-4 h-4 rounded border-2 border-[#F59E0B]" />
          {t("extras.extraLegroom")}
        </span>
      </div>

      {/* Seat map */}
      <div className="overflow-y-auto max-h-[400px] pr-1">
        <div className="flex flex-col items-center gap-0.5">
          {/* Column headers */}
          <div className="flex items-center gap-1">
            <div className="w-6 shrink-0" />
            {COLS.map((c, ci) => (
              <Fragment key={c}>
                {ci === 3 && <div className="w-6 shrink-0" />}
                <div className="w-9 flex items-center justify-center text-[10px] font-medium text-[#999]">
                  {c}
                </div>
              </Fragment>
            ))}
          </div>

          {Array.from({ length: ROWS }, (_, ri) => {
            const row = ri + 1;
            const isExit = EXIT_ROWS.includes(row);

            return (
              <Fragment key={row}>
                {isExit && row === EXIT_ROWS[0] && (
                  <div className="w-full text-center text-[10px] text-[#F59E0B] font-medium py-1 mt-1">
                    {t("extras.extraLegroom")} +€{extrasCatalog.seatPricing.exit}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <div className="w-6 text-right text-[10px] text-[#B0B0B0] font-mono shrink-0">
                    {row}
                  </div>
                  {COLS.map((col, ci) => {
                    const code = `${row}${col}`;
                    const isOcc = occupied.has(code);
                    const takenBy = takenByPassengers[code];
                    const isMine = takenBy === activePax || currentSeat === code;
                    const isOtherPax = takenBy && takenBy !== activePax;

                    let seatClass = "bg-[#F7F7F7] border-[#EBEBEB] hover:bg-[#0A82DF]/10 hover:border-[#0A82DF] cursor-pointer";
                    if (isOcc) seatClass = "bg-[#D4D4D4] cursor-not-allowed";
                    else if (isMine) seatClass = "bg-[#0A82DF] text-white cursor-pointer";
                    else if (isOtherPax) seatClass = "bg-[#1C9218] text-white cursor-not-allowed";
                    else if (isExit) seatClass = "bg-[#F7F7F7] border-[#F59E0B] hover:bg-[#F59E0B]/10 cursor-pointer";

                    return (
                      <Fragment key={col}>
                        {ci === 3 && <div className="w-6 shrink-0" />}
                        <button
                          disabled={isOcc || (isOtherPax && !isMine)}
                          onClick={() => handleSeatClick(code)}
                          className={cn(
                            "w-9 h-9 rounded-md text-[9px] font-medium border transition-all flex items-center justify-center",
                            seatClass
                          )}
                        >
                          {isMine && <Check size={12} />}
                        </button>
                      </Fragment>
                    );
                  })}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TAB 3: MEALS (Grid Cards + Add/Selected Buttons)
// ═══════════════════════════════════════════════════
function MealsTab({ segment, passengers, segmentExtras, segmentId }) {
  const { t } = useTranslation();
  const { toggleMeal } = useBooking();
  const [activePax, setActivePax] = useState(passengers[0]?.id);
  const selectedMeals = segmentExtras.meals[activePax] ?? [];

  return (
    <div className="space-y-4">
      <PassengerPills passengers={passengers} activeId={activePax} onSelect={setActivePax} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {extrasCatalog.meals.map((meal) => {
          const isSelected = selectedMeals.includes(meal.id);
          return (
            <div
              key={meal.id}
              className="bg-white border border-[#EBEBEB] rounded-[16px] p-4 hover:shadow-elevation-02 transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-[32px] leading-none shrink-0">{meal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#222222]">{meal.name}</p>
                    <span className="text-sm font-semibold text-[#222222] shrink-0 ml-2">
                      €{meal.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[#717171] mt-0.5 line-clamp-2">{meal.description}</p>
                  {meal.popular && (
                    <span className="inline-block mt-1.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full px-2.5 py-0.5">
                      {t("extras.popular")}
                    </span>
                  )}
                  <div className="mt-3">
                    <button
                      onClick={() => toggleMeal(segmentId, activePax, meal.id)}
                      className={cn(
                        "text-xs font-semibold rounded-full px-3 py-1.5 transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#1C9218]/10 text-[#1C9218] hover:bg-[#1C9218]/20"
                          : "bg-[#0A82DF]/10 text-[#0A82DF] hover:bg-[#0A82DF]/20"
                      )}
                    >
                      {isSelected ? `${t("extras.selected")} ✓` : t("extras.add")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// EXTRAS CONTENT (Tabs + Sticky Footer)
// ═══════════════════════════════════════════════════
function ExtrasContent({ segment, onClose }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { booking, getSegmentExtras, getSegmentExtrasTotal } = useBooking();

  const passengers = useMemo(
    () => mergePassengers(booking, segment).filter((p) => p.type !== "infant"),
    [booking, segment]
  );

  const segmentExtras = getSegmentExtras(segment.id);
  const total = getSegmentExtrasTotal(segment.id);

  const extrasCount = useMemo(() => {
    let c = 0;
    for (const paxLug of Object.values(segmentExtras.luggage)) {
      if (typeof paxLug === "object" && paxLug !== null) {
        for (const qty of Object.values(paxLug)) c += qty;
      }
    }
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

  const tabTriggerClass = cn(
    "rounded-none bg-transparent shadow-none cursor-pointer",
    "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
    "border-b-2 border-transparent data-[state=active]:border-[#0A82DF]",
    "data-[state=active]:text-[#222222] data-[state=active]:font-semibold",
    "text-[#717171] hover:text-[#222222]",
    "px-4 py-3 text-sm transition-all"
  );

  return (
    <Tabs defaultValue="luggage" className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 px-5 border-b border-[#EBEBEB]">
        <TabsList className="w-full bg-transparent rounded-none h-auto p-0 justify-start gap-0">
          <TabsTrigger value="luggage" className={tabTriggerClass}>
            <Luggage size={16} className="mr-1.5" />
            {t("extras.luggage")}
          </TabsTrigger>
          <TabsTrigger value="seats" className={tabTriggerClass}>
            <Armchair size={16} className="mr-1.5" />
            {t("extras.seatSelection")}
          </TabsTrigger>
          <TabsTrigger value="meals" className={tabTriggerClass}>
            <UtensilsCrossed size={16} className="mr-1.5" />
            {t("extras.meals")}
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <TabsContent value="luggage" className="mt-0">
          <LuggageTab
            segment={segment}
            passengers={passengers}
            segmentExtras={segmentExtras}
            segmentId={segment.id}
          />
        </TabsContent>
        <TabsContent value="seats" className="mt-0">
          <SeatTab
            segment={segment}
            passengers={passengers}
            segmentExtras={segmentExtras}
            segmentId={segment.id}
          />
        </TabsContent>
        <TabsContent value="meals" className="mt-0">
          <MealsTab
            segment={segment}
            passengers={passengers}
            segmentExtras={segmentExtras}
            segmentId={segment.id}
          />
        </TabsContent>
      </div>

      {/* Sticky footer */}
      <div className={cn(
        "border-t border-[#EBEBEB] bg-white px-5 py-4 flex items-center justify-between gap-4 shrink-0",
        isMobile && "pb-[max(env(safe-area-inset-bottom),16px)]"
      )}>
        <div>
          {extrasCount > 0 ? (
            <>
              <p className="text-xs text-[#717171]">
                {t("extras.extrasSelected", { count: extrasCount })}
              </p>
              <p className="text-xl font-bold text-[#222222]">€{total.toFixed(2)}</p>
            </>
          ) : (
            <>
              <p className="text-xs text-[#B0B0B0]">{t("extras.noExtras")}</p>
              <p className="text-xl font-bold text-[#B0B0B0]">€0.00</p>
            </>
          )}
        </div>
        <button
          onClick={handleApply}
          disabled={extrasCount === 0}
          className="h-[46px] px-8 bg-[#222222] hover:bg-[#333333] text-white font-semibold text-sm rounded-[10px] transition-colors cursor-pointer disabled:opacity-50"
        >
          {t("extras.addToBooking")}
        </button>
      </div>
    </Tabs>
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
          className="max-h-[90vh] rounded-t-2xl flex flex-col p-0 [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t("extras.title")}</SheetTitle>
            <SheetDescription>{t("extras.title")}</SheetDescription>
          </SheetHeader>

          <DragHandle />
          <div className="px-5 pt-4 pb-3 border-b border-[#EBEBEB] relative">
            <h2 className="text-lg font-bold text-[#222222]">{t("extras.title")}</h2>
            <p className="text-sm text-[#717171] mt-0.5">
              {segment.airline.name} {segment.flightNumber} · {segment.departure.code} → {segment.arrival.code}
            </p>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            >
              <X size={18} className="text-[#717171]" />
            </button>
          </div>

          <ExtrasContent segment={segment} onClose={onClose} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-[16px] [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("extras.title")}</DialogTitle>
          <DialogDescription>{t("extras.title")}</DialogDescription>
        </DialogHeader>

        <div className="px-5 pt-5 pb-3 border-b border-[#EBEBEB] relative">
          <h2 className="text-lg font-bold text-[#222222]">{t("extras.title")}</h2>
          <p className="text-sm text-[#717171] mt-0.5">
            {segment.airline.name} {segment.flightNumber} · {segment.departure.code} → {segment.arrival.code}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            <X size={18} className="text-[#717171]" />
          </button>
        </div>

        <ExtrasContent segment={segment} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
