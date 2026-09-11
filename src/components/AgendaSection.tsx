import Reveal from "@/components/Reveal";

const AGENDA = [
  { hora: "8:00 a.m.", titulo: "Registro y bienvenida" },
  { hora: "9:00 a.m.", titulo: "Panel: IA aplicada a negocios regionales" },
  { hora: "11:00 a.m.", titulo: "Casos de éxito por sector" },
  { hora: "1:00 p.m.", titulo: "Almuerzo y networking" },
  { hora: "2:30 p.m.", titulo: "Rondas de conexión empresarial" },
  { hora: "4:30 p.m.", titulo: "Cierre y próximos pasos" },
];

export default function AgendaSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-expoia-navy md:text-4xl">Agenda del día</h2>
        </Reveal>
        <div className="mt-10 divide-y divide-expoia-border">
          {AGENDA.map((bloque, i) => (
            <Reveal key={bloque.hora} delay={i * 0.06}>
              <div className="flex gap-6 py-4">
                <span className="w-24 shrink-0 font-display text-sm font-semibold text-expoia-cyan">{bloque.hora}</span>
                <span className="text-expoia-navy">{bloque.titulo}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
