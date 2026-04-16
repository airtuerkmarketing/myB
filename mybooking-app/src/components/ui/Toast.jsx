import { createContext, useContext, useState, useCallback } from "react";
import { Check, X, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext();

const variantConfig = {
  success: { icon: Check, bg: "bg-green-600", text: "text-white" },
  error: { icon: X, bg: "bg-red-600", text: "text-white" },
  info: { icon: Info, bg: "bg-primary", text: "text-white" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500", text: "text-white" },
};

function ToastItem({ toast, onDismiss }) {
  const config = variantConfig[toast.variant] ?? variantConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bg} ${config.text} rounded-xl px-4 py-3
        flex items-center gap-2.5 shadow-lg
        animate-fade-in-up min-w-[280px] max-w-sm
      `}
    >
      <Icon size={16} className="shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 max-sm:right-0 max-sm:left-0 max-sm:px-4 z-[100] flex flex-col gap-2 items-end max-sm:items-center pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
