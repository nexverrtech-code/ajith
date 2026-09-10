import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { processSteps, services } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";
import { useIsTouch, useSpotlight } from "../hooks";
import { listContainer, revealUp } from "../utils/motion";

/**
 * Service card: parallax tilt on pointer devices, cursor-tracked spotlight,
 * gradient hairline border. Tilt is switched off on touch, where it fights
 * with scrolling.
 */
const ServiceCard = ({ index, title, icon, blurb, points }) => {
  const { ref, onPointerMove } = useSpotlight();
  const isTouch = useIsTouch();

  const card = (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className="spotlight gradient-border glass group relative flex h-full flex-col gap-5 rounded-4xl p-7 transition-shadow duration-500 hover:shadow-glow sm:p-8"
    >
      {/* Icon */}
      <div className="relative w-fit">
        <div
          className="absolute inset-0 rounded-2xl bg-violet/25 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[.04]">
          <img
            src={icon}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
            className="h-9 w-9 object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className="mt-3 text-[14.5px] leading-relaxed text-secondary">{blurb}</p>
      </div>

      <ul className="mt-auto flex flex-col gap-2 border-t border-white/[.07] pt-5">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2.5 text-[13px] text-white/75">
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-violet to-aqua"
              aria-hidden="true"
            />
            {p}
          </li>
        ))}
      </ul>

      {/* Index watermark */}
      <span
        className="pointer-events-none absolute right-6 top-6 font-mono text-[11px] text-white/20"
        aria-hidden="true"
      >
        0{index + 1}
      </span>
    </div>
  );

  return (
    <motion.div variants={revealUp(index * 0.08)} className="h-full">
      {isTouch ? (
        card
      ) : (
        <Tilt
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          glareEnable={false}
          scale={1.015}
          transitionSpeed={1800}
          tiltReverse
          className="h-full"
        >
          {card}
        </Tilt>
      )}
    </motion.div>
  );
};

const Services = () => (
  <>
    <SectionHeading
      id="services"
      eyebrow="What I do"
      title="Four disciplines,"
      accent="one pipeline."
      intro="Animation, effects, virtual production and finishing all run through the same real-time pipeline — so a look developed for a cinematic can be reused on a game level or an ad cut without rebuilding it."
    />

    {/* ---------- Service cards ---------- */}
    <motion.div
      variants={listContainer(0.1, 0.1)}
      className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5"
    >
      {services.map((service, index) => (
        <ServiceCard key={service.title} index={index} {...service} />
      ))}
    </motion.div>

    {/* ---------- Process ---------- */}
    <motion.div variants={revealUp(0.1)} className="mt-20 lg:mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`${styles.sectionSubText} flex items-center gap-3`}>
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-r from-violet to-transparent"
            />
            How it runs
          </p>
          <h3 className="mt-3 font-display text-fluid-h3 font-bold text-white">
            Four stages, no surprises.
          </h3>
        </div>
        <p className="max-w-md text-[14px] leading-relaxed text-secondary">
          You approve the motion before anything gets expensive to change. Revisions live
          at the block stage, not the render stage.
        </p>
      </div>

      <motion.ol
        variants={listContainer(0.1)}
        className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-4xl border border-white/[.08] bg-white/[.05] sm:grid-cols-2 lg:grid-cols-4"
      >
        {processSteps.map((s) => (
          <motion.li
            key={s.step}
            variants={revealUp(0)}
            className="group relative flex flex-col gap-3 bg-ink-950 p-7 transition-colors duration-500 hover:bg-ink-900 sm:p-8"
          >
            <span className="font-mono text-[13px] font-medium text-violet">{s.step}</span>
            <h4 className="font-display text-lg font-bold text-white">{s.title}</h4>
            <p className="text-[13.5px] leading-relaxed text-secondary">{s.copy}</p>
            <span
              className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-violet to-aqua transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden="true"
            />
          </motion.li>
        ))}
      </motion.ol>
    </motion.div>
  </>
);

export default SectionWrapper(Services, "services");
