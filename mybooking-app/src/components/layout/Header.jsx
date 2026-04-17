import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Copy, Check, Sun, Moon, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { bookingData } from "../../data/dummyData";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "@/hooks/useToast";

function Logo({ light = false }) {
  return (
    <Link to="/" className="text-lg tracking-tight">
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
      {/* Mobile — clean, minimal */}
      <div className="sm:hidden py-5 px-5 flex items-center justify-between">
        <Logo />
        <LanguageSwitcher />
      </div>

      {/* Desktop — floating pill */}
      <div className="hidden sm:block max-w-xl mx-auto mt-6 px-4">
        <div className="bg-foreground rounded-2xl px-5 py-2.5 flex items-center justify-between">
          <Logo light />
          <div className="flex items-center gap-2">
            <LanguageSwitcher dark />
            <Accessibility size={16} className="text-white/40" />
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
    toast({ title: "Kopiert!", description: `${refNumber} in Zwischenablage`, variant: "default" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 text-xs font-mono cursor-pointer hover:bg-accent transition-colors"
    >
      <span className="hidden sm:inline text-muted-foreground font-sans">
        airtuerk Referenz
      </span>
      <span className="font-semibold text-foreground">{refNumber}</span>
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 px-4 md:px-8 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search size={18} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
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
