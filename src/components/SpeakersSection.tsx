import Reveal from "@/components/Reveal";
import SpeakerCard from "@/components/SpeakerCard";

export interface Speaker {
  nombre: string;
  cargo: string;
  empresa: string;
  descripcion: string;
  // Rutas dentro de /public. Opcionales: mientras no haya foto/logo reales,
  // la tarjeta usa un placeholder con las iniciales del nombre.
  foto?: string;
  logoEmpresa?: string;
}

// --- Agregar más speakers acá ---
// El grid y las tarjetas se acomodan solos, no hay que tocar nada más
// abajo. Cuando haya fotos/logos reales, solo agregar "foto" y
// "logoEmpresa" apuntando a un archivo en /public (ej: "/speakers/nombre.jpg").
export const SPEAKERS: Speaker[] = [
  {
    nombre: "María Fernanda Rojas",
    cargo: "Directora de Innovación",
    empresa: "Comfamiliar Huila",
    descripcion:
      "Lidera proyectos de transformación digital en el sector servicios del Huila desde hace más de 8 años.",
  },
  {
    nombre: "Camilo Andrés Perdomo",
    cargo: "CEO",
    empresa: "AgroTech Huila",
    descripcion:
      "Impulsa la adopción de IA en cadenas de café y cacao para pequeños y medianos productores de la región.",
  },
  {
    nombre: "Laura Valentina Cortés",
    cargo: "Consultora de IA aplicada",
    empresa: "EAN",
    descripcion:
      "Investigadora y docente enfocada en llevar modelos de IA a negocios tradicionales fuera de las grandes ciudades.",
  },
  {
    nombre: "Julián Esteban Muñoz",
    cargo: "Gerente Comercial",
    empresa: "Cámara de Comercio de Neiva",
    descripcion:
      "Acompaña a empresarios del Huila en procesos de digitalización y acceso a nuevas tecnologías.",
  },
];

export default function SpeakersSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <p className="font-display text-sm tracking-[0.2em] text-expoia-cyan">VOCES QUE CONECTAN EXPERIENCIA Y ACCIÓN</p>
          <h2 className="mt-3 max-w-[26ch] font-display text-3xl font-semibold text-expoia-navy md:text-4xl">
            Conferencistas y soluciones
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPEAKERS.map((speaker, i) => (
            <Reveal key={speaker.nombre} delay={i * 0.08}>
              <SpeakerCard speaker={speaker} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}