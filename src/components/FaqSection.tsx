import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

interface PreguntaFrecuente {
  pregunta: string;
  // Cada respuesta puede tener varios párrafos — se renderizan como
  // <p> separados en vez de meter todo en un solo bloque de texto.
  respuesta: ReactNode[];
}

const PREGUNTAS_FRECUENTES: PreguntaFrecuente[] = [
  {
    pregunta: "¿Qué es ExpoIA Internacional 2026?",
    respuesta: [
      "ExpoIA Internacional 2026 es un espacio de encuentro entre empresarios, expertos, instituciones, emprendedores y comunidad académica alrededor de la inteligencia artificial y su aplicación en los negocios.",
    ],
  },
  {
    pregunta: "¿Qué actividades habrá en el evento?",
    respuesta: [
      "ExpoIA integrará diferentes experiencias durante la jornada: conferencias con expertos, feria empresarial y tecnológica, demostraciones de soluciones, talleres especializados, espacios de relacionamiento y rueda de negocios.",
      "La programación permitirá que cada participante organice su recorrido de acuerdo con sus intereses y pueda combinar conocimiento, experimentación, contactos y oportunidades empresariales.",
    ],
  },
  {
    pregunta: "¿El ingreso a ExpoIA tiene algún costo y cómo puedo registrarme?",
    respuesta: [
      <>
        El ingreso al evento será totalmente gratis para los asistentes:
        empresarios, estudiantes, profesionales y comunidad en general. Para
        asistir, debes realizar un registro previo en la página web del
        evento:{" "}
        <a
          href="https://www.expoia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-expoia-cyan underline decoration-expoia-cyan/40 underline-offset-2 hover:text-expoia-navy"
        >
          www.expoia.com
        </a>
        .
      </>,
    ],
  },
  {
    pregunta:
      "¿Quiénes pueden participar? ¿Necesito tener conocimientos de inteligencia artificial?",
    respuesta: [
      "ExpoIA está dirigido a empresarios, directivos, emprendedores, profesionales, estudiantes y personas interesadas en conocer las oportunidades que ofrece la inteligencia artificial.",
      "No necesitas ser experto en IA. El evento está diseñado tanto para quienes están dando sus primeros pasos como para organizaciones que ya vienen implementando herramientas o soluciones y desean avanzar hacia niveles superiores de adopción.",
    ],
  },
  {
    pregunta: "Soy empresario. ¿Cómo puedo aprovechar ExpoIA para mi empresa?",
    respuesta: [
      "ExpoIA está pensado especialmente para acercar la inteligencia artificial a las necesidades reales de las organizaciones.",
      "Los empresarios podrán identificar oportunidades de aplicación de IA, conocer proveedores y soluciones, participar en talleres, establecer contactos, interactuar con expertos y explorar oportunidades comerciales y de colaboración.",
      "Además, podrán realizar un autodiagnóstico inicial de madurez en inteligencia artificial y conocer la ruta para acceder posteriormente al diagnóstico empresarial integral y a los servicios del Nodo Regional de Inteligencia Artificial Aplicada a los Negocios.",
    ],
  },
  {
    pregunta:
      "¿Cómo puede participar un empresario proveedor de inteligencia artificial?",
    respuesta: [
      "Los empresarios proveedores de inteligencia artificial pueden participar ofreciendo sus servicios en la feria comercial, realizando un taller o una demostración en un espacio alterno del evento y participando en la rueda de negocios.",
      <>
        La participación como empresa proveedora de inteligencia artificial
        requiere una inscripción por la página web y tiene un costo. Para
        conocer los valores, las condiciones de participación y el proceso
        de inscripción, puedes solicitar información al correo electrónico{" "}
        <a
          href="mailto:expoia@fet.edu.co"
          className="text-expoia-cyan underline decoration-expoia-cyan/40 underline-offset-2 hover:text-expoia-navy"
        >
          expoia@fet.edu.co
        </a>{" "}
        o al contacto{" "}
        <a
          href="tel:+573166229477"
          className="text-expoia-cyan underline decoration-expoia-cyan/40 underline-offset-2 hover:text-expoia-navy"
        >
          316 622 9477
        </a>
        .
      </>,
    ],
  },
];

export default function FaqSection() {
  return (
    <section className="border-b border-expoia-border bg-expoia-bg">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20 md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-expoia-navy md:text-4xl">Preguntas frecuentes</h2>
        </Reveal>
        <div className="mt-8 divide-y divide-expoia-border border-y border-expoia-border">
          {PREGUNTAS_FRECUENTES.map((item, i) => (
            <Reveal key={item.pregunta} delay={i * 0.07}>
              <details className="group py-4 sm:py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-expoia-navy">
                  {item.pregunta}
                  <span className="ml-4 shrink-0 text-expoia-cyan transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3 max-w-[60ch] space-y-3 text-expoia-gray-dark">
                  {item.respuesta.map((parrafo, j) => (
                    <p key={j}>{parrafo}</p>
                  ))}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}