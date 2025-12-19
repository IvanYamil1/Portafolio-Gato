"use client";

import { useRef, Suspense, useState } from "react";
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

// Componente base para el fondo pergamino
function PergaminoBase({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <group position={[0, 0, 0.08]}>
      {/* Fondo pergamino limpio */}
      <mesh position={[0, 0, -0.003]}>
        <planeGeometry args={[1.85, 1.25]} />
        <meshBasicMaterial color="#d4c4a8" />
      </mesh>

      {/* Título centrado arriba */}
      <Text
        position={[0, 0.52, 0.001]}
        fontSize={0.1}
        color="#5c4a32"
        anchorX="center"
        anchorY="middle"
      >
        {title}
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

      {children}
    </group>
  );
}

// Componente para imagen de proyecto
function ProyectoImage({ image, position = [0, 0, 0] as [number, number, number], width = 0.28, height = 0.18 }: { image: string; position?: [number, number, number]; width?: number; height?: number }) {
  const texture = useTexture(image);

  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// Componente individual para cada card de proyecto con hover
function ProyectoCard({ proyecto, index, imageOnLeft }: {
  proyecto: { nombre: string; tipo: string; techs: string[]; desc: string; imagen: string; link?: string };
  index: number;
  imageOnLeft: boolean
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const y = 0.15 - index * 0.32;
  const imageX = imageOnLeft ? -0.62 : 0.62;

  // Animación de hover
  useFrame(() => {
    if (groupRef.current) {
      const targetZ = hovered ? 0.03 : 0;
      groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.15;
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el click propague al cuadro padre
    if (proyecto.link) {
      window.open(proyecto.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <group
      ref={groupRef}
      position={[0, y, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Card background */}
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[1.7, 0.28]} />
        <meshBasicMaterial color={hovered ? "#b8a67a" : "#c9b896"} />
      </mesh>

      {/* Imagen del proyecto */}
      <Suspense fallback={null}>
        <ProyectoImage image={proyecto.imagen} position={[imageX, 0, 0.001]} width={0.38} height={0.22} />
      </Suspense>

      {/* Borde de la imagen */}
      <mesh position={[imageX, 0, -0.001]}>
        <planeGeometry args={[0.4, 0.24]} />
        <meshBasicMaterial color="#c9a227" />
      </mesh>

      {/* Contenido */}
      <group position={[imageOnLeft ? -0.02 : 0.02, 0, 0]}>
        {/* Nombre del proyecto - arriba */}
        <Text position={[0, 0.08, 0.001]} fontSize={0.04} color="#5c4a32" anchorX="center" anchorY="middle" fontWeight="bold">
          {proyecto.nombre}
        </Text>

        {/* Tecnologías - centro exacto */}
        <group position={[0, 0, 0]}>
          {proyecto.techs.map((tech, techIndex) => {
            const techOffset = (techIndex - 1) * 0.22;
            return (
              <group key={techIndex} position={[techOffset, 0, 0]}>
                <mesh position={[0, 0, -0.001]}>
                  <planeGeometry args={[0.2, 0.045]} />
                  <meshBasicMaterial color="#d4c4a8" />
                </mesh>
                <Text position={[0, 0, 0.001]} fontSize={0.02} color="#5c4a32" anchorX="center" anchorY="middle">
                  {tech}
                </Text>
              </group>
            );
          })}
        </group>

        {/* Descripción - abajo */}
        <Text position={[0, -0.08, 0.001]} fontSize={0.022} color="#8b7355" anchorX="center" anchorY="middle" maxWidth={0.7}>
          {proyecto.desc}
        </Text>
      </group>

      {/* Badge tipo - en el extremo opuesto a la imagen */}
      <group position={[imageOnLeft ? 0.68 : -0.68, 0, 0]}>
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[0.18, 0.07]} />
          <meshBasicMaterial color="#8b7355" />
        </mesh>
        <Text position={[0, 0, 0.001]} fontSize={0.026} color="#f5f0e6" anchorX="center" anchorY="middle" maxWidth={0.17} textAlign="center">
          {proyecto.tipo}
        </Text>
      </group>
    </group>
  );
}

// Componente para Proyectos - Cards verticales apiladas
function ProyectosContent({ image }: { image?: string }) {
  const proyectos = [
    {
      nombre: "POS Abarrotes",
      tipo: "Sistema POS",
      icon: "🛒",
      techs: ["Next.js", "TypeScript", "Zustand"],
      desc: "Sistema de punto de venta completo",
      imagen: "/images/pos-abarrotes.png",
      link: undefined,
    },
    {
      nombre: "Patitas Felices",
      tipo: "Landing Page",
      icon: "🐱",
      techs: ["Next.js", "TypeScript", "Tailwind"],
      desc: "Sitio web para refugio de gatos",
      imagen: "/images/refugio-gatos.png",
      link: undefined,
    },
    {
      nombre: "Syllet",
      tipo: "Sitio Corporativo",
      icon: "🚀",
      techs: ["Next.js", "GSAP", "Supabase"],
      desc: "Sitio de agencia con animaciones",
      imagen: "/images/syllet.png",
      link: "https://syllet.com",
    },
  ];

  return (
    <PergaminoBase title="Proyectos">
      {/* Cards verticales apiladas */}
      <group position={[0, 0.05, 0]}>
        {proyectos.map((proyecto, index) => (
          <ProyectoCard
            key={index}
            proyecto={proyecto}
            index={index}
            imageOnLeft={index % 2 === 0}
          />
        ))}
      </group>
    </PergaminoBase>
  );
}

// Componente para Educación - Estilo timeline vertical
function EducacionContent({ image }: { image?: string }) {
  return (
    <PergaminoBase title="Educación">
      {/* Timeline central */}
      <group position={[0, 0, 0]}>
        {/* Línea vertical del timeline */}
        <mesh position={[-0.5, -0.05, -0.001]}>
          <planeGeometry args={[0.004, 0.7]} />
          <meshBasicMaterial color="#c9a227" />
        </mesh>

        {/* Item 1 - Universidad */}
        <group position={[0, 0.2, 0]}>
          {/* Punto del timeline */}
          <mesh position={[-0.5, 0, 0.001]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.04, 0.04]} />
            <meshBasicMaterial color="#c9a227" />
          </mesh>
          {/* Contenido */}
          <group position={[0.15, 0, 0]}>
            <Text position={[0, 0.03, 0.001]} fontSize={0.045} color="#5c4a32" anchorX="center" anchorY="middle">
              🎓 Universidad de Guadalajara
            </Text>
            <Text position={[0, -0.04, 0.001]} fontSize={0.03} color="#8b7355" anchorX="center" anchorY="middle">
              Ingeniería en Computación
            </Text>
          </group>
        </group>

        {/* Item 2 - Estado */}
        <group position={[0, -0.05, 0]}>
          <mesh position={[-0.5, 0, 0.001]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.04, 0.04]} />
            <meshBasicMaterial color="#c9a227" />
          </mesh>
          <group position={[0.15, 0, 0]}>
            <Text position={[0, 0, 0.001]} fontSize={0.038} color="#5c4a32" anchorX="center" anchorY="middle">
              📅 Actualmente cursando
            </Text>
          </group>
        </group>

        {/* Item 3 - Cursos */}
        <group position={[0, -0.28, 0]}>
          <mesh position={[-0.5, 0, 0.001]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.04, 0.04]} />
            <meshBasicMaterial color="#c9a227" />
          </mesh>
          <group position={[0.15, 0, 0]}>
            <Text position={[0, 0.03, 0.001]} fontSize={0.035} color="#5c4a32" anchorX="center" anchorY="middle">
              ✨ Cursos y Certificaciones
            </Text>
            <Text position={[0, -0.03, 0.001]} fontSize={0.025} color="#8b7355" anchorX="center" anchorY="middle">
              Aprendizaje continuo autodidacta
            </Text>
          </group>
        </group>
      </group>

      {/* Frase motivacional */}
      <Text
        position={[0, -0.52, 0.001]}
        fontSize={0.025}
        color="#8b7355"
        anchorX="center"
        anchorY="middle"
        fontStyle="italic"
      >
        "El conocimiento es el mejor recurso"
      </Text>
    </PergaminoBase>
  );
}

// Componente para Habilidades - Estilo badges/pills en 3 columnas
function HabilidadesContent({ image }: { image?: string }) {
  const categorias = [
    { titulo: "Frontend", icon: "🎨", skills: ["React", "React Native", "Next.js", "TypeScript", "HTML/CSS", "Tailwind CSS"] },
    { titulo: "Backend", icon: "⚙️", skills: ["NestJS", "Python", "SQL", "REST APIs", "Autenticación", "Supabase"] },
    { titulo: "DevOps", icon: "🚀", skills: ["Git / GitHub", "Vercel", "Coolify", "CI/CD", "Docker", "Linux"] },
  ];

  return (
    <PergaminoBase title="Habilidades">
      {/* 3 columnas de categorías */}
      <group position={[0, 0.02, 0]}>
        {categorias.map((cat, catIndex) => {
          const x = -0.58 + catIndex * 0.58;

          return (
            <group key={catIndex} position={[x, 0.08, 0]}>
              {/* Header de categoría con fondo */}
              <mesh position={[0, 0.17, -0.001]}>
                <circleGeometry args={[0.08, 32]} />
                <meshBasicMaterial color="#5c4a32" />
              </mesh>
              <Text position={[0, 0.17, 0.001]} fontSize={0.05} anchorX="center" anchorY="middle">
                {cat.icon}
              </Text>
              <Text position={[0, 0.06, 0.001]} fontSize={0.032} color="#5c4a32" anchorX="center" anchorY="middle" fontWeight="bold">
                {cat.titulo}
              </Text>

              {/* Skills como lista vertical */}
              {cat.skills.map((skill, skillIndex) => (
                <group key={skillIndex} position={[0, -0.05 - skillIndex * 0.085, 0]}>
                  {/* Badge background */}
                  <mesh position={[0, 0, -0.001]}>
                    <planeGeometry args={[0.52, 0.072]} />
                    <meshBasicMaterial color="#c9b896" />
                  </mesh>
                  <Text position={[0, 0, 0.001]} fontSize={0.026} color="#5c4a32" anchorX="center" anchorY="middle">
                    {skill}
                  </Text>
                </group>
              ))}
            </group>
          );
        })}
      </group>

      {/* Línea decorativa */}
      <mesh position={[0, -0.47, 0]}>
        <planeGeometry args={[1.6, 0.002]} />
        <meshBasicMaterial color="#c9a227" transparent opacity={0.5} />
      </mesh>

      {/* Descripción */}
      <Text
        position={[0, -0.55, 0.001]}
        fontSize={0.028}
        color="#5c4a32"
        anchorX="center"
        anchorY="middle"
      >
        Desarrollo Full Stack End-to-End
      </Text>
    </PergaminoBase>
  );
}

// Componente para Experiencia - Estilo horizontal con iconos grandes
function ExperienciaContent({ image }: { image?: string }) {
  const experiencias = [
    { icon: "💼", titulo: "Freelance", desc: "Desarrollo web para clientes" },
    { icon: "🚀", titulo: "Proyectos", desc: "Apps personales y comerciales" },
    { icon: "🎯", titulo: "Full Stack", desc: "Web y móvil end-to-end" },
  ];

  return (
    <PergaminoBase title="Experiencia">
      {/* Experiencias en fila horizontal */}
      <group position={[0, 0.1, 0]}>
        {experiencias.map((exp, index) => {
          const x = -0.55 + index * 0.55;
          return (
            <group key={index} position={[x, 0, 0]}>
              {/* Círculo de fondo para icono */}
              <mesh position={[0, 0.08, -0.001]}>
                <circleGeometry args={[0.12, 32]} />
                <meshBasicMaterial color="#c9b896" />
              </mesh>
              {/* Borde dorado */}
              <mesh position={[0, 0.08, -0.002]}>
                <ringGeometry args={[0.12, 0.135, 32]} />
                <meshBasicMaterial color="#c9a227" />
              </mesh>
              {/* Icono */}
              <Text position={[0, 0.08, 0.001]} fontSize={0.08} anchorX="center" anchorY="middle">
                {exp.icon}
              </Text>
              {/* Título */}
              <Text position={[0, -0.08, 0.001]} fontSize={0.038} color="#5c4a32" anchorX="center" anchorY="middle">
                {exp.titulo}
              </Text>
              {/* Descripción */}
              <Text position={[0, -0.15, 0.001]} fontSize={0.022} color="#8b7355" anchorX="center" anchorY="middle" maxWidth={0.45} textAlign="center">
                {exp.desc}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Línea decorativa */}
      <mesh position={[0, -0.18, 0]}>
        <planeGeometry args={[1.5, 0.002]} />
        <meshBasicMaterial color="#c9a227" transparent opacity={0.4} />
      </mesh>

      {/* Texto destacado */}
      <group position={[0, -0.35, 0]}>
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial color="#c9b896" />
        </mesh>
        <Text
          position={[0, 0.03, 0.001]}
          fontSize={0.035}
          color="#5c4a32"
          anchorX="center"
          anchorY="middle"
        >
          Siempre aprendiendo y mejorando
        </Text>
        <Text
          position={[0, -0.05, 0.001]}
          fontSize={0.025}
          color="#8b7355"
          anchorX="center"
          anchorY="middle"
        >
          Cada proyecto es una oportunidad de crecimiento
        </Text>
      </group>
    </PergaminoBase>
  );
}

// Componente para Contacto - Estilo tarjeta de presentación
function ContactoContent() {
  const contactos = [
    { icon: "✉️", valor: "Ivan.hamden7950@alumnos.udg.mx", tipo: "Email" },
    { icon: "🐙", valor: "github.com/IvanYamil", tipo: "GitHub" },
    { icon: "💼", valor: "linkedin.com/in/ivanyamil", tipo: "LinkedIn" },
  ];

  return (
    <PergaminoBase title="Contacto">
      {/* Título llamativo */}
      <Text
        position={[0, 0.22, 0.001]}
        fontSize={0.06}
        color="#5c4a32"
        anchorX="center"
        anchorY="middle"
      >
        ¿Colaboramos?
      </Text>

      {/* Subtítulo */}
      <Text
        position={[0, 0.12, 0.001]}
        fontSize={0.028}
        color="#8b7355"
        anchorX="center"
        anchorY="middle"
      >
        Estoy disponible para nuevos proyectos
      </Text>

      {/* Cards de contacto en fila */}
      <group position={[0, -0.08, 0]}>
        {contactos.map((contacto, index) => {
          const x = -0.52 + index * 0.52;
          return (
            <group key={index} position={[x, 0, 0]}>
              {/* Card */}
              <mesh position={[0, 0, -0.001]}>
                <planeGeometry args={[0.48, 0.28]} />
                <meshBasicMaterial color="#c9b896" />
              </mesh>
              {/* Icono */}
              <Text position={[0, 0.06, 0.001]} fontSize={0.06} anchorX="center" anchorY="middle">
                {contacto.icon}
              </Text>
              {/* Tipo */}
              <Text position={[0, -0.03, 0.001]} fontSize={0.025} color="#c9a227" anchorX="center" anchorY="middle">
                {contacto.tipo}
              </Text>
              {/* Valor */}
              <Text position={[0, -0.09, 0.001]} fontSize={0.016} color="#5c4a32" anchorX="center" anchorY="middle" maxWidth={0.44}>
                {contacto.valor}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Ubicación con estilo especial */}
      <group position={[0, -0.35, 0]}>
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[0.8, 0.12]} />
          <meshBasicMaterial color="#c9b896" />
        </mesh>
        <Text position={[-0.15, 0, 0.001]} fontSize={0.04} anchorX="center" anchorY="middle">
          📍
        </Text>
        <Text position={[0.1, 0, 0.001]} fontSize={0.03} color="#5c4a32" anchorX="left" anchorY="middle">
          Guadalajara, México
        </Text>
      </group>

      {/* Frase final */}
      <Text
        position={[0, -0.5, 0.001]}
        fontSize={0.024}
        color="#8b7355"
        anchorX="center"
        anchorY="middle"
        fontStyle="italic"
      >
        "Convirtamos tu idea en realidad"
      </Text>
    </PergaminoBase>
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

  // Función para renderizar el contenido según el título del cuadro
  const renderContent = () => {
    if (showIntro) return null;

    switch (title) {
      case "Sobre Mí":
        return <SobreMiContent image={image} />;
      case "Proyectos":
        return <ProyectosContent image={image} />;
      case "Educación":
        return <EducacionContent image={image} />;
      case "Habilidades":
        return <HabilidadesContent image={image} />;
      case "Experiencia":
        return <ExperienciaContent image={image} />;
      case "Contacto":
        return <ContactoContent />;
      default:
        return null;
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

      {/* Passepartout - para todos los cuadros */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.1, 1.5, 0.02]} />
        <meshStandardMaterial
          color="#f5f5dc"
          roughness={0.9}
        />
      </mesh>

      {/* Área clickeable transparente para todos los cuadros */}
      <mesh position={[0, 0, 0.05]} onClick={handleClick}>
        <planeGeometry args={[2.1, 1.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Contenido del cuadro */}
      <Suspense fallback={null}>
        {renderContent()}
      </Suspense>

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
