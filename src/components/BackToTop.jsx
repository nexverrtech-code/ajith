import { AnimatePresence, motion } from "framer-motion";

import { useScrolled, useScrollProgress } from "../hooks";
import { EASE } from "../utils/motion";

/**
 * Floating back-to-top button with a progress ring.
 * Sits above the safe-area inset so it clears the iOS home indicator.
 */
const BackToTop = () => {
  const show = useScrolled(600);
  const progress = useScrollProgress();

  const R = 21;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.35, ease: EASE }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Back to top"
          className="no-print glass-strong fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-5 z-40 grid h-12 w-12 place-items-center rounded-full text-white sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
        >
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="rgba(255,255,255,.09)"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="url(#btt-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            />
            <defs>
              <linearGradient id="btt-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#915eff" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
