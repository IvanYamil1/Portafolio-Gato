"use client";

interface LightsProps {
  isMobile?: boolean;
}

export function Lights({ isMobile = false }: LightsProps) {
  // En móvil: menos luces, sin sombras, más luz ambiental
  if (isMobile) {
    return (
      <>
        {/* Luz ambiental más intensa para compensar la falta de otras luces */}
        <ambientLight intensity={1.2} color="#ffeedd" />

        {/* Solo una luz direccional simple sin sombras */}
        <directionalLight
          position={[0, 8, 0]}
          intensity={1.5}
          color="#fff8f0"
        />

        {/* Una sola luz de techo central */}
        <pointLight position={[0, 4.5, 0]} intensity={20} color="#ffe4c4" distance={20} decay={2} />
      </>
    );
  }

  // Desktop: iluminación completa
  return (
    <>
      {/* Luz ambiental - más intensa para compensar menos luces */}
      <ambientLight intensity={0.6} color="#ffeedd" />

      {/* Luz principal del pasillo - única con sombras */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={1.2}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Luces de techo - reducidas a 2 */}
      <pointLight position={[0, 4.5, -8]} intensity={25} color="#ffe4c4" distance={15} decay={2} />
      <pointLight position={[0, 4.5, 6]} intensity={25} color="#ffe4c4" distance={15} decay={2} />

      {/* Spotlights para cuadros - solo 2, sin sombras */}
      <spotLight
        position={[-2, 3.8, -2]}
        angle={0.6}
        penumbra={0.9}
        intensity={50}
        color="#fff8f0"
        target-position={[-3.5, 1.5, -2]}
      />
      <spotLight
        position={[2, 3.8, -2]}
        angle={0.6}
        penumbra={0.9}
        intensity={50}
        color="#fff8f0"
        target-position={[3.5, 1.5, -2]}
      />

      {/* Luces de acento doradas - reducidas a 2 */}
      <pointLight position={[-2.5, 0.3, 0]} intensity={4} color="#d4af37" distance={8} />
      <pointLight position={[2.5, 0.3, 0]} intensity={4} color="#d4af37" distance={8} />
    </>
  );
}
