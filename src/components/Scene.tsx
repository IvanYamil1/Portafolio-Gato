"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Gallery } from "./Gallery";
import { Cat } from "./Cat";
import { Lights } from "./Lights";
import { KeyboardControls } from "@react-three/drei";

const controls = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
];

export default function Scene() {
  return (
    <KeyboardControls map={controls}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 8], fov: 60 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 5, 30]} />

        <Suspense fallback={null}>
          <Lights />
          <Gallery />
          <Cat />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
