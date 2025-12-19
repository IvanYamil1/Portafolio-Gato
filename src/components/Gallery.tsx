"use client";

import { Painting } from "./Painting";

// Información para cada cuadro (pasillo más angosto)
const paintings = [
  // Pared izquierda (z=6 primero, z=-6 último)
  {
    id: 1,
    position: [-2.75, 1.8, 6] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: "Sobre Mí",
    description: "Soy Yamil, un desarrollador apasionado por crear experiencias digitales únicas. Me encanta combinar creatividad con código para dar vida a ideas innovadoras.",
    color: "#1a1a2e",
    image: "/images/imagen1.jpeg",
  },
  {
    id: 2,
    position: [-2.75, 1.8, 0] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: "Proyectos",
    description: "He trabajado en e-commerce, dashboards, aplicaciones móviles, y experiencias 3D interactivas como esta que estás explorando ahora.",
    color: "#16213e",
    image: "/images/imagen2.png",
  },
  {
    id: 3,
    position: [-2.75, 1.8, -6] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: "Educación",
    description: "Formación continua en desarrollo de software, cursos especializados y certificaciones en tecnologías modernas.",
    color: "#1a1a2e",
    image: "/images/imagen3.png",
  },
  // Pared derecha (z=6 primero, z=-6 último)
  {
    id: 4,
    position: [2.75, 1.8, 6] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: "Habilidades",
    description: "React • Next.js • TypeScript • Node.js • Python • Three.js • Tailwind CSS • PostgreSQL • MongoDB • Git",
    color: "#0f3460",
    image: "/images/imagen4.png",
  },
  {
    id: 5,
    position: [2.75, 1.8, 0] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: "Experiencia",
    description: "Años de experiencia desarrollando aplicaciones web modernas, desde startups hasta proyectos empresariales. Siempre aprendiendo y mejorando.",
    color: "#16213e",
    image: "/images/imagen5.png",
  },
  {
    id: 6,
    position: [2.75, 1.8, -6] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: "Contacto",
    description: "¿Tienes un proyecto en mente? ¡Hablemos! Email: tu@email.com • GitHub: github.com/tuusuario • LinkedIn: linkedin.com/in/tuusuario",
    color: "#1a1a2e",
  },
];

interface GalleryProps {
  isMobile?: boolean;
}

export function Gallery({ isMobile = false }: GalleryProps) {
  return (
    <group>
      {/* Piso del pasillo - mármol oscuro elegante */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={!isMobile}
      >
        <planeGeometry args={[6, 28]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={isMobile ? 0.1 : 0.4}
        />
      </mesh>

      {/* Líneas decorativas doradas en el piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.8, 0.005, 0]}>
        <planeGeometry args={[0.02, 26]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.8, 0.005, 0]}>
        <planeGeometry args={[0.02, 26]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.1} />
      </mesh>

      {/* Alfombra central elegante */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow={!isMobile}
      >
        <planeGeometry args={[1.5, 24]} />
        <meshStandardMaterial
          color="#1a0a0a"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Borde dorado de la alfombra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.77, 0.012, 0]}>
        <planeGeometry args={[0.04, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.77, 0.012, 0]}>
        <planeGeometry args={[0.04, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[-3, 2.5, 0]} receiveShadow={!isMobile}>
        <boxGeometry args={[0.3, 5, 28]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Pared derecha */}
      <mesh position={[3, 2.5, 0]} receiveShadow={!isMobile}>
        <boxGeometry args={[0.3, 5, 28]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Techo */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[6, 0.3, 28]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Moldura dorada en el techo */}
      <mesh position={[0, 4.83, 0]}>
        <boxGeometry args={[0.6, 0.05, 28]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Pared del fondo */}
      <mesh position={[0, 2.5, -14]}>
        <boxGeometry args={[6, 5, 0.3]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Molduras laterales en el techo - separadas para evitar z-fighting */}
      <mesh position={[-2.7, 4.83, 0]}>
        <boxGeometry args={[0.15, 0.08, 28]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[2.7, 4.83, 0]}>
        <boxGeometry args={[0.15, 0.08, 28]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Zócalo - separado de la pared para evitar z-fighting */}
      <mesh position={[-2.75, 0.1, 0]}>
        <boxGeometry args={[0.12, 0.2, 28]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[2.75, 0.1, 0]}>
        <boxGeometry args={[0.12, 0.2, 28]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
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
          image={painting.image}
        />
      ))}
    </group>
  );
}
