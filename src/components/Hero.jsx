import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { styles } from "../styles";
import { roles, SITE, stats } from "../constants";
import Magnetic from "./Magnetic";
import { useCanRender3D, useCountUp, usePrefersReducedMotion } from "../hooks";
import { EASE, revealUp, wordChild, wordStagger } from "../utils/motion";

// The WebGL scene is a heavy chunk — keep it out of the initial bundle.
const ComputersCanvas = lazy(() => import("./canvas/Computers"));

const HEADLINE = ["3D", "animation,", "VFX", "and", "real-time", "worlds."];

/** Each stat counts up once it enters the viewport. */
const Stat = ({ value, suffix, label }) => {
  const { ref, value: current } = useCountUp(value);
  return (
    <div ref={ref}>
      <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">
        {current}
        <span className="text-violet">{suffix}</span>
      </p>
      <p className="mt-1 text-[12px] leading-snug text-secondary sm:text-[13px]">{label}</p>
    </div>
  );
};

const Hero = () => {
  const canRender3D = useCanRender3D();
  const reducedMotion = usePrefersReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  // Rotating discipline line.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2600);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <section
      id="top"
      className="min-h-screen-safe relative isolate flex w-full flex-col justify-center overflow-hidden pb-20 pt-28 sm:pb-24 lg:pb-14"
      aria-label="Introduction"
    >
      {/* ---------- Background ---------- */}
      <div className="aurora" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {canRender3D ? (
        // Desktop: the live 3D scene, anchored to the right half.
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[62%] lg:block"
          aria-hidden="true"
        >
          <div className="pointer-events-auto h-full w-full">
            <Suspense fallback={null}>
              <ComputersCanvas />
            </Suspense>
          </div>
          {/* Feathered edge so the canvas melts into the copy instead of ending on a hard line */}
          <div className="absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
        </div>
      ) : (
        // Mobile / low-power / reduced-motion: a still frame, no WebGL.
        <div className="absolute inset-0 z-0 opacity-[.28]" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet="/media/herobg-768.webp 768w, /media/herobg-1440.webp 1440w, /media/herobg-1920.webp 1920w"
              sizes="100vw"
            />
            <img
              src="/media/herobg-1440.webp"
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/70 to-ink-950" />
        </div>
      )}

      {/* ---------- Copy ---------- */}
      <div className={`${styles.paddingX} ${styles.container} relative z-10 w-full`}>
        <div className="max-w-3xl lg:max-w-[50rem]">
          {/* Availability pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">
              Available for projects
            </span>
          </motion.div>

          {/* Personal intro — kept from the original hero */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
            className="mt-7 font-mono text-eyebrow uppercase text-violet-soft"
          >
            Hi, I&apos;m {SITE.founder} — founder of {SITE.name}
          </motion.p>

          {/* H1: masked word-by-word reveal */}
          <motion.h1
            variants={wordStagger(0.075, 0.42)}
            initial="hidden"
            animate="show"
            className={`${styles.heroHeadText} mt-4 flex flex-wrap gap-x-[0.28em] gap-y-1`}
          >
            {HEADLINE.map((word, i) => (
              <span key={word + i} className="overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={wordChild}
                  className={`inline-block ${
                    i >= 4 ? "text-gradient-animated" : ""
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Rotating discipline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] uppercase tracking-[0.18em] text-secondary sm:text-sm"
          >
            <span className="h-px w-8 bg-violet/60" aria-hidden="true" />
            <span className="sr-only">Specialising in: </span>
            <span className="relative inline-block min-w-[13rem]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="inline-block text-white"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          {/* Positioning copy — carries the keywords for search and AI answers */}
          <motion.p
            variants={revealUp(1.1)}
            initial="hidden"
            animate="show"
            className={`${styles.heroSubText} mt-6`}
          >
            <em className="not-italic text-white/90">{SITE.tagline}</em> {SITE.name} builds
            cinematic 3D environments, animation and visual effects in Unreal Engine 5 and
            Blender — for brands, creators and films, from {SITE.location.city} to anywhere.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={revealUp(1.25)}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Magnetic>
              <a href="#work" className="btn btn-primary w-full sm:w-auto">
                View the work
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </Magnetic>

            <Magnetic>
              <a href="#contact" className="btn btn-ghost w-full sm:w-auto">
                Start a project
              </a>
            </Magnetic>
          </motion.div>

          {/* Stats */}
          <motion.dl
            variants={revealUp(1.4)}
            initial="hidden"
            animate="show"
            className="mt-9 grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/[.08] pt-7 sm:grid-cols-4 sm:gap-4"
          >
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </motion.dl>
        </div>
      </div>

      {/* ---------- Scroll cue ---------- */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.7 }}
        aria-label="Scroll to the About section"
        className="no-print absolute inset-x-0 bottom-7 z-10 mx-auto hidden w-fit flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
          Scroll
        </span>
        <span className="flex h-11 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-violet-soft"
          />
        </span>
      </motion.a>
    </section>
  );
};

export default Hero;
