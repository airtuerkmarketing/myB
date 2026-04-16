import { useNavigate } from "react-router-dom";
import { Check, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckinSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-card min-h-screen">
      {/* Animated checkmark */}
      <div className="w-20 h-20 rounded-full bg-checkin-green/10 flex items-center justify-center animate-bounce-in">
        <div className="w-14 h-14 rounded-full bg-checkin-green flex items-center justify-center">
          <Check size={28} className="text-white" strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground mt-6 text-center">
        Check-in erfolgreich!
      </h1>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
        Deine Bordkarte ist bereit. Du kannst sie jetzt herunterladen oder per E-Mail erhalten.
      </p>

      {/* Confetti dots */}
      <div className="relative w-full max-w-xs h-0 mt-4" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 rounded-full animate-fade-in-up"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${-30 - Math.random() * 40}px`,
              backgroundColor: ["#0A82DF", "#16A34A", "#F97316", "#E2001A", "#8B5CF6"][i % 5],
              animationDelay: `${i * 80}ms`,
              animationDuration: "0.6s",
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
        <Button size="lg" className="w-full rounded-xl gap-2">
          <Download size={18} />
          Bordkarte herunterladen
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-xl gap-2"
          onClick={() => navigate("/booking")}
        >
          <ArrowLeft size={18} />
          Zurück zur Übersicht
        </Button>
      </div>
    </div>
  );
}
