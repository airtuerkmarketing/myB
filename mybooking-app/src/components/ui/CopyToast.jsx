import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";

let showToastGlobal = null;

export function copyToast(label, value) {
  showToastGlobal?.({ label, value });
}

export function CopyToastHost() {
  const [toast, setToast] = useState(null);
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => {
      setToast(null);
      setLeaving(false);
    }, 250);
  }, []);

  useEffect(() => {
    showToastGlobal = (data) => {
      setLeaving(false);
      setToast(data);
    };
    return () => { showToastGlobal = null; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, [toast, dismiss]);

  if (!toast) return null;

  return createPortal(
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200]">
      <div
        role="status"
        className={`flex w-[280px] items-center gap-3 rounded-[18px] border border-[#E5E5E5]/70 bg-white/95 px-4 py-3 backdrop-blur-xl ${
          leaving ? "animate-toast-out" : "animate-toast-in"
        }`}
        style={{ boxShadow: "0 14px 40px rgba(15,23,42,0.14)" }}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1C9218] shadow-sm">
          <Check size={16} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-4 text-[#222222]">Kopiert!</p>
          <p className="mt-0.5 text-[12px] leading-4 text-[#717171] truncate">
            {toast.label} {toast.value}
          </p>
        </div>

        <button
          onClick={dismiss}
          aria-label="Toast schließen"
          className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#B0B0B0] transition hover:bg-[#F7F7F7] hover:text-[#717171] cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>,
    document.body
  );
}
