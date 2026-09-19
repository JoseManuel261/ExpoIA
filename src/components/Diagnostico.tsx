"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PREGUNTAS, Opcion, ResultadoTest } from "@/lib/testData";

interface DiagnosticoProps {
  // El progreso/resultado ya NO vive dentro de este componente — lo dueña
  // page.tsx y lo pasa por props. Así, aunque Diagnostico se renderice dos
  // veces en la página (arriba y cerca del final), las dos instancias
  // muestran exactamente el mismo estado en vez de cada una llevar su
  // propio progreso por separado (que era el bug: respondías arriba y
  // abajo seguía en cero, o terminabas con dos resultados distintos).
  paso: number;
  resultado: ResultadoTest | null;
  onElegir: (opcion: Opcion) => void;
  onReiniciar: () => void;
}

// Anillo circular de progreso: se llena hasta el % del resultado, con un
// degradado cian→magenta (los colores de marca) en vez de un color plano.
// stroke-dashoffset animado con framer-motion (ya usado en el resto del
// archivo) para que se vea "llenar" en vez de aparecer de golpe.
function AnilloResultado({ porcentaje, etiqueta }: { porcentaje: number; etiqueta: string }) {
  const radio = 80;
  const circunferencia = 2 * Math.PI * radio;
  const offsetFinal = circunferencia * (1 - Math.min(Math.max(porcentaje, 0), 100) / 100);

  return (
    <div className="relative h-52 w-52 shrink-0">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="anilloResultadoGradiente" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#149fd3" />
            <stop offset="100%" stopColor="#d314a7" />
          </linearGradient>
        </defs>
        {/* Pista de fondo (el círculo completo, sin llenar) */}
        <circle cx="100" cy="100" r={radio} fill="none" stroke="#e0e5ea" strokeWidth="14" />
        {/* Progreso: arranca vacío y se anima hasta el % real */}
        <motion.circle
          cx="100"
          cy="100"
          r={radio}
          fill="none"
          stroke="url(#anilloResultadoGradiente)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          initial={{ strokeDashoffset: circunferencia }}
          animate={{ strokeDashoffset: offsetFinal }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="font-display text-4xl font-bold text-expoia-navy">{porcentaje}%</span>
        <span className="mt-1 text-xs font-medium uppercase tracking-wide text-expoia-gray-mid">
          {etiqueta}
        </span>
      </div>
    </div>
  );
}

export default function Diagnostico({ paso, resultado, onElegir, onReiniciar }: DiagnosticoProps) {
  const pregunta = PREGUNTAS[paso];

  return (
    <section id="test" className="border-b border-expoia-border bg-expoia-navy">
      <div className="mx-auto max-w-3xl px-6 py-20 text-white md:py-28">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          ¿Qué tan lista está tu empresa para la IA?
        </h2>
        <p className="mt-3 text-white/70">
          5 preguntas, sin vueltas. El resultado se calcula al instante con
          tus respuestas — no depende de ningún análisis externo.
        </p>

        <div className="mt-10 rounded-2xl bg-white p-6 text-expoia-navy md:p-10">
          <AnimatePresence mode="wait">
            {!resultado ? (
              <motion.div
                key={pregunta.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6 flex items-center gap-2">
                  {PREGUNTAS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= paso ? "bg-expoia-magenta" : "bg-expoia-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-1 text-sm text-expoia-gray-mid">
                  Pregunta {paso + 1} de {PREGUNTAS.length}
                </p>
                <h3 className="font-display text-xl font-semibold md:text-2xl">
                  {pregunta.texto}
                </h3>
                <div className="mt-6 grid gap-3">
                  {pregunta.opciones.map((opcion) => (
                    <button
                      key={opcion.texto}
                      onClick={() => onElegir(opcion)}
                      className="rounded-xl border border-expoia-border px-5 py-4 text-left transition-colors hover:border-expoia-cyan hover:bg-expoia-bg"
                    >
                      {opcion.texto}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 sm:flex-row sm:items-start"
              >
                <AnilloResultado porcentaje={resultado.porcentaje} etiqueta={resultado.etiqueta} />

                <div className="text-center sm:text-left">
                  <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">
                    TU RESULTADO
                  </p>
                  <p className="mt-4 max-w-[55ch] text-expoia-gray-dark">
                    {resultado.mensaje}
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4 sm:justify-start">
                    <a
                      href="#registro"
                      className="rounded-full bg-expoia-magenta px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:bg-expoia-navy"
                    >
                      Quiero registrarme con este resultado
                    </a>
                    <button
                      onClick={onReiniciar}
                      className="rounded-full border border-expoia-border px-7 py-3.5 font-display text-sm font-semibold text-expoia-gray-dark transition-colors hover:border-expoia-navy"
                    >
                      Volver a hacerlo
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}