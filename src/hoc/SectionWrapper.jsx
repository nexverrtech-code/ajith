import { motion } from "framer-motion";

import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

/**
 * Wraps a section in a scroll-triggered stagger container.
 *
 * The id now lives on the <section> itself rather than on a negative-margin
 * spacer — `scroll-padding-top` in index.css keeps anchor targets clear of the
 * fixed navbar, which is what the old .hash-span hack was working around.
 */
const StarWrapper = (Component, idName) =>
  function HOC(props) {
    return (
      <motion.section
        id={idName || undefined}
        variants={staggerContainer(0.12, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={`${styles.padding} ${styles.container} relative z-0 scroll-mt-24`}
        aria-labelledby={idName ? `${idName}-heading` : undefined}
      >
        <Component {...props} />
      </motion.section>
    );
  };

export default StarWrapper;
