"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Hero() {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 14,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 14,
  });

  function manejarMovimiento(e: React.MouseEvent<HTMLDivElement>) {
    const rect = contenedorRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetear() {
    x.set(0);
    y.set(0);
  }

  return (
    <section className="relative overflow-hidden border-b border-expoia-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">
            EXPOIA · 2026 · INTERNACIONAL
          </p>
          <h1 className="mt-6 max-w-[16ch] font-display text-4xl font-semibold leading-[1.05] text-expoia-navy md:text-6xl">
            Convierte tu próximo reto en una oportunidad rentable.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-expoia-gray-dark">
            En menos de dos minutos, descubre en qué punto está tu negocio
            frente a la inteligencia artificial y regístrate para conectar
            con soluciones reales en EXPOIA 2026.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#test"
              className="rounded-full bg-expoia-magenta px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy"
            >
              Hacer el diagnóstico
            </a>
            <a
              href="#registro"
              className="rounded-full border border-expoia-navy/20 px-7 py-3.5 font-display text-sm font-semibold text-expoia-navy transition-colors hover:border-expoia-navy"
            >
              Registrar mi interés
            </a>
          </div>
        </div>

        {/* El holograma responde al puntero como si flotara en el aire, y el
            núcleo magenta "respira" con un brillo pulsante — el movimiento
            está ligado a lo que la imagen ya representa (energía viva),
            no es una animación decorativa genérica. */}
        <div
          ref={contenedorRef}
          onMouseMove={manejarMovimiento}
          onMouseLeave={resetear}
          className="relative mx-auto h-[380px] w-[260px] [perspective:900px] md:h-[520px] md:w-[360px]"
        >
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-expoia-magenta/40 blur-3xl motion-reduce:hidden"
            animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Image
              src="/hero-organic-hologram.png"
              alt=""
              width={720}
              height={1220}
              priority
              className="h-auto w-full drop-shadow-[0_30px_60px_rgba(18,38,54,0.25)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
