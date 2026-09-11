import HeroField from "@/components/HeroField";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-expoia-border">
      <HeroField />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">
            EXPOIA · 2026 · INTERNACIONAL
          </p>
          <h1
            className="mt-6 max-w-[16ch] font-display font-semibold leading-[1.05] text-expoia-navy"
            style={{ fontSize: "clamp(2.25rem, 4.5vw + 1rem, 3.75rem)" }}
          >
            Convierte tu próximo reto en una oportunidad rentable.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-expoia-gray-dark">
            En dos minutos descubre en qué punto está tu negocio frente a la
            inteligencia artificial. Sin vueltas: responde y regístrate abajo
            mismo.
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

        <div className="relative mx-auto h-[300px] w-[220px] md:h-[440px] md:w-[300px]">
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
    </section>
  );
}
