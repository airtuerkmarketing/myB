import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { scenarios, defaultScenario, getSegmentCheckinSummary } from "../data/dummyData";

const BookingContext = createContext(null);

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

  const value = useMemo(
    () => ({
      activeScenario,
      scenarioList: Object.values(scenarios).map((s) => ({ id: s.id, label: s.label })),
      booking,
      selectedExtras,
      setSelectedExtras,
      switchScenario,
      checkInPassengers,
    }),
    [activeScenario, booking, selectedExtras, switchScenario, checkInPassengers]
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
