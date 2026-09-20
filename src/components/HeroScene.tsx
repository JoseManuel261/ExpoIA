"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ANCHO = 1.5;
const ALTO = ANCHO / (839 / 1875);

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uvDistorsionada = vUv + normalize(vUv - uMouse + 0.0001) * sin(distance(vUv, uMouse) * 30.0 - uTime * 2.5) * 0.03 * uHover;
    vec4 colorBase = texture2D(uTexture, uvDistorsionada);
    gl_FragColor = colorBase;
  }
`;

interface LogoProps {
  mousePos: React.MutableRefObject<THREE.Vector2>;
  isHovered: React.MutableRefObject<boolean>;
  reduceMotion: boolean;
}

function LogoInteractivo({ mousePos, isHovered, reduceMotion }: LogoProps) {
  const texture = useTexture("/hero-organic-hologram.png");
  const configuredTexture = useMemo(() => {
    const clonedTexture = texture.clone();
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    return clonedTexture;
  }, [texture]);

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentHover = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: configuredTexture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHover: { value: 0 },
    }),
    [configuredTexture]
  );

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;
    const matUniforms = materialRef.current.uniforms;

    matUniforms.uTime.value = state.clock.elapsedTime;
    if (reduceMotion) {
      matUniforms.uHover.value = 0;
      return;
    }

    // 1. Suavizado del mouse más lento y con inercia (0.06 en lugar de 0.15)
    const targetMouse = isHovered.current ? mousePos.current : new THREE.Vector2(0.5, 0.5);
    currentMouse.current.lerp(targetMouse, 0.06);
    matUniforms.uMouse.value.copy(currentMouse.current);

    // 2. Transición del efecto de agua más pausada al entrar/salir (0.04 en lugar de 0.08)
    const targetHover = isHovered.current ? 1 : 0.3;
    currentHover.current = THREE.MathUtils.lerp(currentHover.current, targetHover, 0.04);
    matUniforms.uHover.value = currentHover.current;

    // 3. Rotación 3D con un retraso flotante y orgánico muy suave
    const rotX = (currentMouse.current.y - 0.5) * 0.45;
    const rotY = (currentMouse.current.x - 0.5) * 0.55;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -rotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotY, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[ANCHO * 0.75, ALTO * 0.75, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function HeroScene() {
  const mousePos = useRef(new THREE.Vector2(0.5, 0.5));
  const isHovered = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    mousePos.current.set(x, y);
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  return (
    <div 
      className="relative h-full w-full cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
      >
        <Suspense fallback={null}>
          <LogoInteractivo mousePos={mousePos} isHovered={isHovered} reduceMotion={reduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}