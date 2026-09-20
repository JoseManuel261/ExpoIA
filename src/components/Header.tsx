import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-expoia-border bg-expoia-bg/90 backdrop-blur">
      <div className="relative mx-auto grid min-h-[56px] max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
        <nav className="hidden gap-8 text-sm font-medium text-expoia-navy md:flex">
          <a href="#test" className="hover:text-expoia-cyan">Diagnóstico</a>
          <a href="#registro" className="hover:text-expoia-cyan">Registro</a>
          <a href="#agenda" className="hover:text-expoia-cyan">Agenda</a>
        </nav>

        <Image
          src="/logo-expoia.png"
          alt="EXPOIA 2026"
          width={200}
          height={68}
          className="h-9 w-auto justify-self-center max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 sm:h-11 md:h-14"
          priority
        />

        <div className="flex items-center justify-end gap-4">
          <p className="hidden text-right text-sm leading-tight text-expoia-navy lg:block">
            <span className="block font-semibold">17 Noviembre 2026</span>
            <span className="block text-expoia-gray-dark">Neiva - Huila, Colombia</span>
          </p>

          <a
            href="#registro"
            className="hidden rounded-full bg-expoia-magenta px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-expoia-navy sm:inline-block"
          >
            Inscríbete
          </a>

          {/* Menú móvil accesible sin JS extra: <details> nativo */}
          <nav className="absolute left-1/2 top-full flex w-full -translate-x-1/2 justify-center gap-5 border-t border-expoia-border bg-expoia-bg/95 px-4 py-2 text-[11px] font-medium text-expoia-navy backdrop-blur md:hidden">
            <a href="#test" className="hover:text-expoia-cyan">Diagnóstico</a>
            <a href="#registro" className="hover:text-expoia-cyan">Registro</a>
            <a href="#agenda" className="hover:text-expoia-cyan">Agenda</a>
          </nav>
        </div>
      </div>
    </header>
  );
}