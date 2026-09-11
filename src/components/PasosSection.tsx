const PASOS = [
  {
    titulo: "Diagnostica",
    texto: "Responde el test y descubre en qué punto está tu negocio.",
  },
  {
    titulo: "Conecta",
    texto: "Regístrate y te ponemos frente a soluciones reales para tu reto.",
  },
  {
    titulo: "Explora",
    texto: "En EXPOIA 2026 ves de cerca casos aplicados a tu sector.",
  },
  {
    titulo: "Transforma",
    texto: "Sales con un camino claro, no solo con ideas sueltas.",
  },
];

export default function PasosSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="max-w-[20ch] font-display text-3xl font-semibold text-expoia-navy md:text-4xl">
          De retos a resultados.
        </h2>

        <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* Línea que conecta los pasos, con el degradé de marca (cian a magenta) */}
          <div
            aria-hidden
            className="absolute top-4 hidden h-px w-full bg-gradient-to-r from-expoia-cyan via-expoia-cyan/40 to-expoia-magenta md:block"
          />
          {PASOS.map((paso, i) => (
            <div key={paso.titulo} className="relative">
              <div className="relative z-10 h-2.5 w-2.5 rounded-full bg-expoia-magenta md:mb-6" />
              <h3 className="mt-4 font-display text-lg font-semibold text-expoia-navy md:mt-0">
                {i + 1}. {paso.titulo}
              </h3>
              <p className="mt-2 max-w-[32ch] text-sm text-expoia-gray-dark">
                {paso.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
