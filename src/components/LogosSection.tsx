import Image from "next/image";

const ALIADOS = [
  { src: "/logos/gobernacion-huila.png", alt: "Gobernación del Huila" },
  { src: "/logos/camara-comercio-huila.jpeg", alt: "Cámara de Comercio del Huila" },
  { src: "/logos/fet.png", alt: "Fundación Escuela Tecnológica de Neiva", featured: true },
  { src: "/logos/universidad-ean.jpeg", alt: "Universidad EAN" },
  { src: "/logos/comfamiliar-huila.jpeg", alt: "Comfamiliar Huila" },
];

export default function LogosSection() {
  return (
    <section className="border-b border-expoia-border bg-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <p className="mb-6 text-center text-sm text-expoia-gray-mid">
          Un evento respaldado por
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-5 sm:gap-x-12 sm:gap-y-6">
          {ALIADOS.map((aliado) => (
            <Image
              key={aliado.alt}
              src={aliado.src}
              alt={aliado.alt}
              width={160}
              height={60}
              className={`w-auto object-contain ${
                aliado.featured ? "h-12 sm:h-14 md:h-16" : "h-8 sm:h-10 md:h-12"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
