import { motion } from "framer-motion";

import { styles } from "../styles";
import { revealUp } from "../utils/motion";

/**
 * Consistent eyebrow + H2 + intro block.
 *
 * `id` must match the section id so the wrapper's aria-labelledby resolves —
 * that's also what gives each section a proper heading in the a11y tree.
 */
const SectionHeading = ({ eyebrow, title, accent, intro, align = "left", id }) => {
  const centered = align === "center";

  return (
    <div className={centered ? "text-center flex flex-col items-center" : ""}>
      <motion.p
        variants={revealUp(0)}
        className={`${styles.sectionSubText} flex items-center gap-3 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span
          aria-hidden="true"
          className="h-px w-8 bg-gradient-to-r from-violet to-transparent"
        />
        {eyebrow}
      </motion.p>

      <motion.h2
        variants={revealUp(0.08)}
        id={id ? `${id}-heading` : undefined}
        className={`${styles.sectionHeadText} mt-3`}
      >
        {title}
        {accent ? <span className="text-gradient-animated"> {accent}</span> : null}
      </motion.h2>

      {intro ? (
        <motion.p
          variants={revealUp(0.16)}
          className={`${styles.sectionBody} mt-6 ${centered ? "mx-auto" : ""}`}
        >
          {intro}
        </motion.p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
