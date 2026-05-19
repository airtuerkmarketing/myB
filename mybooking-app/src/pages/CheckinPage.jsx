import { useState, useMemo, useCallback, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Calendar, Clock, Check, ChevronRight,
  Armchair, Luggage, UtensilsCrossed, Plus, Minus,
  CheckCircle2, CreditCard, ArrowLeft, Loader2,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useTranslation } from "../hooks/useTranslation";
import {
  flattenSegments, mergePassengers, getPassenger, extrasCatalog,
} from "../data/dummyData";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

const TOTAL_STEPS = 3;

// ─── Progress Steps ─────────────────────────────

function ProgressSteps({ currentStep }) {
  const { t } = useTranslation();
  const steps = [
    { key: 1, label: t("checkin.stepPassengers") },
    { key: 2, label: t("checkin.stepExtras") },
    { key: 3, label: t("checkin.stepConfirmation") },
  ];

  return (
    <div className="flex items-center justify-between px-4 mt-6 mb-6">
      {steps.map((step, i) => {
        const isActive = step.key === currentStep;
        const isCompleted = step.key < currentStep;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  isCompleted ? "bg-[#1C9218] text-white" :
                  isActive ? "bg-[#0A82DF] text-white" :
                  "bg-[#F7F7F7] text-[#B0B0B0]"
                )}
              >
                {isCompleted ? <Check size={14} strokeWidth={2.5} /> : step.key}
              </div>
              <span className={cn(
                "text-[10px] text-center mt-1 whitespace-nowrap",
                isActive ? "text-[#0A82DF] font-semibold" :
                isCompleted ? "text-[#1C9218] font-medium" :
                "text-[#B0B0B0]"
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 mb-4",
                step.key < currentStep ? "bg-[#1C9218]" : "bg-[#EBEBEB]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Passenger Selection ────────────────

function PassengerStep({ passengers, selectedIds, onToggle, onSelectAll, booking }) {
  const { t } = useTranslation();
  const uncheckedPassengers = passengers.filter((p) => !p.checkedIn);
  const checkedPassengers = passengers.filter((p) => p.checkedIn);
  const showSelectAll = uncheckedPassengers.length > 2;
  const allSelected = uncheckedPassengers.every((p) => selectedIds.includes(p.id));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#222222]">{t("checkin.whosFlying")}</h2>
        {showSelectAll && (
          <button
            onClick={onSelectAll}
            className="text-xs text-[#0A82DF] font-medium cursor-pointer hover:underline"
          >
            {allSelected ? t("checkin.selectAll") : t("checkin.selectAll")}
          </button>
        )}
      </div>

      <div className="border-t border-[#EBEBEB] mt-3" />

      {/* Unchecked passengers */}
      {uncheckedPassengers.map((p) => {
        const isSelected = selectedIds.includes(p.id);
        const linkedAdult = p.linkedAdult ? getPassenger(booking, p.linkedAdult) : null;

        return (
          <button
            key={p.id}
            onClick={() => onToggle(p.id)}
            className={cn(
              "w-full flex items-center gap-3 py-4 border-b border-[#EBEBEB]/50 cursor-pointer transition-all text-left",
              isSelected && "bg-[#0A82DF]/[0.03] rounded-xl px-3 -mx-3"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
              isSelected ? "bg-[#0A82DF]/10 text-[#0A82DF]" : "bg-[#F7F7F7] text-[#717171]"
            )}>
              {p.firstName[0]}{p.lastName[0]}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#222222]">
                {p.firstName} {p.lastName}
              </p>
              {p.type === "infant" && linkedAdult ? (
                <p className="text-xs text-[#717171]">
                  {t("checkin.infantInfo", { name: p.firstName, adult: linkedAdult.firstName })}
                </p>
              ) : p.type === "child" && linkedAdult ? (
                <p className="text-xs text-[#717171]">
                  {t("checkin.travelsWith", { adult: linkedAdult.firstName })}
                </p>
              ) : p.seat ? (
                <p className="text-xs text-[#717171]">Seat {p.seat}</p>
              ) : (
                <p className="text-xs text-[#F59E0B]">{t("checkin.noSeatSelected")}</p>
              )}
            </div>

            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
              isSelected ? "bg-[#0A82DF] border-[#0A82DF]" : "bg-white border-[#EBEBEB]"
            )}>
              {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
          </button>
        );
      })}

      {/* Already checked-in passengers */}
      {checkedPassengers.map((p) => (
        <div key={p.id} className="flex items-center gap-3 py-4 border-b border-[#EBEBEB]/50 opacity-60">
          <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#1C9218] flex items-center justify-center text-xs font-semibold shrink-0">
            {p.firstName[0]}{p.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#222222]">{p.firstName} {p.lastName}</p>
            <p className="text-xs text-[#1C9218]">{t("checkin.alreadyCheckedIn")}</p>
          </div>
          <Check size={18} className="text-[#1C9218] shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Step 2: Extras ─────────────────────────────

function ExtrasStep({ selectedIds, passengers, selectedMeals, onToggleMeal, onSkip, meals, segment }) {
  const { t } = useTranslation();
  const [mealSheetOpen, setMealSheetOpen] = useState(false);
  const mealCount = selectedMeals.length;

  const firstSelected = passengers.find((p) => selectedIds.includes(p.id));
  const firstSelectedName = firstSelected ? `${firstSelected.firstName} ${firstSelected.lastName}` : "";

  const seatInfo = (() => {
    const p = passengers.find((p) => selectedIds.includes(p.id));
    return p?.seat || null;
  })();

  const luggageInfo = (() => {
    const p = passengers.find((p) => selectedIds.includes(p.id));
    return p?.luggage || null;
  })();

  const cards = [
    {
      icon: Armchair,
      title: t("checkin.seatCard"),
      status: seatInfo ? t("checkin.seatConfirmed", { seat: seatInfo }) : t("checkin.noSeatSelected"),
      statusColor: seatInfo ? "text-[#1C9218]" : "text-[#F59E0B]",
      onClick: () => toast({ title: "Sitzplatzwahl kommt bald", variant: "default" }),
    },
    {
      icon: Luggage,
      title: t("checkin.luggageCard"),
      status: luggageInfo ? t("checkin.includedLuggage", { weight: luggageInfo }) : t("checkin.nothingChosen"),
      statusColor: luggageInfo ? "text-[#1C9218]" : "text-[#717171]",
      onClick: () => toast({ title: "Gepäckoptionen kommen bald", variant: "default" }),
    },
    {
      icon: UtensilsCrossed,
      title: t("checkin.mealCard"),
      status: mealCount > 0 ? t("checkin.mealsSelected", { count: mealCount }) : t("checkin.nothingChosen"),
      statusColor: mealCount > 0 ? "text-[#1C9218]" : "text-[#717171]",
      onClick: () => setMealSheetOpen(true),
    },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-[#222222]">{t("checkin.stepExtras")}</h2>
      <div className="border-t border-[#EBEBEB] mt-3" />

      <div className="flex flex-col gap-3 mt-4">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={card.onClick}
            className="bg-white border border-[#EBEBEB] rounded-[16px] p-4 flex items-center justify-between cursor-pointer hover:bg-[#F7F7F7]/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <card.icon size={20} className="text-[#717171] shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#222222]">{card.title}</p>
                <p className={cn("text-xs mt-0.5", card.statusColor)}>{card.status}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#B0B0B0] shrink-0" />
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={onSkip}
          className="text-sm text-[#717171] underline cursor-pointer hover:text-[#222222] transition-colors"
        >
          {t("checkin.skip")}
        </button>
      </div>

      {/* Meal Bottom Sheet */}
      <Sheet open={mealSheetOpen} onOpenChange={setMealSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <div className="md:hidden flex justify-center pt-1 pb-2">
            <div className="w-10 h-1 rounded-full bg-[#EBEBEB]" />
          </div>
          <SheetHeader>
            <SheetTitle>{t("checkin.browseMenu")}</SheetTitle>
            <SheetDescription>{firstSelectedName}</SheetDescription>
          </SheetHeader>

          <div className="p-5 flex flex-col gap-3">
            {meals.map((meal) => {
              const isSelected = selectedMeals.includes(meal.id);
              return (
                <button
                  key={meal.id}
                  onClick={() => onToggleMeal(meal.id)}
                  className={cn(
                    "w-full flex items-center gap-3.5 p-3.5 rounded-[10px] border text-left transition-all cursor-pointer",
                    isSelected ? "bg-[#0A82DF]/5 border-[#0A82DF]/20" : "bg-white border-[#EBEBEB] hover:border-[#B0B0B0]"
                  )}
                >
                  <span className="text-[32px] shrink-0">{meal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[#222222]">{meal.name}</span>
                      {meal.popular && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold rounded-full px-2 py-0.5">
                          {t("extras.popular")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#717171] mt-0.5 line-clamp-1">{meal.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-semibold text-[#222222]">€{meal.price.toFixed(0)}</span>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                      isSelected ? "bg-[#0A82DF] text-white" : "bg-[#F7F7F7] text-[#717171]"
                    )}>
                      {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Step 3: Confirmation ───────────────────────

function ConfirmationStep({ passengers, selectedIds, selectedMeals, meals, segment, confirmed, onConfirm }) {
  const { t } = useTranslation();
  const selectedPax = passengers.filter((p) => selectedIds.includes(p.id));
  const selectedMealItems = meals.filter((m) => selectedMeals.includes(m.id));
  const mealTotal = selectedMealItems.reduce((sum, m) => sum + m.price, 0);

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-[#222222]">{t("checkin.summary")}</h2>
      <div className="border-t border-[#EBEBEB] mt-3" />

      {/* Route */}
      <div className="mt-4 bg-[#F7F7F7] rounded-[10px] p-4">
        <p className="text-xs text-[#717171] uppercase tracking-wider font-medium">{t("checkin.route")}</p>
        <p className="text-sm font-semibold text-[#222222] mt-1">
          {segment.departure.airport} → {segment.arrival.airport}
        </p>
        <p className="text-xs text-[#717171] mt-0.5">
          {segment.departure.date} · {segment.departure.time} – {segment.arrival.time} · {segment.airline.name} {segment.flightNumber}
        </p>
      </div>

      {/* Passengers */}
      <div className="mt-4">
        <p className="text-xs text-[#717171] uppercase tracking-wider font-medium">{t("checkin.passengersLabel")}</p>
        <div className="mt-2 space-y-2">
          {selectedPax.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#222222]">{p.firstName} {p.lastName}</span>
              {p.seat ? (
                <span className="text-xs font-mono text-[#222222] bg-[#F7F7F7] rounded-md px-1.5 py-0.5">
                  {p.seat}
                </span>
              ) : (
                <span className="text-xs text-[#B0B0B0]">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className="mt-4">
        <p className="text-xs text-[#717171] uppercase tracking-wider font-medium">{t("checkin.stepExtras")}</p>
        {selectedMealItems.length > 0 ? (
          <div className="mt-2 space-y-2">
            {selectedMealItems.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-[#222222]">{m.emoji} {m.name}</span>
                <span className="font-semibold text-[#222222]">€{m.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#B0B0B0] mt-2">{t("checkin.noExtras")}</p>
        )}
      </div>

      {/* Total */}
      {mealTotal > 0 && (
        <div className="mt-4 pt-3 border-t border-[#EBEBEB] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#222222]">{t("checkin.total")}</span>
          <span className="text-lg font-bold text-[#222222]">€{mealTotal.toFixed(2)}</span>
        </div>
      )}

      {/* Confirm checkbox */}
      <button
        onClick={onConfirm}
        className="mt-6 flex items-center gap-3 w-full text-left cursor-pointer"
      >
        <div className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
          confirmed ? "bg-[#0A82DF] border-[#0A82DF]" : "bg-white border-[#EBEBEB]"
        )}>
          {confirmed && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <span className="text-sm text-[#717171]">{t("checkin.confirmCheck")}</span>
      </button>
    </div>
  );
}

// ─── Success Screen ─────────────────────────────

function SuccessScreen({ names, flightNumber, segmentId, firstPassengerId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-white min-h-[100dvh]">
      <div className="animate-bounce-in">
        <CheckCircle2 size={64} className="text-[#1C9218]" strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl font-bold text-[#222222] mt-6 text-center">
        {t("checkin.successTitle")}
      </h1>
      <p className="text-sm text-[#717171] mt-2 text-center max-w-xs">
        {t("checkin.successSubtitle")}
      </p>
      <p className="text-sm text-[#717171] mt-3 text-center max-w-xs">
        {t("checkin.successSummary", { names, flight: flightNumber })}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
        <button
          onClick={() => navigate(`/boardingpass/${segmentId}`)}
          className="w-full h-[46px] bg-[#0A82DF] text-white rounded-[10px] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0B6AB2] transition-colors cursor-pointer"
        >
          <CreditCard size={18} />
          {t("checkin.viewBoardingPasses")}
        </button>
        <button
          onClick={() => navigate("/booking")}
          className="w-full h-[46px] bg-white text-[#717171] rounded-[10px] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#F7F7F7] transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          {t("checkin.backToOverview")}
        </button>
      </div>
    </div>
  );
}

// ─── Sticky Footer ──────────────────────────────

function StickyFooter({ currentStep, total, onAction, disabled, isProcessing }) {
  const { t } = useTranslation();
  const isLast = currentStep === TOTAL_STEPS;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#EBEBEB]">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        <div>
          {isLast && total > 0 ? (
            <>
              <p className="text-xs text-[#717171]">{t("checkin.total")}</p>
              <p className="text-xl font-bold text-[#222222]">€{total.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-sm text-[#717171]">
              {t("checkin.stepOf", { current: currentStep, total: TOTAL_STEPS })}
            </p>
          )}
        </div>

        <button
          disabled={disabled}
          onClick={onAction}
          className={cn(
            "h-[46px] px-8 rounded-[10px] font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer",
            isLast
              ? "bg-[#1C9218] text-white hover:brightness-110 disabled:opacity-50"
              : "bg-[#0A82DF] text-white hover:bg-[#0B6AB2] disabled:opacity-50"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>{t("checkin.processing")}</span>
            </>
          ) : isLast ? (
            t("checkin.doCheckin")
          ) : (
            t("checkin.next")
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────

export default function CheckinPage() {
  const { segmentId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { booking, checkInPassengers } = useBooking();

  const segments = useMemo(() => flattenSegments(booking), [booking]);
  const segment = segments.find((s) => s.id === segmentId) ?? segments[0];
  const passengers = useMemo(() => mergePassengers(booking, segment), [booking, segment]);

  const [currentStep, setCurrentStep] = useState(1);
  const uncheckedIds = useMemo(
    () => passengers.filter((p) => !p.checkedIn).map((p) => p.id),
    [passengers]
  );
  const [selectedPassengers, setSelectedPassengers] = useState(() =>
    uncheckedIds.length > 0 ? [uncheckedIds[0]] : []
  );
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const meals = extrasCatalog.meals;

  const togglePassenger = useCallback((id) => {
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const selectAllPassengers = useCallback(() => {
    setSelectedPassengers((prev) =>
      prev.length === uncheckedIds.length ? [] : [...uncheckedIds]
    );
  }, [uncheckedIds]);

  const toggleMeal = useCallback((mealId) => {
    setSelectedMeals((prev) => {
      const isRemoving = prev.includes(mealId);
      const next = isRemoving ? prev.filter((m) => m !== mealId) : [...prev, mealId];
      const meal = meals.find((m) => m.id === mealId);
      if (meal && !isRemoving) {
        toast({ title: meal.name, variant: "success" });
      }
      return next;
    });
  }, [meals]);

  const total = useMemo(
    () => selectedMeals.reduce((sum, id) => {
      const m = meals.find((meal) => meal.id === id);
      return sum + (m?.price ?? 0);
    }, 0),
    [selectedMeals, meals]
  );

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCheckin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      checkInPassengers(segment.id, selectedPassengers);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    const names = selectedPassengers
      .map((id) => passengers.find((p) => p.id === id)?.firstName)
      .filter(Boolean)
      .join(", ");
    const firstPax = selectedPassengers[0];
    return (
      <SuccessScreen
        names={names}
        flightNumber={segment.flightNumber}
        segmentId={segment.id}
        firstPassengerId={firstPax}
      />
    );
  }

  const isStepDisabled =
    currentStep === 1 ? selectedPassengers.length === 0 :
    currentStep === 3 ? !confirmed || isProcessing :
    false;

  return (
    <div className="bg-white min-h-[100dvh] flex flex-col">
      {/* Blue accent line */}
      <div className="w-full h-1 bg-[#0A82DF]" />

      {/* Header */}
      <div className="py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep((s) => s - 1) : navigate("/booking")}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} className="text-[#222222]" />
          </button>
          <span className="text-sm font-medium text-[#222222]">{t("checkin.title")}</span>
        </div>
        <span className="text-[11px] text-[#B0B0B0] font-mono">
          REF: {booking.airtuerkRef}
        </span>
      </div>

      <div className="border-t border-[#EBEBEB]" />

      {/* Route info */}
      <div className="px-4 mt-4 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold text-[#222222] tracking-tight">
          {t("checkin.routeTo", { from: segment.departure.airport, to: segment.arrival.airport })}
        </h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-[#717171]">
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
          <span className="text-sm font-medium text-[#222222]">{segment.airline.name}</span>
          <span className="bg-[#F7F7F7] text-[#717171] text-[11px] font-mono rounded-md px-1.5 py-0.5 border border-[#EBEBEB]">
            {segment.flightNumber}
          </span>
          <span className="text-sm text-[#717171]">·</span>
          <span className="text-sm text-[#717171]">{segment.cabinClass}</span>
          <span className="text-sm text-[#717171]">·</span>
          <span className="text-sm text-[#717171]">{segment.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 flex-1 pb-28 w-full">
        <ProgressSteps currentStep={currentStep} />

        {currentStep === 1 && (
          <PassengerStep
            passengers={passengers}
            selectedIds={selectedPassengers}
            onToggle={togglePassenger}
            onSelectAll={selectAllPassengers}
            booking={booking}
          />
        )}

        {currentStep === 2 && (
          <ExtrasStep
            selectedIds={selectedPassengers}
            passengers={passengers}
            selectedMeals={selectedMeals}
            onToggleMeal={toggleMeal}
            onSkip={() => { setCurrentStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            meals={meals}
            segment={segment}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep
            passengers={passengers}
            selectedIds={selectedPassengers}
            selectedMeals={selectedMeals}
            meals={meals}
            segment={segment}
            confirmed={confirmed}
            onConfirm={() => setConfirmed((c) => !c)}
          />
        )}
      </div>

      {/* Sticky Footer */}
      <StickyFooter
        currentStep={currentStep}
        total={total}
        onAction={currentStep === TOTAL_STEPS ? handleCheckin : handleNext}
        disabled={isStepDisabled}
        isProcessing={isProcessing}
      />
    </div>
  );
}
