import { useScrollProgress } from "../hooks";

/** Thin reading-progress bar pinned under the navbar. */
const ScrollProgress = () => {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed inset-x-0 top-0 z-40 h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-violet via-violet-soft to-aqua shadow-[0_0_18px_rgba(145,94,255,.7)]"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />
    </div>
  );
};

export default ScrollProgress;
