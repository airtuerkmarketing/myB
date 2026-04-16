import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, User } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useTranslation } from "../../hooks/useTranslation";

export default function SearchForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [pnr, setPnr] = useState("");
  const [surname, setSurname] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    if (!pnr.trim()) newErrors.pnr = " ";
    if (!surname.trim()) newErrors.surname = " ";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Trigger shake animation
      formRef.current?.classList.remove("animate-shake");
      void formRef.current?.offsetWidth; // reflow to restart animation
      formRef.current?.classList.add("animate-shake");
      return;
    }

    setErrors({});
    navigate("/booking");
  };

  return (
    <div className="mt-8 md:mt-10 w-full px-1">
      <div ref={formRef} className="flex flex-col gap-3">
        <Input
          placeholder={t("landing.pnrPlaceholder")}
          icon={Ticket}
          value={pnr}
          onChange={(e) => {
            setPnr(e.target.value);
            if (errors.pnr) setErrors((prev) => ({ ...prev, pnr: undefined }));
          }}
          error={errors.pnr}
          className="focus-within:[&_input]:-translate-y-px transition-transform"
        />
        <Input
          placeholder={t("landing.surnamePlaceholder")}
          icon={User}
          value={surname}
          onChange={(e) => {
            setSurname(e.target.value);
            if (errors.surname) setErrors((prev) => ({ ...prev, surname: undefined }));
          }}
          error={errors.surname}
          className="focus-within:[&_input]:-translate-y-px transition-transform"
        />
      </div>
      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={handleSubmit}
        className="mt-4 hover:scale-[1.01] active:scale-[0.99]"
      >
        {t("landing.cta")}
      </Button>
    </div>
  );
}
