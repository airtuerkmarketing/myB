import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function SearchForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [pnr, setPnr] = useState("");
  const [surname, setSurname] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    if (!pnr.trim()) newErrors.pnr = true;
    if (!surname.trim()) newErrors.surname = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      formRef.current?.classList.remove("animate-shake");
      void formRef.current?.offsetWidth;
      formRef.current?.classList.add("animate-shake");
      return;
    }

    setErrors({});
    navigate("/booking");
  };

  return (
    <div className="mt-10 max-w-sm md:max-w-md mx-auto w-full">
      <Card ref={formRef} className="p-1 rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
        {/* PNR Input */}
        <div className="relative">
          <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 z-10" />
          <Input
            placeholder={t("landing.pnrPlaceholder")}
            value={pnr}
            onChange={(e) => {
              setPnr(e.target.value);
              if (errors.pnr) setErrors((prev) => ({ ...prev, pnr: undefined }));
            }}
            className={cn(
              "border-0 border-b border-border/50 rounded-none rounded-t-xl focus-visible:ring-0 h-13 px-4 pl-11 text-base bg-transparent placeholder:text-muted-foreground/50",
              errors.pnr && "bg-destructive/5"
            )}
          />
        </div>

        {/* Surname Input */}
        <div className="relative">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 z-10" />
          <Input
            placeholder={t("landing.surnamePlaceholder")}
            value={surname}
            onChange={(e) => {
              setSurname(e.target.value);
              if (errors.surname) setErrors((prev) => ({ ...prev, surname: undefined }));
            }}
            className={cn(
              "border-0 rounded-none rounded-b-xl focus-visible:ring-0 h-13 px-4 pl-11 text-base bg-transparent placeholder:text-muted-foreground/50",
              errors.surname && "bg-destructive/5"
            )}
          />
        </div>
      </Card>

      {/* CTA — black button like Airbnb */}
      <Button
        variant="secondary"
        onClick={handleSubmit}
        className="mt-4 w-full h-12 rounded-[10px] bg-foreground text-background hover:bg-foreground/90 font-semibold text-sm cursor-pointer"
      >
        {t("landing.cta")}
      </Button>
    </div>
  );
}
