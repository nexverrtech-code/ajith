import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { styles } from "../styles";
import { navLinks, SITE } from "../constants";
import { useActiveSection, useLockBodyScroll, useScrolled } from "../hooks";
import { drawerItem, drawerVariants, EASE } from "../utils/motion";

const SECTION_IDS = navLinks.map((l) => l.id);

/** Hamburger that morphs into an X. */
const MenuIcon = ({ open }) => (
  <span className="relative block h-4 w-6" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute left-0 block h-[2px] w-full rounded-full bg-white"
        initial={false}
        animate={
          open
            ? [
                { top: 7, rotate: 45 },
                { top: 7, opacity: 0, scaleX: 0.2 },
                { top: 7, rotate: -45 },
              ][i]
            : [
                { top: 0, rotate: 0 },
                { top: 7, opacity: 1, scaleX: 1 },
                { top: 14, rotate: 0 },
              ][i]
        }
        transition={{ duration: 0.32, ease: EASE }}
      />
    ))}
  </span>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(40);
  const active = useActiveSection(SECTION_IDS);

  useLockBodyScroll(open);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goTop = useCallback((e) => {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "glass-strong border-b border-white/[.07] py-3 shadow-lift"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`${styles.paddingX} ${styles.container} flex items-center justify-between gap-4`}
      >
        {/* Brand */}
        <a
          href="#top"
          onClick={goTop}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`${SITE.name} — back to top`}
        >
          <span className="relative grid h-10 w-10 place-items-center">
            <span className="absolute inset-0 rounded-xl bg-violet/25 blur-md transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
            <img
              src={SITE.logo}
              alt=""
              width={40}
              height={40}
              className="relative h-9 w-9 object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </span>
          <span className="font-display text-[15px] font-bold leading-none tracking-tight text-white sm:text-[17px]">
            Ajith<span className="text-violet"> S</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((nav) => {
            const isActive = active === nav.id;
            return (
              <li key={nav.id}>
                <a
                  href={`#${nav.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-secondary hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[.08] ring-1 ring-inset ring-white/10"
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                  )}
                  <span className="relative">{nav.title}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="btn btn-primary !hidden !px-5 !py-2.5 !text-[14px] lg:!inline-flex"
        >
          Start a project
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.04] lg:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 top-0 -z-10 bg-ink-950/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              id="mobile-menu"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="glass-strong mx-4 mb-4 mt-3 overflow-hidden rounded-3xl p-2 lg:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((nav, i) => {
                  const isActive = active === nav.id;
                  return (
                    <motion.li key={nav.id} variants={drawerItem}>
                      <a
                        href={`#${nav.id}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-5 py-4 text-[17px] font-medium transition-colors ${
                          isActive
                            ? "bg-white/[.07] text-white"
                            : "text-secondary active:bg-white/[.05]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-violet/70">
                            0{i + 1}
                          </span>
                          {nav.title}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-40"
                          aria-hidden="true"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div variants={drawerItem} className="p-3 pt-2">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Start a project
                </a>
                <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
                  {SITE.location.city} · {SITE.location.country}
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
