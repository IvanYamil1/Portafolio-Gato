"use client";

export function Lights() {
  return (
    <>
      {/* Luz ambiental cálida y suave */}
      <ambientLight intensity={0.4} color="#ffeedd" />

      {/* Luz principal del pasillo - cálida y elegante */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.8}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Luz de relleno suave */}
      <directionalLight
        position={[0, 4, 15]}
        intensity={0.3}
        color="#fff5e6"
      />

      {/* Luces de techo tipo galería - cálidas y elegantes */}
      <pointLight position={[0, 4.5, -12]} intensity={20} color="#ffe4c4" distance={10} decay={2} />
      <pointLight position={[0, 4.5, -4]} intensity={20} color="#ffe4c4" distance={10} decay={2} />
      <pointLight position={[0, 4.5, 4]} intensity={20} color="#ffe4c4" distance={10} decay={2} />
      <pointLight position={[0, 4.5, 12]} intensity={20} color="#ffe4c4" distance={10} decay={2} />

      {/* Spotlights para cuadros - lado izquierdo */}
      <spotLight
        position={[-2, 3.8, -8]}
        angle={0.5}
        penumbra={0.8}
        intensity={40}
        color="#fff8f0"
        castShadow
      />
      <spotLight
        position={[-2, 3.8, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={40}
        color="#fff8f0"
        castShadow
      />
      <spotLight
        position={[-2, 3.8, 8]}
        angle={0.5}
        penumbra={0.8}
        intensity={40}
        color="#fff8f0"
        castShadow
      />

      {/* Spotlights para cuadros - lado derecho */}
      <spotLight
        position={[2, 3.8, -8]}
        angle={0.5}
        penumbra={0.8}
        intensity={40}
        color="#fff8f0"
        castShadow
      />
      <spotLight
        position={[2, 3.8, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={40}
        color="#fff8f0"
        castShadow
      />
      <spotLight
        position={[2, 3.8, 8]}
        angle={0.5}
        penumbra={0.8}
        intensity={40}
        color="#fff8f0"
        castShadow
      />

      {/* Luces de acento doradas en el piso */}
      <pointLight position={[-2.5, 0.3, -6]} intensity={3} color="#d4af37" distance={4} />
      <pointLight position={[2.5, 0.3, -6]} intensity={3} color="#d4af37" distance={4} />
      <pointLight position={[-2.5, 0.3, 2]} intensity={3} color="#d4af37" distance={4} />
      <pointLight position={[2.5, 0.3, 2]} intensity={3} color="#d4af37" distance={4} />
      <pointLight position={[-2.5, 0.3, 10]} intensity={3} color="#d4af37" distance={4} />
      <pointLight position={[2.5, 0.3, 10]} intensity={3} color="#d4af37" distance={4} />

      {/* Luz que sigue al jugador */}
      <pointLight position={[0, 2.5, 12]} intensity={8} color="#ffffff" distance={6} />
    </>
  );
}
