import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

const languages = ["DE", "EN", "TR"];

export default function LanguageSwitcher({ dark = false }) {
  const { language, setLanguage } = useTranslation();
  const active = language.toUpperCase();

  return (
    <div
      className={cn(
        "rounded-lg p-0.5 flex gap-0.5",
        dark ? "bg-white/10" : "bg-muted"
      )}
    >
      {languages.map((lang) => {
        const isActive = lang === active;
        return (
          <button
            key={lang}
            onClick={() => setLanguage(lang.toLowerCase())}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer",
              isActive
                ? "bg-card text-foreground font-semibold shadow-sm"
                : dark
                  ? "text-white/60 hover:text-white/80"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}
