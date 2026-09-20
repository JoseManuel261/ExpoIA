import Reveal from "@/components/Reveal";

interface BloqueAgenda {
  hora: string;
  categoria: string;
  titulo: string;
  descripcion: string;
}

// Agregar más bloques acá — la lista de la derecha se acomoda sola, no
// hay que tocar nada más abajo en el componente.
const AGENDA: BloqueAgenda[] = [
  {
    hora: "08:00",
    categoria: "Apertura",
    titulo: "El futuro empresarial se produce aquí",
    descripcion: "Bienvenida, contexto regional y retos de adopción de IA.",
  },
  {
    hora: "09:00",
    categoria: "Administrar",
    titulo: "Decidir mejor con datos e IA",
    descripcion: "Automatización administrativa, analítica y seguridad empresarial.",
  },
  {
    hora: "10:15",
    categoria: "Vender",
    titulo: "Crecimiento comercial inteligente",
    descripcion: "Marketing, ventas, CRM y experiencia del cliente con IA.",
  },
  {
    hora: "11:30",
    categoria: "Producir",
    titulo: "Productividad aplicada al territorio",
    descripcion: "Operaciones, logística y casos sectoriales de transformación.",
  },
  {
    hora: "12:30",
    categoria: "Exhibición",
    titulo: "AI Business Market",
    descripcion: "Demostraciones y conversaciones directas con proveedores.",
  },
  {
    hora: "14:00",
    categoria: "Negocios",
    titulo: "AI Business Match",
    descripcion: "Reuniones 1 a 1 entre empresas y soluciones pertinentes.",
  },
];

export default function AgendaSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 md:py-24">
        <div className="md:grid md:grid-cols-[1fr_1.5fr] md:gap-16">
          {/* --- Columna izquierda: título, se queda fija al hacer scroll en desktop --- */}
          <Reveal>
            <div className="md:sticky md:top-28 md:self-start">
              <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">
                AGENDA PRELIMINAR · 17 NOV
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.05] text-expoia-navy sm:text-4xl md:text-5xl">
                Conoce. Prueba.
                <br />
                Conecta. Negocia.
                <br />
                <span
                  className="bg-gradient-to-r from-expoia-magenta via-expoia-cyan to-expoia-magenta bg-[length:200%_100%] bg-clip-text text-transparent"
                  style={{ animation: "degradadoFlujo 4s linear infinite" }}
                >
                  Transforma.
                </span>
              </h2>
            </div>
          </Reveal>

          {/* --- Columna derecha: lista de bloques de agenda --- */}
          <div className="mt-10 divide-y divide-expoia-border md:mt-0">
            {AGENDA.map((bloque, i) => (
              <Reveal key={bloque.hora} delay={i * 0.06}>
                {/* "group" para que el hover sobre cualquier parte del
                    bloque controle el desplegado de la descripción */}
                <div className="group flex cursor-default gap-4 py-6 first:pt-0 sm:gap-6 sm:py-7">
                  <span className="w-16 shrink-0 pt-0.5 font-display text-sm font-semibold text-expoia-cyan">
                    {bloque.hora}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-expoia-magenta">
                      {bloque.categoria}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-expoia-navy">
                      {bloque.titulo}
                    </h3>
                    {/* Oculta por defecto (max-h-0), se despliega con el
                        mouse encima (group-hover) y se recoge al salir.
                        overflow-hidden + max-height animado en vez de
                        display:none para que la transición se vea suave. */}
                    <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
                      <p className="overflow-hidden text-sm text-expoia-gray-dark md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:mt-1.5 md:group-hover:opacity-100">
                        {bloque.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}