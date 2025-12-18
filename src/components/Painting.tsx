"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useGallery } from "@/contexts/GalleryContext";

interface PaintingProps {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
  color: string;
}

export function Painting({ position, rotation, title, description, color }: PaintingProps) {
  const [hovered, setHovered] = useState(false);
  const { selectedPainting, setSelectedPainting } = useGallery();

  const isSelected = selectedPainting?.title === title;

  const handleClick = () => {
    if (isSelected) {
      setSelectedPainting(null);
    } else {
      setSelectedPainting({ position, rotation, title, description });
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Marco dorado */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.8, 0.15]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Interior del marco (rebaje) */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.1, 1.5, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Lienzo/Cuadro */}
      <mesh
        position={[0, 0, 0.08]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <planeGeometry args={[2, 1.4]} />
        <meshStandardMaterial
          color={hovered ? "#2a2a4a" : color}
          emissive={hovered ? "#1a1a3a" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Texto del título en el cuadro */}
      {!selectedPainting && (
        <Html
          position={[0, 0, 0.1]}
          center
          style={{
            width: "180px",
            textAlign: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              color: "#d4af37",
              fontSize: "18px",
              fontWeight: "bold",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              fontFamily: "serif",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#888",
              fontSize: "11px",
              marginTop: "8px",
            }}
          >
            Click para ver más
          </div>
        </Html>
      )}

      {/* Luz del cuadro (pequeño reflector) */}
      <mesh position={[0, 1.1, 0.2]}>
        <boxGeometry args={[0.4, 0.08, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
      </mesh>
    </group>
  );
}
