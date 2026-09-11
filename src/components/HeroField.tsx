"use client";

import { motion } from "framer-motion";

// Tres masas de luz independientes, cada una con su propia trayectoria y
// duración. Al superponerse con mix-blend-mode se funden como luz real,
// no como formas que se repiten en sincronía (eso es lo que delata una
// animación "de plantilla").
const CAPAS = [
  {
    color: "#149fd3",
    size: 260,
    duration: 13,
    path: [
      { x: -40, y: -20 },
      { x: 30, y: 10 },
      { x: -10, y: 50 },
      { x: -40, y: -20 },
    ],
  },
  {
    color: "#d314a7",
    size: 220,
    duration: 17,
    path: [
      { x: 30, y: 30 },
      { x: -20, y: -10 },
      { x: 10, y: -40 },
      { x: 30, y: 30 },
    ],
  },
  {
    color: "#6ee7ff",
    size: 160,
    duration: 9,
    path: [
      { x: 0, y: 0 },
      { x: 20, y: -30 },
      { x: -30, y: 10 },
      { x: 0, y: 0 },
    ],
  },
];

export default function HeroField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      style={{ mixBlendMode: "normal" }}
    >
      <div className="absolute inset-0" style={{ mixBlendMode: "plus-lighter" }}>
        {CAPAS.map((capa, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full blur-3xl"
            style={{
              width: capa.size,
              height: capa.size,
              background: capa.color,
              opacity: 0.55,
            }}
            animate={{
              x: capa.path.map((p) => p.x),
              y: capa.path.map((p) => p.y),
            }}
            transition={{
              duration: capa.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
