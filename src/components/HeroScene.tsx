"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Proporción real del PNG (839 x 1875), para no deformar el logo.
const ANCHO = 1.5;
const ALTO = ANCHO / (839 / 1875);

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// El logo se distorsiona como líquido alrededor del punto donde está el
// cursor (o el dedo, en táctil) — no es un efecto decorativo genérico,
// es el logo REAL reaccionando a la persona que lo mira. uHover baja a
// 0 solo y suave cuando nadie interactúa, así el logo descansa quieto.
const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    float onda = sin(dist * 45.0 - uTime * 3.5) * 0.03;
    float caida = smoothstep(0.5, 0.0, dist);
    vec2 direccion = normalize(uv - uMouse + 0.0001);
    vec2 uvDistorsionada = uv + direccion * onda * caida * uHover;

    vec4 color = texture2D(uTexture, uvDistorsionada);
    gl_FragColor = color;
  }
`;

function LogoInteractivo() {
  const texture = useTexture("/hero-organic-hologram.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseObjetivo = useRef(new THREE.Vector2(0.5, 0.5));
  const hoverObjetivo = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHover: { value: 0 },
    }),
    [texture]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    // Suavizado: la distorsión persigue al cursor con inercia, y se
    // apaga sola con la misma suavidad cuando nadie interactúa.
    uniforms.uMouse.value.lerp(mouseObjetivo.current, 0.15);
    uniforms.uHover.value = THREE.MathUtils.lerp(
      uniforms.uHover.value,
      hoverObjetivo.current,
      0.06
    );
  });

  function moverPuntero(e: { uv?: THREE.Vector2 }) {
    if (!e.uv) return;
    mouseObjetivo.current.set(e.uv.x, e.uv.y);
    hoverObjetivo.current = 1;
  }

  function salir() {
    hoverObjetivo.current = 0;
  }

  return (
    <mesh onPointerMove={moverPuntero} onPointerLeave={salir}>
      <planeGeometry args={[ANCHO, ALTO, 64, 64]} />
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
  return (
    <Canvas
      camera={{ position: [0, 0, 2.4], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
    >
      <LogoInteractivo />
    </Canvas>
  );
}
