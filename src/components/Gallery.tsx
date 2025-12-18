"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Painting } from "./Painting";

// Información para cada cuadro (pasillo más angosto)
const paintings = [
  {
    id: 1,
    position: [-3.2, 1.8, -8] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: "Sobre Mí",
    description: "Soy Yamil, un desarrollador apasionado por crear experiencias digitales únicas. Me encanta combinar creatividad con código para dar vida a ideas innovadoras.",
    color: "#1a1a2e",
  },
  {
    id: 2,
    position: [-3.2, 1.8, 0] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: "Habilidades",
    description: "React • Next.js • TypeScript • Node.js • Python • Three.js • Tailwind CSS • PostgreSQL • MongoDB • Git",
    color: "#16213e",
  },
  {
    id: 3,
    position: [-3.2, 1.8, 8] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: "Experiencia",
    description: "Años de experiencia desarrollando aplicaciones web modernas, desde startups hasta proyectos empresariales. Siempre aprendiendo y mejorando.",
    color: "#1a1a2e",
  },
  {
    id: 4,
    position: [3.2, 1.8, -8] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: "Proyectos",
    description: "He trabajado en e-commerce, dashboards, aplicaciones móviles, y experiencias 3D interactivas como esta que estás explorando ahora.",
    color: "#0f3460",
  },
  {
    id: 5,
    position: [3.2, 1.8, 0] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: "Educación",
    description: "Formación continua en desarrollo de software, cursos especializados y certificaciones en tecnologías modernas.",
    color: "#16213e",
  },
  {
    id: 6,
    position: [3.2, 1.8, 8] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: "Contacto",
    description: "¿Tienes un proyecto en mente? ¡Hablemos! Email: tu@email.com • GitHub: github.com/tuusuario • LinkedIn: linkedin.com/in/tuusuario",
    color: "#1a1a2e",
  },
];

export function Gallery() {
  const floorRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* Piso del pasillo - mármol oscuro elegante */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[8, 40]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Líneas decorativas doradas en el piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.005, 0]}>
        <planeGeometry args={[0.02, 38]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.005, 0]}>
        <planeGeometry args={[0.02, 38]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.1} />
      </mesh>

      {/* Alfombra central elegante */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[2, 36]} />
        <meshStandardMaterial
          color="#1a0a0a"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Borde dorado de la alfombra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.02, 0.012, 0]}>
        <planeGeometry args={[0.04, 36]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.02, 0.012, 0]}>
        <planeGeometry args={[0.04, 36]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pared izquierda con textura elegante */}
      <mesh position={[-4, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.3, 5, 40]} />
        <meshStandardMaterial color="#151515" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Panel decorativo pared izquierda */}
      <mesh position={[-3.82, 2.5, 0]}>
        <boxGeometry args={[0.02, 4.5, 39]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.7} />
      </mesh>

      {/* Pared derecha */}
      <mesh position={[4, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.3, 5, 40]} />
        <meshStandardMaterial color="#151515" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Panel decorativo pared derecha */}
      <mesh position={[3.82, 2.5, 0]}>
        <boxGeometry args={[0.02, 4.5, 39]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.7} />
      </mesh>

      {/* Techo elegante */}
      <mesh position={[0, 5, 0]} receiveShadow>
        <boxGeometry args={[8, 0.3, 40]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Moldura decorativa central en el techo */}
      <mesh position={[0, 4.83, 0]}>
        <boxGeometry args={[0.8, 0.05, 40]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Pared del fondo */}
      <mesh position={[0, 2.5, -20]} receiveShadow>
        <boxGeometry args={[8, 5, 0.3]} />
        <meshStandardMaterial color="#151515" roughness={0.85} />
      </mesh>

      {/* Molduras decorativas doradas en el techo - laterales */}
      <mesh position={[-3.85, 4.85, 0]}>
        <boxGeometry args={[0.15, 0.08, 40]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[3.85, 4.85, 0]}>
        <boxGeometry args={[0.15, 0.08, 40]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Segunda línea de moldura */}
      <mesh position={[-3.85, 4.6, 0]}>
        <boxGeometry args={[0.08, 0.03, 40]} />
        <meshStandardMaterial color="#b8960c" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[3.85, 4.6, 0]}>
        <boxGeometry args={[0.08, 0.03, 40]} />
        <meshStandardMaterial color="#b8960c" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Zócalo elegante */}
      <mesh position={[-3.9, 0.1, 0]}>
        <boxGeometry args={[0.12, 0.2, 40]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[3.9, 0.1, 0]}>
        <boxGeometry args={[0.12, 0.2, 40]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Línea dorada sobre el zócalo */}
      <mesh position={[-3.88, 0.21, 0]}>
        <boxGeometry args={[0.02, 0.02, 40]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[3.88, 0.21, 0]}>
        <boxGeometry args={[0.02, 0.02, 40]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Cuadros */}
      {paintings.map((painting) => (
        <Painting
          key={painting.id}
          position={painting.position}
          rotation={painting.rotation}
          title={painting.title}
          description={painting.description}
          color={painting.color}
        />
      ))}
    </group>
  );
}
