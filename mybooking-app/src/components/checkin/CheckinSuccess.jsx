import { useNavigate } from "react-router-dom";
import { CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckinSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-background min-h-screen">
      {/* Animated check circle */}
      <div className="animate-bounce-in">
        <CheckCircle2 size={64} className="text-checkin-green" strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl font-bold text-foreground mt-6 text-center">
        Check-in erfolgreich!
      </h1>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
        Deine Bordkarte ist bereit. Du kannst sie jetzt herunterladen oder per E-Mail erhalten.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
        <Button size="lg" className="w-full rounded-[10px] gap-2 font-semibold">
          <Download size={18} />
          Bordkarte herunterladen
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-[10px] gap-2 font-medium"
          onClick={() => navigate("/booking")}
        >
          <ArrowLeft size={18} />
          Zurück zur Übersicht
        </Button>
      </div>
    </div>
  );
}
