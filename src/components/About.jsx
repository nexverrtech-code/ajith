import { motion } from "framer-motion";

import { styles } from "../styles";
import { SITE } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";
import { useSpotlight } from "../hooks";
import { listContainer, revealUp, scaleReveal } from "../utils/motion";

/**
 * Scannable entity facts. Short, declarative lines like these are what
 * generative engines lift verbatim when they answer "who is X / where are they
 * based / what do they use", so the phrasing is deliberately quotable.
 */
const FACTS = [
  { k: "Studio", v: SITE.name },
  { k: "Lead artist", v: SITE.founder },
  { k: "Based in", v: `${SITE.location.city}, ${SITE.location.region}` },
  { k: "Working", v: "Remotely, worldwide" },
  { k: "Core stack", v: "Unreal Engine 5 · Blender" },
  { k: "Timezone", v: SITE.location.timezone },
];

const About = () => {
  const { ref, onPointerMove } = useSpotlight();

  return (
    <>
      <SectionHeading
        id="about"
        eyebrow="Introduction"
        title="Built to make people"
        accent="feel something."
        intro={`${SITE.name} is a one-artist studio led by ${SITE.founder}, working across 3D animation, visual effects and real-time cinematics. The focus is simple: environments and sequences that carry a story, built in Unreal Engine 5 and Blender and optimised so they still run in real time.`}
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* ---------- Narrative ---------- */}
        <motion.div variants={listContainer(0.12)} className="flex flex-col gap-6">
          <motion.p variants={revealUp(0)} className={styles.cardBody}>
            I&apos;m an Unreal Engine artist working on visually engaging, interactive media
            across games, film and virtual experiences. Day to day that means designing
            immersive 3D environments, building cinematic sequences, animating, and taking
            shots through visual effects and finishing — with real-time rendering and
            optimisation running through all of it.
          </motion.p>

          <motion.p variants={revealUp(0.08)} className={styles.cardBody}>
            Every project is handled end to end: modelling, texturing, lighting, animation,
            simulation, compositing, colour and sound. Nothing gets handed off half-finished,
            and nothing ships that hasn&apos;t been reviewed on the device it&apos;s meant
            for.
          </motion.p>

          <motion.p variants={revealUp(0.16)} className={styles.cardBody}>
            The goal is to keep pushing what interactive media can do — work that captivates
            an audience while staying technically sound underneath.
          </motion.p>

          {/* Entity facts */}
          <motion.dl
            variants={revealUp(0.24)}
            className="mt-2 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-white/[.08] pt-7 xs:grid-cols-2"
          >
            {FACTS.map((f) => (
              <div key={f.k} className="flex flex-col gap-1">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft/80">
                  {f.k}
                </dt>
                <dd className="text-[15px] font-medium text-white">{f.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* ---------- Brand panel ---------- */}
        <motion.div
          variants={scaleReveal(0.1)}
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight gradient-border glass relative overflow-hidden rounded-4xl p-8 sm:p-10"
        >
          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <img
                src={SITE.logo}
                alt={`${SITE.name} logo`}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              />
              <p className="mt-7 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
                &ldquo;{SITE.tagline}&rdquo;
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-secondary">
                That line is the whole brief. If a shot doesn&apos;t move someone, the
                render was just maths.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="h-px w-full bg-gradient-to-r from-violet/60 via-aqua/30 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-[15px] font-semibold text-white">
                    {SITE.founder}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-secondary">
                    {SITE.role}
                  </p>
                </div>
                <a
                  href="#contact"
                  className="btn btn-ghost !px-4 !py-2 !text-[13px]"
                  aria-label="Go to the contact section"
                >
                  Say hello
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
