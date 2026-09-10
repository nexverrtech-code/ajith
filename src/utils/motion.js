/**
 * Framer Motion variants.
 *
 * The original five variants are preserved unchanged so existing markup keeps
 * working; the additions below cover the newer reveal, stagger and overlay
 * effects. Anything ambient is additionally gated by the reduced-motion rule
 * in index.css.
 */

export const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------
   ORIGINAL VARIANTS
   ------------------------------------------------------------------ */
export const textVariant = (delay) => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
      },
    },
  };
};

export const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const zoomIn = (delay, duration) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const slideIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const staggerContainer = (staggerChildren, delayChildren) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren || 0,
      },
    },
  };
};

/* ------------------------------------------------------------------
   ADDITIONS
   ------------------------------------------------------------------ */

/** Soft rise + de-blur. The default reveal for body copy and cards. */
export const revealUp = (delay = 0, distance = 26) => ({
  hidden: { opacity: 0, y: distance, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, delay, ease: EASE },
  },
});

/** Scale-and-settle, for imagery and hero panels. */
export const scaleReveal = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, delay, ease: EASE },
  },
});

/** Parent for per-word or per-letter headline animation. */
export const wordStagger = (stagger = 0.06, delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Child of wordStagger — each word swings up from behind a mask. */
export const wordChild = {
  hidden: { y: "110%", opacity: 0, rotateX: -35 },
  show: {
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

/** Grid/list container that releases children one after another. */
export const listContainer = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Mobile nav drawer. */
export const drawerVariants = {
  closed: {
    opacity: 0,
    y: -14,
    scale: 0.97,
    transition: { duration: 0.25, ease: EASE },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: EASE, staggerChildren: 0.055, delayChildren: 0.08 },
  },
};

export const drawerItem = {
  closed: { opacity: 0, x: 22 },
  open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

/** Lightbox / modal. */
export const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 26 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.25, ease: EASE } },
};

/** Accordion body. */
export const accordionVariants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: 0.32, ease: EASE } },
  expanded: { height: "auto", opacity: 1, transition: { duration: 0.42, ease: EASE } },
};

/** Shared hover/tap feel for interactive cards. */
export const hoverLift = {
  rest: { y: 0 },
  hover: { y: -8, transition: { duration: 0.4, ease: EASE } },
};
