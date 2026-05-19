import { useState, useEffect, useMemo, useCallback } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useBooking } from "../context/BookingContext";
import { flattenSegments, sortTrips, getCrossSellOffers } from "../data/dummyData";
import TripCard from "../components/booking/TripCard";
import CrossSellCarousel from "../components/crosssell/CrossSellCarousel";
import { SkeletonCard } from "../components/ui/Skeleton";
import ExtrasDrawer from "../components/extras/ExtrasDrawer";

function MetaLine() {
  const { t } = useTranslation();
  const { booking } = useBooking();
  const firstPNR = flattenSegments(booking)[0]?.airlinePNR;

  return (
    <div className="flex items-center gap-4 text-xs text-[#717171] py-2 px-1">
      <span>
        {t("overview.ref")}:{" "}
        <span className="font-mono font-semibold text-[#222222]">
          {booking.airtuerkRef}
        </span>
      </span>
      {firstPNR && (
        <>
          <span className="text-[#EBEBEB]">|</span>
          <span>
            {t("overview.airlineRef")}:{" "}
            <span className="font-mono font-semibold text-[#222222]">
              {firstPNR}
            </span>
          </span>
        </>
      )}
    </div>
  );
}

function CheckinFeeHint() {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-2 mt-2 px-1">
      <Info size={14} className="text-[#B0B0B0] shrink-0 mt-0.5" />
      <p className="text-xs text-[#B0B0B0] leading-relaxed">
        {t("overview.checkinFee")}
      </p>
    </div>
  );
}

export default function BookingOverview() {
  const { booking } = useBooking();
  const [isLoading, setIsLoading] = useState(true);
  const [extrasSegmentId, setExtrasSegmentId] = useState(null);

  const sortedTrips = useMemo(() => sortTrips(booking.trips), [booking]);
  const allSegments = useMemo(() => flattenSegments(booking), [booking]);
  const crossSellOffers = useMemo(() => getCrossSellOffers(booking), [booking]);

  const hasCheckinOpen = useMemo(
    () =>
      booking.trips.some((trip) =>
        trip.segments.some((seg) => seg.status === "checkin-open")
      ),
    [booking]
  );

  const extrasSegment = useMemo(
    () => allSegments.find((s) => s.id === extrasSegmentId) ?? null,
    [allSegments, extrasSegmentId]
  );

  const handleAddExtras = useCallback((segId) => setExtrasSegmentId(segId), []);
  const handleCloseExtras = useCallback(() => setExtrasSegmentId(null), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex-1 bg-[#F7F7F7] min-h-[100dvh]">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        <MetaLine />

        {isLoading ? (
          <div className="flex flex-col gap-5 mt-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 mt-2">
              {sortedTrips.map((trip, index) => (
                <div
                  key={trip.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <TripCard trip={trip} booking={booking} onAddExtras={handleAddExtras} />
                </div>
              ))}
            </div>

            {hasCheckinOpen && (
              <div className="animate-fade-in-up mt-3" style={{ animationDelay: `${sortedTrips.length * 80}ms` }}>
                <CheckinFeeHint />
              </div>
            )}

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: `${(sortedTrips.length + 1) * 80}ms` }}
            >
              <CrossSellCarousel offers={crossSellOffers} />
            </div>
          </>
        )}
      </div>

      <ExtrasDrawer
        open={!!extrasSegmentId}
        onClose={handleCloseExtras}
        segment={extrasSegment}
      />
    </main>
  );
}
