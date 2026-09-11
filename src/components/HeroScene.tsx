"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Réplica en 3D del logo de EXPOIA: dos formas cristalinas alargadas
// (no esferas) con material de transmisión real (refracta y aberra el
// color, como vidrio), más un núcleo emisivo blanco en la base — el
// mismo destello central que tiene el arte original.
function NucleoOrganico() {
  return (
    <>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
        <group>
          <mesh scale={[0.65, 1.55, 0.65]} position={[0, 0.35, 0]}>
            <icosahedronGeometry args={[1, 10]} />
            <MeshTransmissionMaterial
              color="#149fd3"
              thickness={1.3}
              roughness={0.04}
              transmission={1}
              ior={1.3}
              chromaticAberration={0.45}
              distortion={0.35}
              distortionScale={0.3}
              temporalDistortion={0.15}
            />
          </mesh>
          <mesh
            scale={[0.5, 1.15, 0.5]}
            position={[0.2, -0.05, 0.15]}
            rotation={[0.25, 0.6, 0]}
          >
            <icosahedronGeometry args={[1, 10]} />
            <MeshTransmissionMaterial
              color="#d314a7"
              thickness={1.1}
              roughness={0.04}
              transmission={1}
              ior={1.4}
              chromaticAberration={0.55}
              distortion={0.45}
              distortionScale={0.35}
              temporalDistortion={0.2}
            />
          </mesh>
          <mesh position={[0, -0.7, 0.25]} scale={0.16}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
      </Float>

      <pointLight position={[-2, 1, 2]} intensity={4} color="#149fd3" />
      <pointLight position={[2, -1, 1.5]} intensity={4} color="#d314a7" />
      <pointLight position={[0, -0.7, 1]} intensity={8} color="#ffffff" distance={2.2} />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.15} />
      <Environment preset="city" />
      <NucleoOrganico />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.25} intensity={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
