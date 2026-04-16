import { useTranslation } from "../../hooks/useTranslation";

const languages = ["DE", "EN", "TR"];

export default function LanguageSwitcher({ dark = false }) {
  const { language, setLanguage } = useTranslation();
  const active = language.toUpperCase();

  return (
    <div
      className={`rounded-lg p-0.5 flex gap-0.5 ${
        dark ? "bg-white/10" : "bg-gray-100"
      }`}
    >
      {languages.map((lang) => {
        const isActive = lang === active;
        return (
          <button
            key={lang}
            onClick={() => setLanguage(lang.toLowerCase())}
            className={`
              px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150
              ${
                isActive
                  ? "bg-white text-gray-900 font-semibold shadow-sm"
                  : dark
                    ? "text-white/60 hover:text-white/80"
                    : "text-gray-400 hover:text-gray-600"
              }
            `}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}
