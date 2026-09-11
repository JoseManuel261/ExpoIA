import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-expoia-border bg-expoia-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Image src="/logo-expoia.png" alt="EXPOIA 2026" width={140} height={48} className="h-8 w-auto" />
        <nav className="hidden gap-8 text-sm font-medium text-expoia-navy md:flex">
          <a href="#test" className="hover:text-expoia-cyan">Diagnóstico</a>
          <a href="#registro" className="hover:text-expoia-cyan">Registro</a>
        </nav>
        <a
          href="#registro"
          className="rounded-full bg-expoia-magenta px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-expoia-navy"
        >
          Inscríbete
        </a>
      </div>
    </header>
  );
}
