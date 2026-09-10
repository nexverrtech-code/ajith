/**
 * Shared typography and spacing tokens.
 *
 * Headings use the fluid clamp() scale defined in tailwind.config.cjs, so
 * every size interpolates between the mobile and desktop end of the range
 * instead of jumping at breakpoints.
 */
const styles = {
  paddingX: "sm:px-16 px-5",
  paddingY: "sm:py-16 py-10",
  padding: "sm:px-16 px-5 sm:py-20 py-14",

  // Hero
  heroHeadText: "font-display font-extrabold text-white text-fluid-hero",
  heroSubText: "text-[#cfc9ee] font-light text-fluid-body max-w-2xl",

  // Sections
  sectionHeadText: "font-display font-extrabold text-white text-fluid-h2",
  sectionSubText:
    "font-mono text-eyebrow uppercase text-violet-soft/90 font-medium",
  sectionBody: "text-secondary text-fluid-body max-w-3xl",

  // Cards
  cardTitle: "font-display font-bold text-white text-fluid-h3",
  cardBody: "text-secondary text-[15px] leading-[1.7]",

  // Layout
  container: "max-w-7xl mx-auto",
};

export { styles };
