import { useState, useEffect } from "react";
import { Briefcase, Info } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { bookingData } from "../data/dummyData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FlightCard from "../components/booking/FlightCard";
import CrossSellCarousel from "../components/crosssell/CrossSellCarousel";
import { SkeletonCard } from "../components/ui/Skeleton";

function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("overview.title")}
          </h1>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 rounded-lg text-xs font-semibold">
            5 Tage
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t("overview.daysUntil", { days: 5, destination: "Heraklion" })}
        </p>
      </div>

      {/* Help avatar — desktop only */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <Card className="px-4 py-2.5 max-w-[220px] shadow-none">
          <p className="text-sm text-foreground leading-snug">
            {t("overview.helpAvatar")}
          </p>
          <button className="text-sm text-primary font-medium hover:underline mt-0.5 min-h-[44px] flex items-center cursor-pointer">
            {t("overview.helpAvatarLink")}
          </button>
        </Card>
        <img
          src="https://i.pravatar.cc/80?img=47"
          alt="Support"
          className="w-12 h-12 rounded-full border-2 border-card shadow-md shrink-0"
        />
      </div>
    </div>
  );
}

function CabinBaggageInfo() {
  const { t } = useTranslation();

  return (
    <Card className="shadow-none">
      <CardContent className="flex items-start gap-2.5 p-4">
        <Briefcase size={16} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{t("overview.cabinBaggage")}:</span>{" "}
          {t("overview.cabinBaggageInfo")}
        </p>
      </CardContent>
    </Card>
  );
}

function CheckinFeeHint() {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-1.5 mt-2">
      <Info size={12} className="text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground">
        {t("overview.checkinFee")}
      </p>
    </div>
  );
}

function ReferenceBar() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-6 mb-2">
      <span>
        {t("overview.ref")}:{" "}
        <span className="font-mono font-semibold text-foreground">
          {bookingData.referenceNumber}
        </span>
      </span>
      <span>
        {t("overview.airlineRef")}:{" "}
        <span className="font-mono font-semibold text-foreground">
          {bookingData.airlineRef}
        </span>
      </span>
    </div>
  );
}

export default function BookingOverview() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex-1 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        <div className="animate-fade-in-up">
          <PageHeader />
        </div>

        <ReferenceBar />

        {isLoading ? (
          <div className="flex flex-col gap-6 mt-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 mt-2">
              {bookingData.flights.map((flight, index) => (
                <div
                  key={flight.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <FlightCard
                    flight={flight}
                    passengers={bookingData.passengers}
                  />
                  <CheckinFeeHint />
                </div>
              ))}
            </div>

            <div
              className="animate-fade-in-up mt-6"
              style={{ animationDelay: `${(bookingData.flights.length + 1) * 100}ms` }}
            >
              <CabinBaggageInfo />
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: `${(bookingData.flights.length + 2) * 100}ms` }}
            >
              <CrossSellCarousel offers={bookingData.crossSellOffers} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
