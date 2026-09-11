"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function NucleoOrganico() {
  const grupoRef = useRef<THREE.Group>(null);

  // Suavizado real con lerp: la forma persigue al puntero con inercia,
  // no salta a la posición exacta del mouse (eso es lo que se sentía
  // mecánico en el intento anterior con CSS + spring).
  useFrame((state) => {
    if (!grupoRef.current) return;
    const objetivoX = state.pointer.y * 0.3;
    const objetivoZ = state.pointer.x * 0.35;

    grupoRef.current.rotation.y += 0.0025;
    grupoRef.current.rotation.x = THREE.MathUtils.lerp(
      grupoRef.current.rotation.x,
      objetivoX,
      0.02
    );
    grupoRef.current.rotation.z = THREE.MathUtils.lerp(
      grupoRef.current.rotation.z,
      objetivoZ,
      0.02
    );
  });

  return (
    <group ref={grupoRef}>
      <mesh scale={1.4}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#149fd3"
          distort={0.45}
          speed={1.6}
          roughness={0.15}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh scale={0.95} rotation={[0.6, 0.3, 0]}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#d314a7"
          distort={0.6}
          speed={2.1}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={4} color="#ffffff" distance={3} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 3]} intensity={0.6} color="#ffffff" />
      <NucleoOrganico />
    </Canvas>
  );
}
