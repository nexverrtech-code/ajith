import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ size }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  // Scale and framing per breakpoint so the model never crops awkwardly.
  const config = {
    sm: { scale: 0.62, position: [0, -2.9, -2.2] },
    md: { scale: 0.68, position: [0, -3.1, -1.9] },
    lg: { scale: 0.75, position: [0, -3.25, -1.5] },
  }[size];

  return (
    <mesh>
      <hemisphereLight intensity={0.18} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      {/* A violet key light to tie the scene into the brand palette */}
      <pointLight position={[6, 2, 4]} intensity={12} color="#915eff" distance={22} />
      <pointLight position={[-6, 1, -4]} intensity={8} color="#22d3ee" distance={20} />
      <primitive
        object={computer.scene}
        scale={config.scale}
        position={config.position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [size, setSize] = useState("lg");
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 640px)");
    const medium = window.matchMedia("(max-width: 1279px)");

    const resolve = () => setSize(small.matches ? "sm" : medium.matches ? "md" : "lg");

    resolve();
    small.addEventListener("change", resolve);
    medium.addEventListener("change", resolve);
    return () => {
      small.removeEventListener("change", resolve);
      medium.removeEventListener("change", resolve);
    };
  }, []);

  // Stop rendering once the hero scrolls away — the GPU goes idle for the
  // rest of the page instead of driving a scene nobody can see.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        frameloop={inView ? "demand" : "never"}
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Computers size={size} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

useGLTF.preload("./desktop_pc/scene.gltf");

export default ComputersCanvas;
