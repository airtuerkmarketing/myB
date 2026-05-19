import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ChevronLeft, Download } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { flattenSegments, getPassenger } from "../data/dummyData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AirlineLogo } from "@/components/ui/AirlineLogo";
import { Badge } from "@/components/ui/badge";

export default function BoardingPassPage() {
  const { segmentId, passengerId } = useParams();
  const { booking } = useBooking();
  const navigate = useNavigate();

  const segments = useMemo(() => flattenSegments(booking), [booking]);
  const segment = segments.find((s) => s.id === segmentId);
  const passengerDetail = segment?.passengerDetails.find(
    (pd) => pd.passengerId === passengerId
  );
  const passenger = getPassenger(booking, passengerId);

  if (!segment || !passengerDetail || !passenger) {
    return (
      <main className="flex-1 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bordkarte nicht gefunden.</p>
          <Button onClick={() => navigate("/booking")}>Zurück zur Übersicht</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background min-h-screen">
      <div className="py-3 px-4 flex items-center gap-1 border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/booking")}
          className="h-9 w-9 rounded-full"
        >
          <ChevronLeft size={18} />
        </Button>
        <span className="text-sm font-medium text-foreground">Bordkarte</span>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <Card className="rounded-2xl overflow-hidden border-border/50">
          <div className="bg-[#222222] text-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AirlineLogo airline={segment.airline.name} size="sm" />
                <span className="text-sm font-semibold">{segment.airline.name}</span>
              </div>
              <Badge variant="mono" className="bg-white/20 text-white border-0">
                {segment.flightNumber}
              </Badge>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Von</p>
                <p className="text-3xl font-bold">{segment.departure.code}</p>
              </div>
              <p className="text-white/40 text-sm pb-1">→</p>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Nach</p>
                <p className="text-3xl font-bold">{segment.arrival.code}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Passagier</p>
              <p className="text-lg font-bold text-foreground">
                {passenger.title} {passenger.firstName} {passenger.lastName}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Datum</p>
                <p className="text-sm font-semibold text-foreground">{segment.departure.date}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Gate</p>
                <p className="text-sm font-semibold text-foreground">
                  {passengerDetail.boardingPass?.gate ?? "TBD"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Sitz</p>
                <p className="text-sm font-semibold text-foreground">
                  {passengerDetail.seat ?? "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Abflug</p>
                <p className="text-sm font-semibold text-foreground">{segment.departure.time}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Ankunft</p>
                <p className="text-sm font-semibold text-foreground">{segment.arrival.time}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-border pt-4 flex items-center justify-center">
              <div className="bg-muted rounded-xl p-6 text-center">
                <p className="text-xs text-muted-foreground mb-2">QR-Code</p>
                <div className="w-32 h-32 bg-foreground/10 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground font-mono break-all px-2">
                    {passengerDetail.boardingPass?.qrCode ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5">
            <Button className="w-full" size="default">
              <Download size={16} className="mr-2" />
              Bordkarte herunterladen
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
