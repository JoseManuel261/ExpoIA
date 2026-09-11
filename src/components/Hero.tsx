import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-expoia-border">
      {/* La pieza 3D vive detrás de todo, grande y descentrada — se sale
          del viewport a propósito en vez de quedar encerrada en una
          columna simétrica. Rompe el molde "texto | gráfico". */}
      <div className="pointer-events-none absolute -right-6 top-1/2 h-[420px] w-[190px] -translate-y-1/2 opacity-90 md:right-10 md:h-[720px] md:w-[320px] md:opacity-100">
        <div className="pointer-events-auto h-full w-full">
          <HeroScene />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 md:pb-40 md:pt-24">
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
