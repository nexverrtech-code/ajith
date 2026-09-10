import { useEffect, useRef } from "react";

import { useIsTouch, usePrefersReducedMotion } from "../hooks";

/**
 * Two-part cursor: a dot that tracks exactly, and a ring that lags behind and
 * swells over interactive elements.
 *
 * Position is written straight to `transform` inside a rAF loop — no React
 * state per mouse move, so this costs nothing on the render path. Rendered
 * only on fine-pointer devices that haven't asked for reduced motion.
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const disabled = isTouch || reducedMotion;

  useEffect(() => {
    if (disabled) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let frame = 0;
    let visible = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    // Swell the ring over anything clickable.
    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, .cursor-grow";
    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE)) ring.classList.add("is-hover");
    };
    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE)) ring.classList.remove("is-hover");
    };

    const render = () => {
      // Ring eases toward the pointer; the dot snaps to it.
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;

      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
