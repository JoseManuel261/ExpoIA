import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-expoia-border bg-expoia-bg/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
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
          className="h-11 w-auto justify-self-center md:h-14"
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
          <details className="relative md:hidden">
            <summary
              aria-label="Abrir menú"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-expoia-border"
            >
              <span className="sr-only">Menú</span>
              <div className="space-y-1">
                <span className="block h-0.5 w-5 bg-expoia-navy" />
                <span className="block h-0.5 w-5 bg-expoia-navy" />
                <span className="block h-0.5 w-5 bg-expoia-navy" />
              </div>
            </summary>
            <nav className="absolute right-0 mt-3 flex w-48 flex-col gap-1 rounded-xl border border-expoia-border bg-white p-2 shadow-lg">
              <a href="#test" className="rounded-lg px-3 py-2 text-sm font-medium text-expoia-navy hover:bg-expoia-bg">Diagnóstico</a>
              <a href="#registro" className="rounded-lg px-3 py-2 text-sm font-medium text-expoia-navy hover:bg-expoia-bg">Registro</a>
              <a href="#agenda" className="rounded-lg px-3 py-2 text-sm font-medium text-expoia-navy hover:bg-expoia-bg">Agenda</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}