import { useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility, Search, Copy, Check, Sun, Moon } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { bookingData } from "../../data/dummyData";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../ui/Toast";

function Logo({ light = false }) {
  return (
    <Link to="/" className="text-xl tracking-tight">
      <span className="font-normal text-accent">my</span>
      <span className={`font-bold ${light ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
        Booking
      </span>
    </Link>
  );
}

function ThemeToggle({ light = false }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
        light
          ? "text-white/60 hover:text-white/90"
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function LandingHeader() {
  return (
    <header className="relative z-10">
      {/* Mobile */}
      <div className="sm:hidden py-4 px-5 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Accessibility size={18} className="text-gray-400" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block max-w-3xl mx-auto mt-4 px-4">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl py-3 px-6 flex items-center justify-between">
          <Logo light />
          <div className="flex items-center gap-3">
            <LanguageSwitcher dark />
            <ThemeToggle light />
            <Accessibility size={18} className="text-white/60" />
          </div>
        </div>
      </div>
    </header>
  );
}

function CopyRef({ refNumber }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(refNumber);
    setCopied(true);
    addToast("PNR in Zwischenablage kopiert", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 min-h-[44px] text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span className="hidden sm:inline text-gray-400 font-sans text-xs">
        airtuerk Referenz
      </span>
      <span>{refNumber}</span>
      {copied ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Copy size={14} className="text-gray-400" />
      )}
    </button>
  );
}

function AppHeader() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 px-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />

        {/* Center — search icon, desktop only */}
        <div className="hidden md:flex items-center">
          <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>

        {/* Right */}
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
