import { createContext, useState } from "react";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import tr from "../i18n/tr.json";

const translations = { de, en, tr };

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("de");

  const t = (key) => translations[language]?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
