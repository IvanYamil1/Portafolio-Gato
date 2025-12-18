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
      {/* Marco dorado - simplificado a una sola capa */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 1.8, 0.1]} />
        <meshStandardMaterial
          color="#b8860b"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Passepartout */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.1, 1.5, 0.02]} />
        <meshStandardMaterial
          color="#f5f5dc"
          roughness={0.9}
        />
      </mesh>

      {/* Lienzo/Cuadro */}
      <mesh
        position={[0, 0, 0.07]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <planeGeometry args={[1.9, 1.3]} />
        <meshStandardMaterial
          color={hovered ? "#3a3a5a" : color}
          emissive={hovered ? "#2a2a4a" : "#111122"}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          roughness={0.8}
        />
      </mesh>

      {/* Texto del título en el cuadro */}
      {!selectedPainting && (
        <Html
          position={[0, 0, 0.1]}
          center
          style={{
            width: "200px",
            textAlign: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              color: "#f0e68c",
              fontSize: "20px",
              fontWeight: "600",
              textShadow: "0 2px 15px rgba(0,0,0,0.9), 0 0 30px rgba(218,165,32,0.3)",
              fontFamily: "Georgia, serif",
              letterSpacing: "1px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "10px",
              marginTop: "10px",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            Click para ver
          </div>
        </Html>
      )}

      {/* Placa del título debajo del cuadro */}
      <mesh position={[0, -1.05, 0.06]}>
        <boxGeometry args={[0.7, 0.12, 0.02]} />
        <meshStandardMaterial
          color="#b8860b"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}
