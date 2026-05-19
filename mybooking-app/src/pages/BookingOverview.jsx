import { useState, useEffect, useMemo } from "react";
import { Briefcase, Info } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useBooking } from "../context/BookingContext";
import { flattenSegments, mergePassengers, crossSellOffers } from "../data/dummyData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FlightCard from "../components/booking/FlightCard";
import CrossSellCarousel from "../components/crosssell/CrossSellCarousel";
import { SkeletonCard } from "../components/ui/Skeleton";

function PageHeader() {
  const { t } = useTranslation();
  const { booking } = useBooking();
  const destination = booking.trips[0]?.destination?.city ?? "";

  return (
    <div className="flex items-start justify-between mt-2 mb-8">
      <div>
        <h1 className="text-2xl md:text-[28px] font-bold text-foreground tracking-tight">
          {t("overview.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("overview.daysUntil", { days: 5, destination }).split("5")[0]}
          <span className="inline-flex items-center bg-amber-50 text-amber-700 rounded-md px-1.5 py-0.5 font-semibold text-xs mx-0.5">
            5
          </span>
          {t("overview.daysUntil", { days: 5, destination }).split("5").slice(1).join("5")}
        </p>
      </div>

      <div className="hidden md:flex items-center gap-3 shrink-0">
        <div className="bg-muted rounded-2xl rounded-br-sm p-3 max-w-[200px]">
          <p className="text-xs font-medium text-foreground">
            {t("overview.helpAvatar")}
          </p>
          <button className="text-xs text-primary font-medium hover:underline mt-0.5 cursor-pointer">
            {t("overview.helpAvatarLink")}
          </button>
        </div>
        <Avatar className="h-11 w-11 ring-2 ring-background shadow-md">
          <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Support" />
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function ReferenceBar() {
  const { t } = useTranslation();
  const { booking } = useBooking();
  const firstPNR = flattenSegments(booking)[0]?.airlinePNR;

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
      <span>
        {t("overview.ref")}:{" "}
        <span className="font-mono font-semibold text-foreground">
          {booking.airtuerkRef}
        </span>
      </span>
      {firstPNR && (
        <span>
          {t("overview.airlineRef")}:{" "}
          <span className="font-mono font-semibold text-foreground">
            {firstPNR}
          </span>
        </span>
      )}
    </div>
  );
}

function CheckinFeeHint() {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-2 mt-2 px-1">
      <Info size={14} className="text-muted-foreground/50 shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">
        {t("overview.checkinFee").split("Online Check-in")[0]}
        <span className="text-primary font-medium">Online Check-in</span>
        {t("overview.checkinFee").split("Online Check-in")[1]}
      </p>
    </div>
  );
}

function CabinBaggageInfo() {
  const { t } = useTranslation();

  return (
    <div className="bg-muted/50 rounded-xl p-3 border border-border/30 flex items-start gap-2.5">
      <Briefcase size={16} className="text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{t("overview.cabinBaggage")}:</span>{" "}
        {t("overview.cabinBaggageInfo")}
      </p>
    </div>
  );
}

export default function BookingOverview() {
  const { booking } = useBooking();
  const [isLoading, setIsLoading] = useState(true);

  const segments = useMemo(() => flattenSegments(booking), [booking]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex-1 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="animate-fade-in-up">
          <PageHeader />
        </div>

        <ReferenceBar />

        {isLoading ? (
          <div className="flex flex-col gap-5 mt-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5">
              {segments.map((segment, index) => (
                <div
                  key={segment.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <FlightCard
                    segment={segment}
                    passengers={mergePassengers(booking, segment)}
                  />
                  {segment.status === "checkin-open" && <CheckinFeeHint />}
                </div>
              ))}
            </div>

            <div
              className="animate-fade-in-up mt-6"
              style={{ animationDelay: `${segments.length * 80}ms` }}
            >
              <CabinBaggageInfo />
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: `${(segments.length + 1) * 80}ms` }}
            >
              <CrossSellCarousel offers={crossSellOffers} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
