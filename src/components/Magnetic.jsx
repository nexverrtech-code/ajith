import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { useIsTouch, usePrefersReducedMotion } from "../hooks";

/**
 * Magnetic hover — the child drifts toward the cursor and springs back on exit.
 *
 * Disabled on touch and under reduced-motion, where it just renders the child
 * inside a plain wrapper.
 */
const Magnetic = ({ children, strength = 0.35, className = "" }) => {
  const ref = useRef(null);
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const disabled = isTouch || reducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (disabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
