"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Gallery } from "./Gallery";
import { Cat } from "./Cat";
import { Lights } from "./Lights";
import { KeyboardControls } from "@react-three/drei";
import { useGallery } from "@/contexts/GalleryContext";

const controls = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
];

export default function Scene() {
  const { isMobile } = useGallery();

  return (
    <KeyboardControls map={controls}>
      <Canvas
        shadows={!isMobile}
        camera={{ position: [0, 1.5, 13], fov: 60 }}
        style={{ width: "100vw", height: "100vh" }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        {!isMobile && <fog attach="fog" args={["#0a0a0a", 5, 30]} />}

        <Suspense fallback={null}>
          <Lights isMobile={isMobile} />
          <Gallery isMobile={isMobile} />
          <Cat />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
