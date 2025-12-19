"use client";

import { useRef, Suspense } from "react";
import { Text, shaderMaterial, useTexture } from "@react-three/drei";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { useGallery } from "@/contexts/GalleryContext";

interface PaintingProps {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
  color: string;
  image?: string;
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

// Tipo para el material personalizado
type WaveTextMaterialImpl = {
  time: number;
  baseColor: THREE.Color;
} & THREE.ShaderMaterial;

// Declaración de tipo para TypeScript
declare module "@react-three/fiber" {
  interface ThreeElements {
    waveTextMaterial: React.PropsWithChildren<{
      time?: number;
      baseColor?: THREE.Color;
      ref?: React.Ref<WaveTextMaterialImpl>;
      attach?: string;
    }>;
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

// Componente para la imagen circular
function CircularImage({ image, position = [0, 0.32, 0] as [number, number, number], size = 0.22 }: { image: string; position?: [number, number, number]; size?: number }) {
  const texture = useTexture(image);

  return (
    <mesh position={position}>
      <circleGeometry args={[size, 32]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// Componente para la imagen cuadrada
function SquareImage({ image, position = [0, 0, 0] as [number, number, number], size = 0.4 }: { image: string; position?: [number, number, number]; size?: number }) {
  const texture = useTexture(image);

  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// Componente especial para "Sobre Mí" con estilo pergamino
function SobreMiContent({ image }: { image?: string }) {
  return (
    <group position={[0, 0, 0.08]}>
      {/* Fondo pergamino limpio */}
      <mesh position={[0, 0, -0.003]}>
        <planeGeometry args={[1.85, 1.25]} />
        <meshBasicMaterial color="#d4c4a8" />
      </mesh>

      {/* ========== SECCIÓN SUPERIOR ========== */}

      {/* Título centrado arriba */}
      <Text
        position={[0, 0.52, 0.001]}
        fontSize={0.1}
        color="#5c4a32"
        anchorX="center"
        anchorY="middle"
      >
        Sobre Mí
      </Text>

      {/* Línea decorativa bajo el título */}
      <mesh position={[0, 0.43, 0]}>
        <planeGeometry args={[1.4, 0.003]} />
        <meshBasicMaterial color="#c9a227" />
      </mesh>

      {/* Diamante decorativo central */}
      <mesh position={[0, 0.43, 0.001]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.025, 0.025]} />
        <meshBasicMaterial color="#c9a227" />
      </mesh>

      {/* ========== SECCIÓN MEDIA - Imagen + Info ========== */}

      {/* Imagen - lado izquierdo */}
      {image && (
        <group position={[-0.32, 0.05, 0]}>
          <SquareImage image={image} position={[0, 0, 0]} size={0.58} />
          <mesh position={[0, 0, -0.001]}>
            <planeGeometry args={[0.62, 0.62]} />
            <meshBasicMaterial color="#c9a227" />
          </mesh>
        </group>
      )}

      {/* Info principal - lado derecho de la imagen */}
      <group position={[0.32, 0.08, 0]}>
        {/* Nombre grande */}
        <Text
          position={[0, 0.2, 0.001]}
          fontSize={0.065}
          color="#5c4a32"
          anchorX="center"
          anchorY="middle"
        >
          Ivan Yamil
        </Text>

        {/* Subtítulo profesión */}
        <Text
          position={[0, 0.1, 0.001]}
          fontSize={0.035}
          color="#8b7355"
          anchorX="center"
          anchorY="middle"
        >
          Desarrollador Full Stack
        </Text>

        {/* Recuadro solo para los campos de info */}
        <group position={[0, -0.13, 0]}>
          {/* Fondo del recuadro */}
          <mesh position={[0, 0, -0.001]}>
            <planeGeometry args={[0.58, 0.32]} />
            <meshBasicMaterial color="#c9b896" />
          </mesh>

          {/* Estudios */}
          <group position={[0, 0.12, 0]}>
            <Text
              position={[-0.26, 0, 0.001]}
              fontSize={0.032}
              color="#c9a227"
              anchorX="left"
              anchorY="middle"
            >
              🎓
            </Text>
            <Text
              position={[-0.20, 0, 0.001]}
              fontSize={0.027}
              color="#5c4a32"
              anchorX="left"
              anchorY="middle"
            >
              Ing. en Computación
            </Text>
          </group>

          {/* Enfoque */}
          <group position={[0, 0.06, 0]}>
            <Text
              position={[-0.26, 0, 0.001]}
              fontSize={0.032}
              color="#c9a227"
              anchorX="left"
              anchorY="middle"
            >
              💻
            </Text>
            <Text
              position={[-0.20, 0, 0.001]}
              fontSize={0.027}
              color="#5c4a32"
              anchorX="left"
              anchorY="middle"
            >
              Web & Mobile Dev
            </Text>
          </group>

          {/* Ubicación */}
          <group position={[0, 0, 0]}>
            <Text
              position={[-0.26, 0, 0.001]}
              fontSize={0.032}
              color="#c9a227"
              anchorX="left"
              anchorY="middle"
            >
              📍
            </Text>
            <Text
              position={[-0.20, 0, 0.001]}
              fontSize={0.027}
              color="#5c4a32"
              anchorX="left"
              anchorY="middle"
            >
              México
            </Text>
          </group>

          {/* Idiomas */}
          <group position={[0, -0.06, 0]}>
            <Text
              position={[-0.26, 0, 0.001]}
              fontSize={0.032}
              color="#c9a227"
              anchorX="left"
              anchorY="middle"
            >
              🌐
            </Text>
            <Text
              position={[-0.20, 0, 0.001]}
              fontSize={0.027}
              color="#5c4a32"
              anchorX="left"
              anchorY="middle"
            >
              Español / Inglés
            </Text>
          </group>

          {/* Correo */}
          <group position={[0, -0.12, 0]}>
            <Text
              position={[-0.26, 0, 0.001]}
              fontSize={0.032}
              color="#c9a227"
              anchorX="left"
              anchorY="middle"
            >
              ✉️
            </Text>
            <Text
              position={[-0.20, 0, 0.001]}
              fontSize={0.027}
              color="#5c4a32"
              anchorX="left"
              anchorY="middle"
            >
              Ivan.hamden7950@alumnos.udg.mx
            </Text>
          </group>
        </group>
      </group>

      {/* ========== SECCIÓN INFERIOR - Descripción ========== */}

      {/* Línea separadora superior */}
      <mesh position={[0, -0.32, 0]}>
        <planeGeometry args={[1.6, 0.002]} />
        <meshBasicMaterial color="#c9a227" transparent opacity={0.4} />
      </mesh>

      {/* Descripción más completa */}
      <Text
        position={[0, -0.36, 0.001]}
        fontSize={0.028}
        color="#5c4a32"
        anchorX="center"
        anchorY="top"
        maxWidth={1.65}
        lineHeight={1.35}
        textAlign="center"
      >
        Soy estudiante de Ingeniería en Computación y programador con enfoque en desarrollo web y móvil. Me apasiona crear aplicaciones y páginas bien estructuradas, eficientes y visualmente atractivas. Presto especial atención a los detalles, tanto en la lógica como en el diseño, porque considero que un buen producto habla tanto del desarrollador como de la empresa que lo respalda.
      </Text>
    </group>
  );
}

export function Painting({ position, rotation, title, description, color, image }: PaintingProps) {
  const { showIntro, selectedPainting, setSelectedPainting } = useGallery();
  const isSelected = selectedPainting?.title === title;

  const handleClick = () => {
    if (isSelected) {
      setSelectedPainting(null);
    } else {
      setSelectedPainting({ position, rotation, title, description });
    }
  };

  const isSobreMi = title === "Sobre Mí";

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

      {/* Passepartout - para todos los cuadros */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.1, 1.5, 0.02]} />
        <meshStandardMaterial
          color="#f5f5dc"
          roughness={0.9}
        />
      </mesh>

      {/* Lienzo/Cuadro - clickeable - solo para cuadros que no son "Sobre Mí" */}
      {!isSobreMi && (
        <mesh position={[0, 0, 0.07]} onClick={handleClick}>
          <planeGeometry args={[1.9, 1.3]} />
          <meshStandardMaterial
            color={color}
            emissive="#0a0a1a"
            emissiveIntensity={0.1}
            roughness={0.8}
          />
        </mesh>
      )}

      {/* Área clickeable para "Sobre Mí" */}
      {isSobreMi && (
        <mesh position={[0, 0, 0.05]} onClick={handleClick}>
          <planeGeometry args={[2.1, 1.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Contenido fijo en el cuadro usando Text 3D */}
      {!showIntro && isSobreMi && (
        <Suspense fallback={null}>
          <SobreMiContent image={image} />
        </Suspense>
      )}

      {!showIntro && title !== "Sobre Mí" && (
        <group position={[0, 0, 0.08]}>
          {/* Fondo con gradiente simulado */}
          <mesh position={[0, 0, -0.003]}>
            <planeGeometry args={[1.85, 1.25]} />
            <meshBasicMaterial color="#0a0a12" transparent opacity={0.85} />
          </mesh>

          {/* Borde dorado interior */}
          <mesh position={[0, 0, -0.002]}>
            <planeGeometry args={[1.8, 1.2]} />
            <meshBasicMaterial color="#0f0f18" transparent opacity={0.9} />
          </mesh>

          {/* Marco dorado decorativo superior */}
          <mesh position={[0, 0.55, 0]}>
            <planeGeometry args={[1.6, 0.008]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.7} />
          </mesh>

          {/* Marco dorado decorativo inferior */}
          <mesh position={[0, -0.55, 0]}>
            <planeGeometry args={[1.6, 0.008]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.7} />
          </mesh>

          {/* Imagen circular */}
          {image && (
            <Suspense fallback={null}>
              <CircularImage image={image} />
            </Suspense>
          )}

          {/* Borde dorado de la imagen */}
          {image && (
            <mesh position={[0, 0.32, -0.001]}>
              <ringGeometry args={[0.22, 0.25, 32]} />
              <meshBasicMaterial color="#d4af37" transparent opacity={0.8} />
            </mesh>
          )}

          {/* Título */}
          <Text
            position={[0, image ? 0.02 : 0.35, 0.001]}
            fontSize={0.11}
            color="#d4af37"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.6}
          >
            {title}
          </Text>

          {/* Línea decorativa bajo el título */}
          <mesh position={[0, image ? -0.08 : 0.22, 0]}>
            <planeGeometry args={[0.5, 0.006]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.9} />
          </mesh>

          {/* Diamante decorativo */}
          <mesh position={[0, image ? -0.08 : 0.22, 0.001]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.04, 0.04]} />
            <meshBasicMaterial color="#d4af37" />
          </mesh>

          {/* Descripción */}
          <Text
            position={[0, image ? -0.3 : -0.1, 0.001]}
            fontSize={0.052}
            color="#e0e0e0"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.6}
            lineHeight={1.5}
            textAlign="center"
          >
            {description}
          </Text>

          {/* Esquinas decorativas */}
          {/* Superior izquierda */}
          <mesh position={[-0.85, 0.55, 0]}>
            <planeGeometry args={[0.12, 0.006]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-0.9, 0.5, 0]}>
            <planeGeometry args={[0.006, 0.12]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>

          {/* Superior derecha */}
          <mesh position={[0.85, 0.55, 0]}>
            <planeGeometry args={[0.12, 0.006]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.9, 0.5, 0]}>
            <planeGeometry args={[0.006, 0.12]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>

          {/* Inferior izquierda */}
          <mesh position={[-0.85, -0.55, 0]}>
            <planeGeometry args={[0.12, 0.006]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-0.9, -0.5, 0]}>
            <planeGeometry args={[0.006, 0.12]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>

          {/* Inferior derecha */}
          <mesh position={[0.85, -0.55, 0]}>
            <planeGeometry args={[0.12, 0.006]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.9, -0.5, 0]}>
            <planeGeometry args={[0.006, 0.12]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
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
