"use client";

import { useState } from "react";
import Image from "next/image";
import type { Speaker } from "@/components/SpeakersSection";

function InicialesSpeaker({ nombre }: { nombre: string }) {
  const iniciales = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-expoia-cyan to-expoia-magenta">
      <span className="font-display text-4xl font-semibold text-white">{iniciales}</span>
    </div>
  );
}

export default function SpeakerCard({ speaker }: { speaker: Speaker }) {
  // Una sola fuente de verdad para "está volteada". En mouse, entrar/salir
  // la voltea (hover); en touch (donde no existe hover real) el click la
  // deja fija volteada hasta tocar de nuevo. Así funciona bien en los dos casos
  // sin mezclar transform de CSS-hover con transform de estado (que podían
  // pisarse entre sí).
  const [volteada, setVolteada] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setVolteada(true)}
      onMouseLeave={() => setVolteada(false)}
      onClick={() => setVolteada((v) => !v)}
      aria-pressed={volteada}
      aria-label={`${speaker.nombre}, ${speaker.cargo} en ${speaker.empresa}. Toca para ver su descripción.`}
      className="block aspect-[3/4] w-full cursor-pointer text-left [perspective:1200px]"
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
          volteada ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* --- Frente: foto + nombre --- */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-expoia-border [backface-visibility:hidden]">
          {speaker.foto ? (
            <Image
              src={speaker.foto}
              alt={speaker.nombre}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <InicialesSpeaker nombre={speaker.nombre} />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-base font-semibold text-white">{speaker.nombre}</h3>
            <p className="text-sm text-white/80">
              {speaker.cargo} · {speaker.empresa}
            </p>
          </div>
        </div>

        {/* --- Reverso: descripción + logo de la empresa abajo --- */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-expoia-border bg-expoia-navy p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <h3 className="font-display text-base font-semibold text-white">{speaker.nombre}</h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-expoia-cyan">
              {speaker.cargo}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{speaker.descripcion}</p>
          </div>

          {/* Logo de la empresa en la esquina inferior. Si todavía no hay
              archivo de logo, se muestra el nombre de la empresa como
              placeholder en vez de romper el layout. */}
          <div className="flex justify-end">
            {speaker.logoEmpresa ? (
              <div className="relative h-6 w-24">
                <Image
                  src={speaker.logoEmpresa}
                  alt={speaker.empresa}
                  fill
                  className="object-contain object-right"
                />
              </div>
            ) : (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                {speaker.empresa}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}