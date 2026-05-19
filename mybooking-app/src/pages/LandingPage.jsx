import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Check } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

function ScanOverlay({ state }) {
  if (state === "idle") return null;

  return (
    <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-[16px] flex flex-col items-center justify-center gap-3 animate-fade-in">
      {state === "scanning" && (
        <>
          <div className="w-10 h-10 rounded-full border-2 border-[#0A82DF] border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-[#222222]">Scanning…</span>
        </>
      )}
      {state === "success" && (
        <>
          <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center animate-bounce-in">
            <Check size={20} className="text-[#1C9218]" />
          </div>
          <span className="text-sm font-medium text-[#1C9218]">Done</span>
        </>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [pnr, setPnr] = useState("");
  const [surname, setSurname] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scanState, setScanState] = useState("idle");
  const dragCounter = useRef(0);

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
    setIsLoading(true);
    setTimeout(() => navigate("/booking"), 300);
  };

  const simulateScan = useCallback(() => {
    setErrors({});
    setScanState("scanning");
    setTimeout(() => {
      setPnr("991356");
      setSurname("Mustermann");
      setScanState("success");
      setTimeout(() => setScanState("idle"), 800);
    }, 1200);
  }, []);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(file.type)) return;
      simulateScan();
    },
    [simulateScan]
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="max-w-md mx-auto w-full">
          {/* Hero */}
          <div className="mt-12 md:mt-0 text-center animate-fade-in-up [animation-delay:100ms]">
            <h1 className="text-[32px] md:text-[40px] font-bold leading-[1.1] text-[#222222] tracking-tight">
              {t("landing.title1")}{" "}
              <span className="bg-[#0A82DF] text-white px-2.5 py-0.5 rounded-lg inline-block transform -rotate-2">
                {t("landing.highlight")}
              </span>
              <br />
              {t("landing.title2")}
            </h1>
            <p className="text-sm text-[#717171] max-w-xs mx-auto mt-4 leading-relaxed">
              {t("landing.subtitle")}
            </p>
          </div>

          {/* Search Form */}
          <div className="mt-8 w-full animate-fade-in-up [animation-delay:200ms]">
            <div
              ref={formRef}
              className={`relative bg-white border rounded-[16px] shadow-elevation-03 overflow-hidden transition-colors ${
                isDragging
                  ? "border-[#0A82DF] border-dashed bg-[#F0F8FF]"
                  : "border-[#EBEBEB]"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <ScanOverlay state={scanState} />

              <input
                type="text"
                placeholder={t("landing.pnrPlaceholder")}
                value={pnr}
                onChange={(e) => {
                  setPnr(e.target.value);
                  if (errors.pnr) setErrors((prev) => ({ ...prev, pnr: false }));
                }}
                className={`w-full border-0 border-b border-[#EBEBEB] rounded-none h-[52px] px-4 text-base text-[#222222] placeholder:text-[#B0B0B0] focus:bg-[#F7F7F7] outline-none transition-colors ${
                  errors.pnr ? "!border-[#D32F2F] bg-[#FFF5F5]" : ""
                }`}
              />
              <input
                type="text"
                placeholder={t("landing.surnamePlaceholder")}
                value={surname}
                onChange={(e) => {
                  setSurname(e.target.value);
                  if (errors.surname) setErrors((prev) => ({ ...prev, surname: false }));
                }}
                className={`w-full border-0 rounded-none h-[52px] px-4 text-base text-[#222222] placeholder:text-[#B0B0B0] focus:bg-[#F7F7F7] outline-none transition-colors ${
                  errors.surname ? "bg-[#FFF5F5]" : ""
                }`}
              />

              {/* Subtle drop hint */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 border-t border-[#EBEBEB] px-4 py-2 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
              >
                <Upload size={12} className="text-[#B0B0B0]" />
                <span className="text-[11px] text-[#B0B0B0]">
                  {t("landing.dropHint")}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-4 w-full bg-[#222222] text-white h-[52px] rounded-[10px] font-semibold text-sm hover:bg-[#333333] active:bg-[#111111] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                t("landing.cta")
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center animate-fade-in [animation-delay:400ms]">
            <p className="text-xs text-[#B0B0B0]">
              {t("landing.helpText")}{" "}
              <a className="text-[#0A82DF] font-medium hover:underline cursor-pointer">
                {t("landing.helpLink")}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer — Desktop only */}
      <footer className="mt-auto border-t border-[#EBEBEB] py-4 px-6 hidden md:flex justify-between">
        <div className="flex gap-3 text-xs text-[#B0B0B0]">
          <a href="#" className="hover:text-[#717171] transition-colors">{t("footer.terms")}</a>
          <span>|</span>
          <a href="#" className="hover:text-[#717171] transition-colors">{t("footer.privacy")}</a>
          <span>|</span>
          <a href="#" className="hover:text-[#717171] transition-colors">{t("footer.legal")}</a>
        </div>
        <p className="text-xs text-[#B0B0B0]">{t("footer.copyright")}</p>
      </footer>
    </div>
  );
}
