import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { styles } from "../styles";
import { projects } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";
import Picture from "./Picture";
import { useIsTouch, useLockBodyScroll } from "../hooks";
import {
  EASE,
  listContainer,
  modalVariants,
  overlayVariants,
  revealUp,
} from "../utils/motion";

const ALL = "All work";

const PlayIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
  </svg>
);

/* ------------------------------------------------------------------
   LIGHTBOX
   ------------------------------------------------------------------ */
const Lightbox = ({ project, onClose }) => {
  const closeRef = useRef(null);
  useLockBodyScroll(Boolean(project));

  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Move focus into the dialog so Escape and Tab behave predictably.
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[110] flex items-center justify-center bg-ink-950/88 p-4 backdrop-blur-md sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} — video`}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-5xl overflow-hidden rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[.08] p-5 sm:p-6">
              <div className="min-w-0">
                <h3 className="truncate font-display text-lg font-bold text-white sm:text-xl">
                  {project.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">
                  {project.subtitle} · {project.year}
                </p>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.05] text-white transition hover:bg-white/[.12]"
              >
                <svg
                  width="16"
                  height="16"
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
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={project.name}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="max-w-2xl text-[13.5px] leading-relaxed text-secondary">
                {project.description}
              </p>
              <a
                href={project.source_code_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost shrink-0 !py-2.5 !text-[13px]"
              >
                Watch on YouTube
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------
   PROJECT CARD
   ------------------------------------------------------------------ */
const ProjectCard = ({ project, index, onOpen }) => {
  const isTouch = useIsTouch();

  const inner = (
    <article className="gradient-border glass group relative flex h-full flex-col overflow-hidden rounded-4xl">
      {/* Poster */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Play ${project.name}`}
        className="relative block aspect-[16/10] w-full overflow-hidden"
      >
        <Picture
          slug={project.slug}
          alt={`${project.name} — ${project.subtitle} still frame`}
          width={1200}
          height={750}
          loading={index < 2 ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.07]"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70"
          aria-hidden="true"
        />

        {/* Play affordance */}
        <span
          className="absolute inset-0 grid place-items-center"
          aria-hidden="true"
        >
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/25 transition-all duration-500 group-hover:scale-110 group-hover:bg-violet/85 group-hover:ring-violet">
            <span className="absolute inset-0 rounded-full bg-violet/40 animate-pulse-ring" />
            <PlayIcon className="relative ml-0.5 h-5 w-5 text-white" />
          </span>
        </span>

        {/* Year badge */}
        <span className="absolute left-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          {project.year}
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-soft">
            {project.category} · {project.subtitle}
          </p>
          <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-white sm:text-xl">
            {project.name}
          </h3>
          <p className="mt-3 text-[13.5px] leading-relaxed text-secondary">
            {project.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[.07] pt-5">
          {project.tags.map((tag) => (
            <span
              key={`${project.name}-${tag.name}`}
              className={`text-[12.5px] font-medium ${tag.color}`}
            >
              #{tag.name}
            </span>
          ))}

          <a
            href={project.source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto inline-flex items-center gap-1.5 py-1 text-[12.5px] font-medium text-white/70 transition-colors hover:text-white"
          >
            YouTube
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );

  return (
    <motion.div
      layout
      variants={revealUp(Math.min(index, 3) * 0.08)}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ layout: { duration: 0.5, ease: EASE } }}
      className="h-full"
    >
      {isTouch ? (
        inner
      ) : (
        <Tilt
          tiltMaxAngleX={4}
          tiltMaxAngleY={4}
          glareEnable={false}
          scale={1.01}
          transitionSpeed={2000}
          className="h-full"
        >
          {inner}
        </Tilt>
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------------------
   SECTION
   ------------------------------------------------------------------ */
const Works = () => {
  const [filter, setFilter] = useState(ALL);
  const [active, setActive] = useState(null);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  );

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <>
      <SectionHeading
        id="work"
        eyebrow="Selected work"
        title="Frames that"
        accent="earned their render time."
        intro="Real-time environments, CGI animation and product work — built in Unreal Engine 5 and Blender. Tap any card to watch the full piece."
      />

      {/* Filters */}
      <motion.div
        variants={revealUp(0.2)}
        role="group"
        aria-label="Filter projects by category"
        className="mt-10 flex flex-wrap gap-2.5"
      >
        {categories.map((cat) => {
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={isActive}
              className={`relative min-h-[44px] rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 sm:min-h-0 sm:px-5 sm:text-[14px] ${
                isActive ? "text-white" : "text-secondary hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-violet/85 to-violet-deep/85 shadow-glow"
                  transition={{ duration: 0.45, ease: EASE }}
                />
              )}
              <span
                className={`relative ${
                  isActive ? "" : "rounded-full ring-1 ring-inset ring-white/10"
                }`}
              >
                {cat}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Grid */}
      <motion.div
        layout
        variants={listContainer(0.1, 0.1)}
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-12 lg:gap-7"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              onOpen={setActive}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.p variants={revealUp(0.1)} className={`${styles.cardBody} mt-10 max-w-2xl`}>
        More work goes up on{" "}
        <a
          href="https://youtube.com/@ajith_sankar?si=JRVjyzQDTY7PiXGX"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-violet-soft underline decoration-violet/40 underline-offset-4 transition hover:text-white"
        >
          the YouTube channel
        </a>{" "}
        as it finishes.
      </motion.p>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </>
  );
};

export default SectionWrapper(Works, "work");
