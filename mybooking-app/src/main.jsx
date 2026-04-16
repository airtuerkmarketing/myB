import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import App from "./App";
import OfflineBanner from "./components/ui/OfflineBanner";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <LanguageProvider>
          <OfflineBanner />
          <App />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);
