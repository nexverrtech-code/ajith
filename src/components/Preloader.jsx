import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SITE } from "../constants";
import { EASE } from "../utils/motion";
import { usePrefersReducedMotion } from "../hooks";

/**
 * Brand intro. Counts to 100 while the first paint settles, then lifts away
 * as two curtain halves. Skipped entirely under reduced-motion, and it never
 * blocks interaction for longer than ~2s.
 */
const Preloader = ({ onDone }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      onDone?.();
      return undefined;
    }

    let frame = 0;
    let start = 0;
    let done = false;
    const DURATION = 1500;

    const finish = () => {
      if (done) return;
      done = true;
      setProgress(100);
      setVisible(false);
      onDone?.();
    };

    const tick = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else finish();
    };

    frame = requestAnimationFrame(tick);

    // rAF is throttled (or stopped) in a background tab. Without this the
    // curtain would still be up whenever someone opens the site in a new tab
    // and switches to it later.
    const safety = setTimeout(finish, DURATION + 600);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(safety);
    };
  }, [reducedMotion, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[120] flex items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
          aria-hidden="true"
        >
          {/* Curtain halves */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
            exit={{ y: "-100%", transition: { duration: 0.85, ease: EASE } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
            exit={{ y: "100%", transition: { duration: 0.85, ease: EASE } }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 px-6"
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35 } }}
          >
            <motion.img
              src={SITE.logo}
              alt=""
              width={72}
              height={72}
              className="h-16 w-16 object-contain sm:h-[72px] sm:w-[72px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />

            <div className="text-center">
              <p className="font-display text-lg font-bold tracking-[0.24em] text-white sm:text-xl">
                {SITE.shortName.toUpperCase()}
                <span className="text-violet">.</span>
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
                {SITE.role}
              </p>
            </div>

            {/* Progress rail */}
            <div className="h-[2px] w-52 overflow-hidden rounded-full bg-white/10 sm:w-64">
              <motion.div
                className="h-full bg-gradient-to-r from-violet via-violet-soft to-aqua"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="font-mono text-xs tabular-nums text-secondary">
              {String(progress).padStart(3, "0")}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
