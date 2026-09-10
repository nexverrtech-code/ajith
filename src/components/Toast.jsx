import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASE } from "../utils/motion";

/**
 * Bottom-centre toast, replacing the old window.alert() calls.
 * Announced politely to screen readers and auto-dismissed.
 */
const Toast = ({ toast, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [toast, onClose, duration]);

  const isError = toast?.type === "error";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[130] flex justify-center px-4"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`glass-strong pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl p-4 shadow-lift ${
              isError ? "ring-1 ring-red-400/40" : "ring-1 ring-emerald-400/35"
            }`}
          >
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                isError ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
              }`}
              aria-hidden="true"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isError ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="m20 6-11 11-5-5" />}
              </svg>
            </span>

            <p className="flex-1 text-[13.5px] leading-relaxed text-white/90">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss notification"
              className="-m-1 shrink-0 rounded-lg p-1 text-secondary transition hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
