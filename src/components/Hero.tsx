"use client";

import dynamic from "next/dynamic";
import HeroField from "@/components/HeroField";
import ParticleCanvas from "@/components/ParticleCanvas";
import { useRef } from "react";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  // Referencia a la cajita del logo: se la pasamos a ParticleCanvas para
  // que sepa dónde "nacen" las partículas dentro del canvas, que ahora
  // cubre toda la sección en vez de solo esta cajita pequeña.
  const logoBoxRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative overflow-hidden border-b border-expoia-border">
      <HeroField />

      <div
        ref={logoBoxRef}
        className="pointer-events-none absolute left-[calc(50%+70px)] top-131.25 z-10 h-82.5 w-56.25 -translate-x-1/2 -translate-y-1/2 opacity-90 sm:left-auto sm:-right-6 sm:top-1/2 sm:h-105 sm:w-47.5 sm:translate-x-0 md:right-45 md:h-180 md:w-80 md:opacity-100"
      >
        {/* Halos de luz ambiental */}
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-[#6ee7ff] opacity-30 blur-3xl" />
        <div className="absolute right-0 bottom-10 h-64 w-64 rounded-full bg-expoia-magenta opacity-30 blur-3xl" />

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
        <div className="pointer-events-none absolute -left-10 top-[58%] flex items-center gap-1 md:-left-21 md:top-[38%] md:gap-2">
          <span className="h-1 w-1 rounded-full bg-expoia-cyan shadow-[0_0_8px_#6ee7ff] md:h-1.5 md:w-1.5" />
          <span className="font-display text-[8px] tracking-[0.14em] text-expoia-gray-dark md:text-xs md:tracking-[0.2em]">EFICIENCIA</span>
        </div>
        <div className="pointer-events-none absolute -left-14 top-[29%] flex items-center gap-1 md:left-auto md:top-12 md:-right-1.5 md:gap-2">
          <span className="h-1 w-1 rounded-full bg-expoia-magenta shadow-[0_0_8px_#d314a7] md:h-1.5 md:w-1.5" />
          <span className="font-display text-[8px] tracking-[0.14em] text-expoia-gray-dark md:text-xs md:tracking-[0.2em]">RENTABILIDAD</span>
        </div>
        <div className="pointer-events-none absolute bottom-[-2%] left-1/2 flex -translate-x-1/2 items-center gap-1 md:bottom-auto md:left-auto md:-right-6.75 md:top-[86%] md:translate-x-0 md:gap-2">
          <span className="h-1 w-1 rounded-full bg-expoia-magenta shadow-[0_0_8px_#d314a7] md:h-1.5 md:w-1.5" />
          <span className="font-display text-[8px] tracking-[0.14em] text-expoia-gray-dark md:text-xs md:tracking-[0.2em]">DECISIÓN</span>
        </div>

        {/* Logo 3D (Este contenedor recupera pointer-events-auto para atrapar el mouse) */}
        <div className="pointer-events-auto relative z-10 h-full w-full">
          <HeroScene />
        </div>
      </div>

      {/* Partículas: ahora viven a nivel de toda la sección, no solo de la
          cajita del logo, así tienen mucho más espacio para alejarse antes
          de toparse con el overflow-hidden de la sección. */}
      <ParticleCanvas origenRef={logoBoxRef} />

      {/* Contenido Principal */}
      <div className="relative z-30 mx-auto max-w-7xl px-5 pb-72 pt-12 sm:px-6 sm:pb-24 sm:pt-16 md:pb-40 md:pt-24">
        <p className="font-display text-sm tracking-[0.3em] text-expoia-cyan">
          EXPOIA&nbsp;&nbsp;·&nbsp;&nbsp;2026&nbsp;&nbsp;·&nbsp;&nbsp;INTERNACIONAL
        </p>
        <h1
          className="mt-6 max-w-[18ch] font-display leading-[0.98] md:max-w-[15ch]"
          style={{ fontSize: "clamp(2.2rem, 6.5vw + 0.5rem, 5.5rem)" }}
        >
          <span className="font-normal text-expoia-gray-dark">Convierte tu próximo reto en</span>{" "}
          <span className="bg-linear-to-r from-expoia-cyan to-expoia-magenta bg-clip-text font-semibold text-transparent">
            una oportunidad rentable.
          </span>
        </h1>
        <p className="mt-8 max-w-[38ch] text-lg text-expoia-gray-dark md:max-w-[30ch]">
          En dos minutos descubre en qué punto está tu negocio frente a la
          inteligencia artificial.
        </p>
        <div className="mt-12 flex flex-col items-start gap-2 sm:mt-10 sm:flex-row sm:items-center sm:gap-x-8">
          <a
            href="#test"
            className="rounded-full bg-expoia-magenta px-8 py-4 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy"
          >
            Hacer el diagnóstico
          </a>
          <a
            href="#registro"
            className="ml-2 font-display text-sm font-semibold text-expoia-navy underline decoration-expoia-cyan decoration-2 underline-offset-4 transition-colors hover:text-expoia-cyan sm:ml-0"
          >
            Registrar mi interés →
          </a>
        </div>
      </div>
    </section>
  );
}