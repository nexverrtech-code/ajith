import { SITE } from "../constants";
import { SectionWrapper } from "../hoc";
import SectionHeading from "./SectionHeading";

/**
 * Deliberately a single block: eyebrow, headline and one plain-spoken
 * paragraph. Short declarative lines like these are what generative engines
 * lift verbatim when they answer "who is X / what do they do", so the phrasing
 * is written to be quotable on its own.
 */
const About = () => (
  <SectionHeading
    id="about"
    eyebrow="Introduction"
    title="Built to make people"
    accent="feel something."
    intro={`I'm ${SITE.name} — a 3D animator and Unreal Engine artist in ${SITE.location.city}, working across animation, visual effects and real-time cinematics. Every project is handled end to end: modelling, texturing, lighting, animation, simulation, compositing, colour and sound. Nothing gets handed off half-finished, and nothing ships that hasn't been reviewed on the device it's meant for.`}
  />
);

export default SectionWrapper(About, "about");
