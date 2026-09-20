import Reveal from "@/components/Reveal";

const PREGUNTAS_FRECUENTES = [
  { pregunta: "¿Tiene algún costo participar?", respuesta: "El registro de interés no tiene costo. Los detalles de inscripción oficial se confirman cuando se habilite el registro final." },
  { pregunta: "¿Necesito saber de tecnología para asistir?", respuesta: "No. EXPOIA está pensado para dueños y líderes de negocio, no para perfiles técnicos." },
  { pregunta: "¿El resultado del test queda guardado?", respuesta: "Solo si decides registrarte después de hacerlo. El test en sí no envía nada a ningún servidor mientras lo respondes." },
  { pregunta: "¿Puedo inscribir a más de una persona de mi empresa?", respuesta: "Sí, cada persona interesada puede completar su propio registro." },
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
                <summary className="flex cursor-pointer list-none items-center justify-between font-display font-semibold text-expoia-navy">
                  {item.pregunta}
                  <span className="ml-4 text-expoia-cyan transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[60ch] text-expoia-gray-dark">{item.respuesta}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
