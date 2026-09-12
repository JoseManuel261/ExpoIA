"use client";

import dynamic from "next/dynamic";
import HeroField from "@/components/HeroField";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

interface ParticulaFlujo {
  id: number;
  size: number;
  colorHex: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  pathX: number[];
  pathY: number[];
}

// Ajusta estos tres valores a ojo hasta que el "empuje" se sienta bien.
const RADIO_REPULSION = 70; // px — qué tan cerca debe estar el mouse para empezar a empujar
const FUERZA_REPULSION = 100; // px — qué tanto se desplaza la partícula en el punto más cercano
const RETORNO = 0.12; // 0-1 — qué tan rápido vuelve la partícula a su lugar al alejar el mouse

const NubeDeFlujoDatos = () => {
  const [particulas, setParticulas] = useState<ParticulaFlujo[]>([]);

  // Contenedor decorativo completo: usamos su bounding box para convertir
  // la posición del mouse (coordenadas de pantalla) a las mismas coordenadas
  // relativas que usan startX/startY de cada partícula.
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Un <div> real por partícula, guardado aquí para poder mover su
  // transform directamente en cada frame sin pasar por React/estado.
  const dotsRef = useRef<Record<number, HTMLDivElement | null>>({});

  // Posición actual del mouse relativa al contenedor. null = fuera / sin datos.
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  // Offset actual (con inercia) de cada partícula, para que el retorno
  // a la posición original sea suave y no un salto brusco.
  const offsetsRef = useRef<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    const totalParticulas = 300;
    const generadas = Array.from({ length: totalParticulas }).map((_, i) => {
      const tipoRand = Math.random();
      let startX = 0,
        startY = 0;
      let pathX: number[] = [],
        pathY: number[] = [];

      const colorHex = Math.random() > 0.4 ? "#6ee7ff" : "#d314a7";
      const size = Math.random() * 3 + 1;
      const delay = Math.random() * 5;
      const duration = Math.random() * 2 + 2;

      const dispersionX = (Math.random() - 0.5) * 80;
      const dispersionY = (Math.random() - 0.5) * 80;

      if (tipoRand < 0.2) {
        startX = 120;
        startY = 480;
        pathX = [0, -60 + dispersionX * 0.5, -130 + dispersionX, -210 + dispersionX * 1.2];
        pathY = [0, 10 + dispersionY * 0.5, 30 + dispersionY, 50 + dispersionY * 1.2];
      } else if (tipoRand < 0.4) {
        startX = 110;
        startY = 410;
        pathX = [0, -50 + dispersionX * 0.4, -110 + dispersionX * 0.8, -190 + dispersionX];
        pathY = [0, -30 + dispersionY * 0.4, -70 + dispersionY * 0.8, -125 + dispersionY];
      } else if (tipoRand < 0.6) {
        startX = 170;
        startY = 240;
        pathX = [0, 20 + dispersionX * 0.4, 50 + dispersionX * 0.8, 85 + dispersionX];
        pathY = [0, -40 + dispersionY * 0.4, -90 + dispersionY * 0.8, -150 + dispersionY];
      } else if (tipoRand < 0.8) {
        startX = 170;
        startY = 550;
        pathX = [0, 60 + dispersionX * 0.4, 120 + dispersionX * 0.8, 180 + dispersionX];
        pathY = [0, 20 + dispersionY * 0.4, 45 + dispersionY * 0.8, 70 + dispersionY];
      } else {
        startX = 160;
        startY = 80;
        pathX = [0, dispersionX * 0.8, dispersionX * 1.5, dispersionX * 2.0];
        pathY = [0, -20 + dispersionY * 0.5, -50 + dispersionY, -90 + dispersionY * 1.5];
      }

      return { id: i, size, colorHex, delay, duration, startX, startY, pathX, pathY };
    });

    setParticulas(generadas);
  }, []);

  // Rastrea el mouse a nivel de ventana (así funciona sin importar qué capa
  // esté encima) y corre un loop de animación aparte para la repulsión.
  useEffect(() => {
    function manejarMouseMove(e: MouseEvent) {
      const rect = contenedorRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function manejarMouseLeaveVentana() {
      mouseRef.current = null;
    }

    window.addEventListener("mousemove", manejarMouseMove);
    window.addEventListener("mouseout", manejarMouseLeaveVentana);

    let animId: number;
    function loop() {
      const contenedor = contenedorRef.current;
      if (contenedor) {
        for (const idStr in dotsRef.current) {
          const id = Number(idStr);
          const el = dotsRef.current[id];
          if (!el) continue;

          const p = particulas[id];
          if (!p) continue;

          let objetivoX = 0;
          let objetivoY = 0;

          if (mouseRef.current) {
            const dx = p.startX - mouseRef.current.x;
            const dy = p.startY - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < RADIO_REPULSION) {
              const fuerza = (1 - dist / RADIO_REPULSION) * FUERZA_REPULSION;
              const nx = dx / (dist || 0.0001);
              const ny = dy / (dist || 0.0001);
              objetivoX = nx * fuerza;
              objetivoY = ny * fuerza;
            }
          }

          const actual = offsetsRef.current[id] ?? { x: 0, y: 0 };
          actual.x += (objetivoX - actual.x) * RETORNO;
          actual.y += (objetivoY - actual.y) * RETORNO;
          offsetsRef.current[id] = actual;

          el.style.transform = `translate(${actual.x.toFixed(2)}px, ${actual.y.toFixed(2)}px)`;
        }
      }
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", manejarMouseMove);
      window.removeEventListener("mouseout", manejarMouseLeaveVentana);
      cancelAnimationFrame(animId);
    };
  }, [particulas]);

  if (particulas.length === 0) return null;

  return (
    <div ref={contenedorRef} className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      {particulas.map((p) => (
        // Div externo: SOLO controla la animación de flujo (Framer), intacta.
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: p.startX, top: p.startY }}
          animate={{
            x: p.pathX,
            y: p.pathY,
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.3, 0.9, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {/* Div interno: SOLO controla la repulsión del mouse, vía transform
              actualizado a mano en el loop de arriba (no pasa por React). */}
          <div
            ref={(el) => {
              dotsRef.current[p.id] = el;
            }}
            className="rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.colorHex,
              boxShadow: `0 0 8px ${p.colorHex}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-expoia-border">
      <HeroField />

      <div className="pointer-events-none absolute -right-6 top-1/2 hidden h-[420px] w-[190px] -translate-y-1/2 opacity-90 sm:block md:right-[180px] md:h-[720px] md:w-[320px] md:opacity-100">
        {/* Halos de luz ambiental */}
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-[#6ee7ff] opacity-30 blur-3xl" />
        <div className="absolute right-0 bottom-10 h-64 w-64 rounded-full bg-[#d314a7] opacity-30 blur-3xl" />

        {/* Órbitas */}
        <div
          className="pointer-events-none absolute left-1/2 top-[48%] rounded-full"
          style={{
            width: "420px",
            height: "620px",
            border: "1px solid #0f8fd126",
            transform: "translate(-50%, -50%) rotate(-20deg)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[48%] rounded-full"
          style={{
            width: "420px",
            height: "620px",
            border: "1px solid #0f8fd126",
            transform: "translate(-50%, -50%) rotate(42deg)",
          }}
        />

        {/* CAPA SVG: Ramilletes de hilos ramificados */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 320 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradCyan" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6ee7ff" stopOpacity="0" />
              <stop offset="100%" stopColor="#6ee7ff" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="gradMagenta" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d314a7" stopOpacity="0" />
              <stop offset="100%" stopColor="#d314a7" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="gradMagentaBottom" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d314a7" stopOpacity="0" />
              <stop offset="100%" stopColor="#d314a7" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <path d="M 120 480 Q 20 490 -120 500" stroke="#6ee7ff" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" strokeDasharray="2 4" />
          <path d="M 130 500 Q 30 520 -100 530" stroke="#d314a7" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" strokeDasharray="2 4" />
          <path d="M 120 420 Q 20 380 -78 283" stroke="url(#gradCyan)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
          <path d="M 125 435 Q 35 400 -78 283" stroke="#6ee7ff" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 110 405 Q 10 350 -78 283" stroke="#6ee7ff" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 135 450 Q 50 420 -78 283" stroke="#6ee7ff" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M 170 250 Q 180 150 205 58" stroke="url(#gradMagenta)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
          <path d="M 145 400 Q 200 160 205 58" stroke="#d314a7" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 155 240 Q 165 130 205 58" stroke="#d314a7" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 195 300 Q 215 170 205 58" stroke="#d314a7" strokeWidth="0.8" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 170 550 Q 250 600 340 618" stroke="url(#gradMagentaBottom)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
          <path d="M 185 540 Q 265 590 340 618" stroke="#d314a7" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 155 565 Q 235 615 340 618" stroke="#d314a7" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 195 530 Q 280 580 340 618" stroke="#d314a7" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
        </svg>

        {/* Etiquetas */}
        <div className="pointer-events-none absolute -left-24 top-[38%] flex items-center gap-2 md:-left-21">
          <span className="h-1.5 w-1.5 rounded-full bg-expoia-cyan shadow-[0_0_8px_#6ee7ff]" />
          <span className="font-display text-xs tracking-[0.2em] text-expoia-gray-dark">EFICIENCIA</span>
        </div>
        <div className="pointer-events-none absolute -top-8 right-0 flex items-center gap-2 md:top-12 md:-right-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-expoia-magenta shadow-[0_0_8px_#d314a7]" />
          <span className="font-display text-xs tracking-[0.2em] text-expoia-gray-dark">RENTABILIDAD</span>
        </div>
        <div className="pointer-events-none absolute bottom-[15%] -right-6 flex items-center gap-2 md:-right-27 md:top-[86%]">
          <span className="h-1.5 w-1.5 rounded-full bg-expoia-magenta shadow-[0_0_8px_#d314a7]" />
          <span className="font-display text-xs tracking-[0.2em] text-expoia-gray-dark">DECISIÓN</span>
        </div>

        {/* Logo 3D (Este contenedor recupera pointer-events-auto para atrapar el mouse) */}
        <div className="pointer-events-auto relative z-10 h-full w-full">
          <HeroScene />
        </div>

        <NubeDeFlujoDatos />
      </div>

      {/* Contenido Principal */}
      <div className="relative z-30 mx-auto max-w-7xl px-6 pb-24 pt-16 md:pb-40 md:pt-24">
        <p className="font-display text-sm tracking-[0.3em] text-expoia-cyan">
          EXPOIA&nbsp;&nbsp;·&nbsp;&nbsp;2026&nbsp;&nbsp;·&nbsp;&nbsp;INTERNACIONAL
        </p>
        <h1
          className="mt-6 max-w-[18ch] font-display leading-[0.98] md:max-w-[15ch]"
          style={{ fontSize: "clamp(2.75rem, 7vw + 0.5rem, 5.5rem)" }}
        >
          <span className="font-normal text-expoia-gray-dark">Convierte tu próximo reto en</span>{" "}
          <span className="bg-gradient-to-r from-expoia-cyan to-expoia-magenta bg-clip-text font-semibold text-transparent">
            una oportunidad rentable.
          </span>
        </h1>
        <p className="mt-8 max-w-[38ch] text-lg text-expoia-gray-dark md:max-w-[30ch]">
          En dos minutos descubre en qué punto está tu negocio frente a la
          inteligencia artificial.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#test"
            className="rounded-full bg-expoia-magenta px-8 py-4 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy"
          >
            Hacer el diagnóstico
          </a>
          <a
            href="#registro"
            className="font-display text-sm font-semibold text-expoia-navy underline decoration-expoia-cyan decoration-2 underline-offset-4 transition-colors hover:text-expoia-cyan"
          >
            Registrar mi interés →
          </a>
        </div>
      </div>
    </section>
  );
}