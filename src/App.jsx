import { MotionConfig } from "framer-motion";

import {
  AmbientStars,
  About,
  BackToTop,
  Contact,
  CustomCursor,
  Experience,
  Faq,
  Footer,
  Hero,
  Marquee,
  Navbar,
  Preloader,
  ScrollProgress,
  Services,
  Tech,
  Works,
} from "./components";

const App = () => {
  return (
    /**
     * reducedMotion="user" makes the OS setting actually govern Framer Motion.
     * The CSS media query in index.css only reaches CSS animations and
     * transitions — every reveal, drawer and lightbox here is animated in JS,
     * so without this they kept moving for people who asked them not to.
     * Opacity fades still play; transform and layout animation is dropped.
     */
    <MotionConfig reducedMotion="user">
      {/* Overlay, not a gate — the page below is always rendered and
          interactive, so a stalled intro can never hide the site. */}
      <Preloader />

      {/* Global chrome */}
      <CustomCursor />
      <ScrollProgress />
      <div className="noise" aria-hidden="true" />

      <a href="#about" className="skip-link">
        Skip to content
      </a>

      <div className="relative z-0 bg-ink-950">
        <Navbar />

        <main>
          <Hero />
          <About />
          <Services />
          <Marquee />
          <Experience />
          <Tech />
          <Works />
          <Faq />

          {/* Starfield sits behind the closing section, as in the original.
              AmbientStars picks WebGL or CSS based on what the device can afford. */}
          <div className="relative z-0">
            <AmbientStars />
            <Contact />
          </div>
        </main>

        <Footer />
        <BackToTop />
      </div>
    </MotionConfig>
  );
};

export default App;
