import Reveal from "@/components/Reveal";

const SECTORES = ["Café", "Cacao", "Piscicultura", "Turismo", "Agroindustria", "Comercio", "Construcción"];

export default function SectoresSection() {
  return (
    <section className="border-b border-expoia-border bg-expoia-bg">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <Reveal>
          <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">PENSADO PARA EL HUILA</p>
          <h2 className="mt-3 max-w-[26ch] font-display text-2xl font-semibold text-expoia-navy md:text-3xl">
            Casos aplicados a los sectores que mueven la región.
          </h2>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
          {SECTORES.map((sector, i) => (
            <Reveal key={sector} delay={i * 0.05} className="inline-block">
              <span className="rounded-full border border-expoia-border bg-white px-4 py-2 text-sm font-medium text-expoia-navy sm:px-5">
                {sector}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
