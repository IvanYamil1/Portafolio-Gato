"use client";

import { useRef } from "react";
import { Html, Text, shaderMaterial } from "@react-three/drei";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { useGallery } from "@/contexts/GalleryContext";

interface PaintingProps {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
  color: string;
}

// Shader material para efecto de brillo ondulante

const WaveTextMaterial = shaderMaterial(
  {
    time: 0,
    baseColor: new THREE.Color("#ffffff"),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 baseColor;
    varying vec2 vUv;

    void main() {
      // Ciclo de 3 segundos: la ola tarda 2s en pasar, 1s de pausa
      float cycleDuration = 3.0;
      float waveTime = mod(time, cycleDuration);

      // Posición de la ola: va de -0.2 a 1.2 en 2 segundos
      float wavePos = (waveTime / 2.0) * 1.4 - 0.2;

      // Solo mostrar la ola durante los primeros 2 segundos del ciclo
      float waveActive = step(waveTime, 2.0);

      // Distancia del pixel actual a la posición de la ola
      float dist = abs(vUv.x - wavePos);

      // Brillo basado en la distancia (más cerca = más brillo)
      float glowWidth = 0.12;
      float glow = max(0.0, 1.0 - dist / glowWidth);
      glow = pow(glow, 2.0) * waveActive;

      // Brillo base más el brillo de la ola
      float brightness = 0.6 + glow * 1.8;

      vec3 finalColor = baseColor * brightness;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ WaveTextMaterial });

// Declaración de tipo para TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveTextMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        time?: number;
        baseColor?: THREE.Color;
      };
    }
  }
}

// Componente para el texto con efecto de brillo ondulante
function GlowingText({ text }: { text: string }) {
  const materialRef = useRef<typeof WaveTextMaterial.prototype>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });

  return (
    <Text
      position={[0, 0, 0.02]}
      fontSize={0.08}
      anchorX="center"
      anchorY="middle"
      maxWidth={1.3}
    >
      {text}
      <waveTextMaterial
        ref={materialRef}
        baseColor={new THREE.Color("#ffffff")}
      />
    </Text>
  );
}

export function Painting({ position, rotation, title, description, color }: PaintingProps) {
  const { showIntro, selectedPainting, setSelectedPainting } = useGallery();
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

      {/* Lienzo/Cuadro - clickeable */}
      <mesh position={[0, 0, 0.07]} onClick={handleClick}>
        <planeGeometry args={[1.9, 1.3]} />
        <meshStandardMaterial
          color={color}
          emissive="#0a0a1a"
          emissiveIntensity={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Texto fijo en el cuadro (usando Text 3D que no rota) */}
      {!showIntro && (
        <group position={[0, 0, 0.08]}>
          {/* Fondo semi-transparente para mejor legibilidad */}
          <mesh position={[0, 0, -0.005]}>
            <planeGeometry args={[1.85, 1.25]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.4} />
          </mesh>

          {/* Línea decorativa superior */}
          <mesh position={[0, 0.5, 0]}>
            <planeGeometry args={[1.2, 0.003]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>

          {/* Título */}
          <Text
            position={[0, 0.38, 0]}
            fontSize={0.14}
            color="#d4af37"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.7}
            fontWeight="bold"
          >
            {title}
          </Text>

          {/* Línea decorativa bajo el título */}
          <mesh position={[0, 0.25, 0]}>
            <planeGeometry args={[0.5, 0.004]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.8} />
          </mesh>

          {/* Descripción */}
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.058}
            color="#e8e8e8"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.65}
            lineHeight={1.5}
            textAlign="center"
          >
            {description}
          </Text>

          {/* Línea decorativa inferior */}
          <mesh position={[0, -0.5, 0]}>
            <planeGeometry args={[1.2, 0.003]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>

          {/* Esquinas decorativas */}
          {/* Superior izquierda */}
          <mesh position={[-0.85, 0.55, 0]}>
            <planeGeometry args={[0.1, 0.003]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.9, 0.5, 0]}>
            <planeGeometry args={[0.003, 0.1]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>

          {/* Superior derecha */}
          <mesh position={[0.85, 0.55, 0]}>
            <planeGeometry args={[0.1, 0.003]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.9, 0.5, 0]}>
            <planeGeometry args={[0.003, 0.1]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>

          {/* Inferior izquierda */}
          <mesh position={[-0.85, -0.55, 0]}>
            <planeGeometry args={[0.1, 0.003]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.9, -0.5, 0]}>
            <planeGeometry args={[0.003, 0.1]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>

          {/* Inferior derecha */}
          <mesh position={[0.85, -0.55, 0]}>
            <planeGeometry args={[0.1, 0.003]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.9, -0.5, 0]}>
            <planeGeometry args={[0.003, 0.1]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.5} />
          </mesh>
        </group>
      )}

      {/* Placa del título debajo del cuadro */}
      <group position={[0, -1.05, 0.06]}>
        <mesh>
          <boxGeometry args={[1.4, 0.22, 0.03]} />
          <meshStandardMaterial
            color="#b8860b"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        {!showIntro && <GlowingText text={title.toUpperCase()} />}
      </group>
    </group>
  );
}
