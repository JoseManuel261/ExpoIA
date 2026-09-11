import Image from "next/image";

export default function Hero() {
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

        {/* La forma orgánica se deja "viva" con una rotación lenta y continua:
            es literalmente el elemento central del sistema visual de la marca,
            así que el movimiento aquí tiene un propósito, no es decoración suelta. */}
        <div className="relative mx-auto h-[380px] w-[260px] md:h-[520px] md:w-[360px]">
          <div className="animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
            <Image
              src="/hero-organic-hologram.png"
              alt=""
              width={720}
              height={1220}
              priority
              className="h-auto w-full drop-shadow-[0_30px_60px_rgba(18,38,54,0.25)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
