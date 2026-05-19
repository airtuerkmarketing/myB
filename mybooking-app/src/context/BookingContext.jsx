import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { scenarios, defaultScenario, getSegmentCheckinSummary, extrasCatalog } from "../data/dummyData";

const BookingContext = createContext(null);

const emptySegExtras = () => ({ luggage: {}, seats: {}, meals: {} });

export function BookingProvider({ children }) {
  const [activeScenario, setActiveScenario] = useState(defaultScenario);
  const [booking, setBooking] = useState(() => structuredClone(scenarios[defaultScenario].booking));
  const [selectedExtras, setSelectedExtras] = useState({});

  const switchScenario = useCallback((scenarioId) => {
    setActiveScenario(scenarioId);
    setBooking(structuredClone(scenarios[scenarioId].booking));
    setSelectedExtras({});
  }, []);

  const checkInPassengers = useCallback((segmentId, passengerIds) => {
    setBooking((prev) => {
      const next = structuredClone(prev);
      for (const trip of next.trips) {
        for (const seg of trip.segments) {
          if (seg.id === segmentId) {
            for (const pd of seg.passengerDetails) {
              if (passengerIds.includes(pd.passengerId)) {
                pd.checkedIn = true;
                pd.boardingPass = {
                  qrCode: `BP-${pd.passengerId}-${seg.flightNumber}-${pd.seat ?? "NS"}`,
                  gate: seg.departure.gate ?? "TBD",
                };
              }
            }
            const summary = getSegmentCheckinSummary(seg);
            if (summary.label === "all") seg.status = "checked-in";
            else if (summary.label === "partial") seg.status = "partially-checked-in";
          }
        }
      }
      return next;
    });
  }, []);

  const getSegmentExtras = useCallback(
    (segmentId) => selectedExtras[segmentId] ?? emptySegExtras(),
    [selectedExtras]
  );

  const addLuggage = useCallback((segmentId, passengerId, extraId, qty) => {
    setSelectedExtras((prev) => {
      const seg = prev[segmentId] ?? emptySegExtras();
      const luggage = { ...seg.luggage };
      const paxLug = { ...(luggage[passengerId] ?? {}) };
      if (qty > 0) paxLug[extraId] = qty;
      else delete paxLug[extraId];
      if (Object.keys(paxLug).length > 0) luggage[passengerId] = paxLug;
      else delete luggage[passengerId];
      return { ...prev, [segmentId]: { ...seg, luggage } };
    });
  }, []);

  const removeLuggage = useCallback((segmentId, passengerId, extraId) => {
    setSelectedExtras((prev) => {
      const seg = prev[segmentId] ?? emptySegExtras();
      const luggage = { ...seg.luggage };
      const paxLug = { ...(luggage[passengerId] ?? {}) };
      delete paxLug[extraId];
      if (Object.keys(paxLug).length > 0) luggage[passengerId] = paxLug;
      else delete luggage[passengerId];
      return { ...prev, [segmentId]: { ...seg, luggage } };
    });
  }, []);

  const setSeat = useCallback((segmentId, passengerId, seatCode) => {
    setSelectedExtras((prev) => {
      const seg = prev[segmentId] ?? emptySegExtras();
      const seats = { ...seg.seats };
      if (seatCode) seats[passengerId] = seatCode;
      else delete seats[passengerId];
      return { ...prev, [segmentId]: { ...seg, seats } };
    });
  }, []);

  const toggleMeal = useCallback((segmentId, passengerId, mealId) => {
    setSelectedExtras((prev) => {
      const seg = prev[segmentId] ?? emptySegExtras();
      const current = seg.meals[passengerId] ?? [];
      const has = current.includes(mealId);
      const updated = has ? current.filter((id) => id !== mealId) : [...current, mealId];
      const meals = { ...seg.meals };
      if (updated.length === 0) delete meals[passengerId];
      else meals[passengerId] = updated;
      return { ...prev, [segmentId]: { ...seg, meals } };
    });
  }, []);

  const getSegmentExtrasTotal = useCallback(
    (segmentId) => {
      const ext = selectedExtras[segmentId];
      if (!ext) return 0;
      let total = 0;
      for (const paxLug of Object.values(ext.luggage)) {
        if (typeof paxLug === "object" && paxLug !== null) {
          for (const [extraId, qty] of Object.entries(paxLug)) {
            const item = extrasCatalog.luggage.find((l) => l.id === extraId);
            if (item) total += item.price * qty;
          }
        }
      }
      for (const seatCode of Object.values(ext.seats)) {
        const row = parseInt(seatCode, 10);
        if (row >= 12 && row <= 13) total += extrasCatalog.seatPricing.exit;
        else if (row <= 5) total += extrasCatalog.seatPricing.front;
        else total += extrasCatalog.seatPricing.standard;
      }
      for (const mealIds of Object.values(ext.meals)) {
        for (const mId of mealIds) {
          const meal = extrasCatalog.meals.find((m) => m.id === mId);
          if (meal) total += meal.price;
        }
      }
      return total;
    },
    [selectedExtras]
  );

  const value = useMemo(
    () => ({
      activeScenario,
      scenarioList: Object.values(scenarios).map((s) => ({ id: s.id, label: s.label })),
      booking,
      selectedExtras,
      switchScenario,
      checkInPassengers,
      getSegmentExtras,
      addLuggage,
      removeLuggage,
      setSeat,
      toggleMeal,
      getSegmentExtrasTotal,
    }),
    [activeScenario, booking, selectedExtras, switchScenario, checkInPassengers,
     getSegmentExtras, addLuggage, removeLuggage, setSeat, toggleMeal, getSegmentExtrasTotal]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
