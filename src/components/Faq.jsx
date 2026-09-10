import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { faqs, SITE } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";
import { accordionVariants, listContainer, revealUp } from "../utils/motion";

/**
 * FAQ accordion.
 *
 * These questions and answers are mirrored word for word in the FAQPage
 * JSON-LD in index.html and in /public/llms.txt. Two reasons that matters:
 * Google only trusts FAQ structured data when the answer is visible on the
 * page, and generative engines quote whichever phrasing they find in both
 * places. Edit all three together.
 */
const FaqItem = ({ item, index, isOpen, onToggle }) => {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <motion.div
      variants={revealUp(index * 0.05)}
      className={`overflow-hidden rounded-3xl border transition-colors duration-500 ${
        isOpen
          ? "border-violet/35 bg-white/[.045]"
          : "border-white/[.08] bg-white/[.02] hover:border-white/20"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-7 sm:py-6"
        >
          <span className="font-display text-[15.5px] font-semibold leading-snug text-white sm:text-[17px]">
            {item.q}
          </span>

          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
              isOpen
                ? "rotate-45 border-violet bg-violet/20 text-white"
                : "border-white/15 text-secondary"
            }`}
            aria-hidden="true"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-secondary sm:px-7 sm:pb-7 sm:pr-16">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <SectionHeading
        id="faq"
        eyebrow="Before you ask"
        title="Questions,"
        accent="answered."
        intro="The things people ask before a first call — scope, timelines, tools and how to get a quote."
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[1fr_340px] lg:gap-14">
        <motion.div variants={listContainer(0.07)} className="flex flex-col gap-3">
          {faqs.map((item, index) => (
            <FaqItem
              key={item.q}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>

        {/* Still-stuck panel */}
        <motion.aside
          variants={revealUp(0.15)}
          className="gradient-border glass h-fit rounded-4xl p-7 sm:p-8 lg:sticky lg:top-28"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-soft">
            Still deciding?
          </p>
          <h3 className="mt-3 font-display text-xl font-bold leading-snug text-white">
            Send the brief. I&apos;ll tell you if it&apos;s a fit.
          </h3>
          <p className="mt-4 text-[14px] leading-relaxed text-secondary">
            A rough idea, a reference video and a deadline is enough to scope from.
            {" "}
            {SITE.contact.responseTime}.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <a href="#contact" className="btn btn-primary w-full">
              Start a project
            </a>
            <a
              href={SITE.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full"
            >
              WhatsApp {SITE.contact.phoneDisplay}
            </a>
          </div>

          <p className="mt-6 border-t border-white/[.08] pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-secondary">
            {SITE.location.label}
          </p>
        </motion.aside>
      </div>
    </>
  );
};

export default SectionWrapper(Faq, "faq");
