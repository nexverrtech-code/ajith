import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   useMediaQuery — SSR-safe, listener-based
   ------------------------------------------------------------------ */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () => useMediaQuery("(max-width: 1023px)");
export const useIsTouch = () => useMediaQuery("(hover: none), (pointer: coarse)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/* ------------------------------------------------------------------
   useCanRender3D
   Heavy WebGL scenes are skipped on phones, on reduced-motion, on
   low-core devices and when the OS reports data-saver. Every one of
   those cases gets a static fallback instead.
   ------------------------------------------------------------------ */
export const useCanRender3D = () => {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [capable, setCapable] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Very low core count usually means a device that will chug on WebGL.
    const cores = navigator.hardwareConcurrency || 4;
    const saveData = navigator.connection?.saveData === true;

    let hasWebGL = false;
    try {
      const canvas = document.createElement("canvas");
      hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch {
      hasWebGL = false;
    }

    setCapable(hasWebGL && cores >= 4 && !saveData);
  }, []);

  return capable && !isMobile && !reducedMotion;
};

/* ------------------------------------------------------------------
   useScrollProgress — 0 → 1 down the document, rAF-throttled
   ------------------------------------------------------------------ */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
};

/* ------------------------------------------------------------------
   useScrolled — true once past `offset` px
   ------------------------------------------------------------------ */
export const useScrolled = (offset = 60) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > offset);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [offset]);

  return scrolled;
};

/* ------------------------------------------------------------------
   useActiveSection — highlights the nav link for the section in view
   ------------------------------------------------------------------ */
export const useActiveSection = (ids = []) => {
  const [active, setActive] = useState("");
  const key = ids.join("|");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick whichever tracked section is closest to the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
};

/* ------------------------------------------------------------------
   useLockBodyScroll — for the drawer and the lightbox
   ------------------------------------------------------------------ */
export const useLockBodyScroll = (locked) => {
  useEffect(() => {
    if (!locked) return undefined;
    const { body } = document;
    // Compensate for the disappearing scrollbar so the page doesn't jump.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevPad = body.style.paddingRight;

    body.classList.add("no-scroll");
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.classList.remove("no-scroll");
      body.style.paddingRight = prevPad;
    };
  }, [locked]);
};

/* ------------------------------------------------------------------
   useSpotlight — writes pointer position into --mx / --my
   Pairs with the `.spotlight` class in index.css.
   ------------------------------------------------------------------ */
export const useSpotlight = () => {
  const ref = useRef(null);

  const onPointerMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return { ref, onPointerMove };
};

/* ------------------------------------------------------------------
   useCountUp — animates a number once its element scrolls into view
   ------------------------------------------------------------------ */
export const useCountUp = (target, duration = 1600) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (reducedMotion) {
      setValue(target);
      return undefined;
    }

    let frame = 0;
    let start = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const tick = (now) => {
          if (!start) start = now;
          const t = Math.min(1, (now - start) / duration);
          // easeOutExpo — fast out of the gate, gentle landing
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(Math.round(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, reducedMotion]);

  return { ref, value };
};
