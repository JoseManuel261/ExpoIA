import Image from "next/image";

const ALIADOS = [
  { src: "/logos/gobernacion-huila.jpeg", alt: "Gobernación del Huila" },
  { src: "/logos/camara-comercio-huila.jpeg", alt: "Cámara de Comercio del Huila" },
  { src: "/logos/universidad-ean.jpeg", alt: "Universidad EAN" },
  { src: "/logos/comfamiliar-huila.jpeg", alt: "Comfamiliar Huila" },
];

export default function LogosSection() {
  return (
    <section className="border-b border-expoia-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="mb-6 text-center text-sm text-expoia-gray-mid">
          Un evento respaldado por
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {ALIADOS.map((aliado) => (
            <Image
              key={aliado.alt}
              src={aliado.src}
              alt={aliado.alt}
              width={160}
              height={60}
              className="h-10 w-auto object-contain grayscale transition-[filter] hover:grayscale-0 md:h-12"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
