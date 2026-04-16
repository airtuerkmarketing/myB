import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, User } from "lucide-react";
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
    <div className="mt-8 md:mt-10 w-full px-1">
      <div ref={formRef} className="flex flex-col gap-3">
        <div className="relative">
          <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder={t("landing.pnrPlaceholder")}
            value={pnr}
            onChange={(e) => {
              setPnr(e.target.value);
              if (errors.pnr) setErrors((prev) => ({ ...prev, pnr: undefined }));
            }}
            className={cn("pl-11", errors.pnr && "border-destructive focus-visible:ring-destructive/20")}
          />
        </div>
        <div className="relative">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder={t("landing.surnamePlaceholder")}
            value={surname}
            onChange={(e) => {
              setSurname(e.target.value);
              if (errors.surname) setErrors((prev) => ({ ...prev, surname: undefined }));
            }}
            className={cn("pl-11", errors.surname && "border-destructive focus-visible:ring-destructive/20")}
          />
        </div>
      </div>
      <Button
        size="lg"
        onClick={handleSubmit}
        className="mt-4 w-full rounded-xl h-12 text-base font-semibold hover:scale-[1.01] active:scale-[0.99] transition-transform"
      >
        {t("landing.cta")}
      </Button>
    </div>
  );
}
