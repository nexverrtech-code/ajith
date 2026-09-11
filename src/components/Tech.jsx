import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

import { technologies } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";
import { useCanRender3D } from "../hooks";
import { listContainer, revealUp } from "../utils/motion";

// Nine WebGL contexts is a lot — load them only when we've decided to use them.
const BallCanvas = lazy(() => import("./canvas/Ball"));

/**
 * Static tile shown instead of the spinning 3D ball on phones, low-power
 * devices and under reduced-motion. Same information, none of the GPU cost.
 */
const FlatTile = ({ tech }) => (
  <div className="gradient-border glass group flex aspect-square flex-col items-center justify-center gap-2.5 rounded-3xl p-3 transition-transform duration-500 hover:-translate-y-1">
    <img
      src={tech.icon}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      className="h-9 w-9 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-10 sm:w-10"
    />
    <span className="px-1 text-center font-mono text-[9px] uppercase leading-tight tracking-[0.1em] text-secondary sm:text-[10px]">
      {tech.name}
    </span>
  </div>
);

const Tech = () => {
  const canRender3D = useCanRender3D();

  return (
    <>
      <SectionHeading
        id="tools"
        align="center"
        eyebrow="The pipeline"
        title="Tools I reach for"
        accent="every day."
      />

      <motion.div
        variants={listContainer(0.07, 0.1)}
        className={
          canRender3D
            ? "mt-14 flex flex-row flex-wrap justify-center gap-4 lg:mt-16"
            : "mt-14 grid grid-cols-3 gap-3 xs:grid-cols-4 sm:grid-cols-5 lg:mt-16 lg:grid-cols-9"
        }
      >
        {technologies.map((technology) => (
          <motion.div
            key={technology.name}
            variants={revealUp(0, 16)}
            className={canRender3D ? "h-28 w-28" : ""}
            title={technology.name}
          >
            {canRender3D ? (
              <Suspense fallback={<FlatTile tech={technology} />}>
                <BallCanvas icon={technology.icon} label={technology.name} />
              </Suspense>
            ) : (
              <FlatTile tech={technology} />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Readable equivalent — the 3D balls carry no text for crawlers */}
      <p className="sr-only">
        Software: {technologies.map((t) => t.name).join(", ")}.
      </p>
    </>
  );
};

export default SectionWrapper(Tech, "tools");
