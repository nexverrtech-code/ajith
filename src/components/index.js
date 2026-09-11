/**
 * Barrel for the DOM components only.
 *
 * The WebGL canvases are deliberately NOT re-exported here — re-exporting them
 * would pull three.js into the main bundle and undo the lazy loading. Import
 * them straight from "./canvas/<Name>" inside a React.lazy() call instead.
 *
 * CanvasLoader is excluded for the same reason: it imports @react-three/drei,
 * so re-exporting it here was enough to pull the whole 830 KB three.js chunk
 * onto phones that never render a single 3D scene. The canvas components
 * import it directly from "../Loader".
 */
import AmbientStars from "./AmbientStars";
import About from "./About";
import BackToTop from "./BackToTop";
import Contact from "./Contact";
import CustomCursor from "./CustomCursor";
import Experience from "./Experience";
import Feedbacks from "./Feedbacks";
import Footer from "./Footer";
import Hero from "./Hero";
import Magnetic from "./Magnetic";
import Marquee from "./Marquee";
import Navbar from "./Navbar";
import Preloader from "./Preloader";
import ScrollProgress from "./ScrollProgress";
import Starfield from "./Starfield";
import SectionHeading from "./SectionHeading";
import Services from "./Services";
import Tech from "./Tech";
import Toast from "./Toast";
import Works from "./Works";

export {
  About,
  AmbientStars,
  BackToTop,
  Contact,
  CustomCursor,
  Experience,
  Feedbacks,
  Footer,
  Hero,
  Magnetic,
  Marquee,
  Navbar,
  Preloader,
  ScrollProgress,
  SectionHeading,
  Starfield,
  Services,
  Tech,
  Toast,
  Works,
};
