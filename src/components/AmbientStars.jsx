import { Suspense, lazy } from "react";

import Starfield from "./Starfield";
import { useCanRender3D } from "../hooks";

// Only reached on capable desktops — this import is what pulls in three.js.
const StarsCanvas = lazy(() => import("./canvas/Stars"));

/**
 * Picks the starfield the device can afford: the real WebGL point cloud on
 * capable desktops, a CSS one everywhere else. The lazy import sits behind the
 * check, so phones never request the three.js chunk at all.
 */
const AmbientStars = () => {
  const canRender3D = useCanRender3D();

  if (!canRender3D) return <Starfield />;

  return (
    <Suspense fallback={<Starfield />}>
      <StarsCanvas />
    </Suspense>
  );
};

export default AmbientStars;
