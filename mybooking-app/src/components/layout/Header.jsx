import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Copy, Check, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { bookingData } from "../../data/dummyData";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "@/hooks/useToast";

function Logo({ light = false }) {
  return (
    <Link to="/" className="text-xl tracking-tight">
      <span className="font-normal text-destructive">my</span>
      <span className={`font-bold ${light ? "text-white" : "text-foreground"}`}>
        Booking
      </span>
    </Link>
  );
}

function ThemeToggle({ light = false }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={light ? "text-white/60 hover:text-white/90 hover:bg-white/10" : ""}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}

function LandingHeader() {
  return (
    <header className="relative z-10">
      {/* Mobile */}
      <div className="sm:hidden py-4 px-5 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block max-w-3xl mx-auto mt-4 px-4">
        <div className="bg-foreground dark:bg-card rounded-2xl py-3 px-6 flex items-center justify-between">
          <Logo light />
          <div className="flex items-center gap-2">
            <LanguageSwitcher dark />
            <ThemeToggle light />
          </div>
        </div>
      </div>
    </header>
  );
}

function CopyRef({ refNumber }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refNumber);
    setCopied(true);
    toast({ title: "PNR kopiert", description: `${refNumber} in Zwischenablage kopiert`, variant: "default" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 bg-muted rounded-xl px-3 py-1 min-h-[44px] text-sm font-mono text-foreground hover:bg-accent transition-colors cursor-pointer"
    >
      <span className="hidden sm:inline text-muted-foreground font-sans text-xs">
        Ref
      </span>
      <span className="font-medium">{refNumber}</span>
      {copied ? (
        <Check size={14} className="text-checkin-green" />
      ) : (
        <Copy size={14} className="text-muted-foreground" />
      )}
    </button>
  );
}

function AppHeader() {
  return (
    <header className="bg-card border-b border-border py-3 px-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center">
          <Button variant="ghost" size="icon">
            <Search size={18} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <CopyRef refNumber={bookingData.referenceNumber} />
        </div>
      </div>
    </header>
  );
}

export default function Header({ variant = "landing" }) {
  if (variant === "app") return <AppHeader />;
  return <LandingHeader />;
}
