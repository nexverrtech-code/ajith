/**
 * CSS starfield — the mobile stand-in for the WebGL <StarsCanvas>.
 *
 * Rendering the real point cloud on phones meant pulling the whole three.js
 * chunk (~830 KB, 222 KB gzipped) down a mobile connection for a decorative
 * background. This is three layered radial-gradient fields instead: a few
 * hundred bytes, no GPU context, and it drifts with a compositor-only
 * transform that reduced-motion switches off.
 */
const FIELD_1 =
  "radial-gradient(1.4px 1.4px at 18% 22%, rgba(242,114,200,.85), transparent 60%)," +
  "radial-gradient(1.2px 1.2px at 72% 14%, rgba(255,255,255,.7), transparent 60%)," +
  "radial-gradient(1.6px 1.6px at 44% 66%, rgba(177,140,255,.8), transparent 60%)," +
  "radial-gradient(1px 1px at 88% 48%, rgba(255,255,255,.55), transparent 60%)," +
  "radial-gradient(1.3px 1.3px at 8% 78%, rgba(34,211,238,.6), transparent 60%)," +
  "radial-gradient(1.1px 1.1px at 62% 88%, rgba(255,255,255,.5), transparent 60%)";

const FIELD_2 =
  "radial-gradient(1px 1px at 32% 40%, rgba(255,255,255,.45), transparent 60%)," +
  "radial-gradient(1.5px 1.5px at 92% 72%, rgba(242,114,200,.6), transparent 60%)," +
  "radial-gradient(1px 1px at 54% 8%, rgba(255,255,255,.4), transparent 60%)," +
  "radial-gradient(1.2px 1.2px at 12% 54%, rgba(177,140,255,.55), transparent 60%)";

const Starfield = () => (
  <div className="absolute inset-0 z-[-1] overflow-hidden" aria-hidden="true">
    <div
      className="absolute inset-0 animate-float-slow opacity-70"
      style={{ backgroundImage: FIELD_1, backgroundSize: "340px 340px" }}
    />
    <div
      className="absolute inset-0 animate-float opacity-50"
      style={{ backgroundImage: FIELD_2, backgroundSize: "220px 220px" }}
    />
  </div>
);

export default Starfield;
