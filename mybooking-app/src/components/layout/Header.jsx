import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useBooking } from "../../context/BookingContext";
import { useTranslation } from "../../hooks/useTranslation";
import { toast } from "@/hooks/useToast";

function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img
        src={`${import.meta.env.BASE_URL}myBooking_Logo.svg`}
        alt="myBooking"
        className="h-5 md:h-6 w-auto"
      />
    </Link>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-[#EBEBEB] py-3">
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Logo />
        <LanguageSwitcher />
      </div>
    </header>
  );
}

function CopyRef({ refNumber }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(refNumber);
    setCopied(true);
    toast({ title: "Kopiert!", description: `${refNumber}`, variant: "default" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 bg-[#F7F7F7] border border-[#EBEBEB] rounded-[10px] px-3 py-1.5 text-xs font-mono cursor-pointer hover:bg-[#F0F0F0] transition-colors"
    >
      <span className="hidden sm:inline text-[#717171] font-sans">
        {t("overview.ref")}
      </span>
      <span className="font-semibold text-[#222222]">{refNumber}</span>
      {copied ? (
        <Check size={14} className="text-[#1C9218]" />
      ) : (
        <Copy size={14} className="text-[#717171]" />
      )}
    </button>
  );
}

function AppHeader() {
  const { booking } = useBooking();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-[#EBEBEB] py-3">
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <CopyRef refNumber={booking.airtuerkRef} />
        </div>
      </div>
    </header>
  );
}

export default function Header({ variant = "landing" }) {
  if (variant === "app") return <AppHeader />;
  return <LandingHeader />;
}
