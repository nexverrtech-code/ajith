import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import { useIsMobile, usePrefersReducedMotion } from "../../hooks";

const Stars = ({ count, ...props }) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(count), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

/**
 * Ambient starfield behind the closing sections.
 * Half the point count on phones, and skipped entirely under reduced-motion —
 * a slowly drifting field is exactly what that setting is asking us to drop.
 */
const StarsCanvas = () => {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  // Float32Array length, so it must stay a multiple of 3.
  const count = useMemo(() => (isMobile ? 1800 : 5001), [isMobile]);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 z-[-1] h-auto w-full" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Stars count={count} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
