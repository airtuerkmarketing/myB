import { createContext, useState, useCallback } from "react";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import tr from "../i18n/tr.json";

const translations = { de, en, tr };

const STORAGE_KEY = "mybooking-language";

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
  } catch {}
  return "de";
}

function resolve(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
}

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, []);

  const t = useCallback(
    (key, params) => {
      const value = resolve(translations[language], key)
        ?? resolve(translations.de, key)
        ?? key;
      return interpolate(String(value), params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
