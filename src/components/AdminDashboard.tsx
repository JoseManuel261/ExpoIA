"use client";

import { useEffect, useMemo, useState } from "react";

type RegistroInteres = {
  id: string;
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  principal_reto: string;
  resultado_porcentaje: number | null;
  resultado_etiqueta: string | null;
  autoriza_datos: boolean;
  created_at: string;
};

type Cuestionario = {
  id: string;
  respuestas: Record<string, unknown>;
  autoriza_contacto: boolean;
  autoriza_proveedores: boolean;
  created_at: string;
};

type DatosPanel = {
  registrosInteres: RegistroInteres[];
  cuestionarios: Cuestionario[];
  actualizadoEn: string;
};

type Pestaña = "interes" | "empresas";
type Filtros = {
  empresa: string;
  reto: string;
  resultado: string;
  municipio: string;
  sector: string;
  tamano: string;
  usaIA: string;
  conocimientoIA: string;
  cargo: string;
  productoIA: string;
  autoriza: string;
  desde: string;
  hasta: string;
};

const FILTROS_INICIALES: Filtros = {
  empresa: "",
  reto: "",
  resultado: "",
  municipio: "",
  sector: "",
  tamano: "",
  usaIA: "",
  conocimientoIA: "",
  cargo: "",
  productoIA: "",
  autoriza: "",
  desde: "",
  hasta: "",
};

function fecha(valor: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(valor));
}

function texto(valor: unknown): string {
  if (Array.isArray(valor)) return valor.join(", ");
  if (valor && typeof valor === "object") {
    return Object.entries(valor as Record<string, unknown>)
      .map(([clave, valorInterno]) => `${clave}: ${texto(valorInterno)}`)
      .join(" | ");
  }
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  return valor === null || valor === undefined || valor === "" ? "—" : String(valor);
}

function buscarTexto(valor: unknown): string {
  if (Array.isArray(valor)) return valor.map(buscarTexto).join(" ");
  if (valor && typeof valor === "object") {
    return Object.entries(valor as Record<string, unknown>)
      .map(([clave, valorInterno]) => `${clave} ${buscarTexto(valorInterno)}`)
      .join(" ");
  }
  return valor === null || valor === undefined ? "" : String(valor);
}

function normalizar(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function coincideFecha(createdAt: string, desde: string, hasta: string) {
  const dia = createdAt.slice(0, 10);
  return (!desde || dia >= desde) && (!hasta || dia <= hasta);
}

function opcionesDe(respuestas: Cuestionario[], clave: string) {
  return [...new Set(respuestas.map((item) => encontrar(item.respuestas, [clave])).filter((item) => item !== "—"))].sort();
}

function ValorLegible({ valor }: { valor: unknown }) {
  if (Array.isArray(valor)) {
    return (
      <ul className="mt-2 grid gap-1.5">
        {valor.map((item, indice) => (
          <li key={`${texto(item)}-${indice}`} className="rounded-md bg-white px-2.5 py-1.5 text-sm text-expoia-navy">
            {typeof item === "object" ? <ValorLegible valor={item} /> : texto(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (valor && typeof valor === "object") {
    return (
      <div className="mt-2 grid gap-2">
        {Object.entries(valor as Record<string, unknown>).map(([clave, valorInterno]) => (
          <div key={clave} className="rounded-md bg-white px-2.5 py-2">
            <p className="text-xs font-medium text-expoia-gray-mid">{formatearClave(clave)}</p>
            <div className="text-sm text-expoia-navy">
              <ValorLegible valor={valorInterno} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <>{texto(valor)}</>;
}

function encontrar(respuestas: Record<string, unknown>, claves: string[]) {
  const clave = claves.find((item) => respuestas[item] !== undefined);
  return clave ? texto(respuestas[clave]) : "—";
}

function formatearClave(clave: string) {
  return clave
    .replaceAll("_", " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function esFecha(clave: string, valor: unknown): valor is string {
  return (
    (clave === "created_at" || clave.toLowerCase().includes("fecha")) &&
    typeof valor === "string" &&
    !Number.isNaN(Date.parse(valor))
  );
}

export default function AdminDashboard() {
  const [datos, setDatos] = useState<DatosPanel | null>(null);
  const [pestaña, setPestaña] = useState<Pestaña>("interes");
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);
  const [detalle, setDetalle] = useState<RegistroInteres | Cuestionario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarDatos() {
    try {
      const respuesta = await fetch("/api/admin/data", { cache: "no-store" });
      if (respuesta.status === 401) {
        window.location.reload();
        return;
      }
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || "No se pudieron cargar los datos");
      setDatos(resultado);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudieron cargar los datos");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const cargaInicial = window.setTimeout(() => void cargarDatos(), 0);
    const intervalo = window.setInterval(() => void cargarDatos(), 8000);
    return () => {
      window.clearTimeout(cargaInicial);
      window.clearInterval(intervalo);
    };
  }, []);

  const opcionesInteres = useMemo(() => {
    if (!datos) return { empresas: [], retos: [], resultados: [] };
    return {
      empresas: [...new Set(datos.registrosInteres.map((item) => item.empresa).filter(Boolean))].sort(),
      retos: [...new Set(datos.registrosInteres.map((item) => item.principal_reto).filter(Boolean))].sort(),
      resultados: [...new Set(datos.registrosInteres.map((item) => item.resultado_etiqueta).filter(Boolean) as string[])].sort(),
    };
  }, [datos]);

  const registrosFiltrados = useMemo(() => {
    if (!datos) return [];
    const consulta = busqueda.toLowerCase().trim();
    return datos.registrosInteres.filter((item) => {
      const coincideTexto = !consulta || normalizar(buscarTexto(item)).includes(normalizar(consulta));
      const coincideAutoriza =
        !filtros.autoriza ||
        (filtros.autoriza === "Sí" ? item.autoriza_datos : !item.autoriza_datos);
      const coincideResultado = !filtros.resultado || item.resultado_etiqueta === filtros.resultado;
      return coincideTexto &&
        (!filtros.empresa || item.empresa === filtros.empresa) &&
        (!filtros.reto || item.principal_reto === filtros.reto) &&
        coincideResultado &&
        coincideAutoriza &&
        coincideFecha(item.created_at, filtros.desde, filtros.hasta);
    });
  }, [datos, busqueda, filtros]);

  const cuestionariosFiltrados = useMemo(() => {
    if (!datos) return [];
    const consulta = busqueda.toLowerCase().trim();
    return datos.cuestionarios.filter((item) => {
      const municipio = encontrar(item.respuestas, ["municipio"]);
      const sector = encontrar(item.respuestas, ["sector"]);
      const usaIA = encontrar(item.respuestas, ["usaIA"]);
      const coincideTexto = !consulta || normalizar(buscarTexto(item.respuestas)).includes(normalizar(consulta));
      const autoriza = item.autoriza_contacto || item.autoriza_proveedores;
      return coincideTexto &&
        (!filtros.municipio || municipio === filtros.municipio) &&
        (!filtros.sector || sector === filtros.sector) &&
        (!filtros.tamano || encontrar(item.respuestas, ["tamano"]) === filtros.tamano) &&
        (!filtros.usaIA || usaIA === filtros.usaIA) &&
        (!filtros.conocimientoIA || encontrar(item.respuestas, ["conocimientoIA"]) === filtros.conocimientoIA) &&
        (!filtros.cargo || encontrar(item.respuestas, ["cargo"]) === filtros.cargo) &&
        (!filtros.productoIA || encontrar(item.respuestas, ["productosIA"]).includes(filtros.productoIA)) &&
        (!filtros.autoriza || (filtros.autoriza === "Sí" ? autoriza : !autoriza)) &&
        coincideFecha(item.created_at, filtros.desde, filtros.hasta);
    });
  }, [datos, busqueda, filtros]);

  function actualizarFiltro(clave: keyof Filtros, valor: string) {
    setFiltros((actuales) => ({ ...actuales, [clave]: valor }));
  }

  function cambiarPestaña(nuevaPestaña: Pestaña) {
    setPestaña(nuevaPestaña);
    setFiltros(FILTROS_INICIALES);
    setBusqueda("");
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES);
    setBusqueda("");
  }

  async function cerrarSesion() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const total = (datos?.registrosInteres.length ?? 0) + (datos?.cuestionarios.length ?? 0);

  return (
    <main className="min-h-screen bg-expoia-bg">
      <header className="border-b border-expoia-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-expoia-cyan">EXPOIA 2026</p>
            <h1 className="mt-1 text-2xl font-semibold text-expoia-navy">Panel de datos</h1>
          </div>
          <button onClick={cerrarSesion} className="rounded-lg border border-expoia-border px-4 py-2 text-sm font-medium text-expoia-navy hover:border-expoia-cyan">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <Metric label="Registros de interés" value={datos?.registrosInteres.length ?? 0} />
          <Metric label="Cuestionarios empresariales" value={datos?.cuestionarios.length ?? 0} />
          <Metric label="Total de respuestas" value={total} />
        </section>

        <section className="rounded-2xl border border-expoia-border bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex gap-2">
              <Tab activo={pestaña === "interes"} onClick={() => cambiarPestaña("interes")}>
                Registros de interés
              </Tab>
              <Tab activo={pestaña === "empresas"} onClick={() => cambiarPestaña("empresas")}>
                Cuestionarios empresariales
              </Tab>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar en todas las respuestas..."
                className="min-w-64 rounded-lg border border-expoia-border px-3 py-2 text-sm outline-none focus:border-expoia-cyan"
              />
              <button onClick={limpiarFiltros} className="rounded-lg border border-expoia-border px-3 py-2 text-sm font-medium text-expoia-gray-dark hover:border-expoia-cyan">
                Limpiar filtros
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-xl bg-expoia-bg p-4 sm:grid-cols-2 lg:grid-cols-4">
            {pestaña === "interes" ? (
              <>
                <Filtro label="Empresa" value={filtros.empresa} options={opcionesInteres.empresas} onChange={(value) => actualizarFiltro("empresa", value)} />
                <Filtro label="Reto principal" value={filtros.reto} options={opcionesInteres.retos} onChange={(value) => actualizarFiltro("reto", value)} />
                <Filtro label="Resultado" value={filtros.resultado} options={opcionesInteres.resultados} onChange={(value) => actualizarFiltro("resultado", value)} />
                <Filtro label="Autorizó datos" value={filtros.autoriza} options={["Sí", "No"]} onChange={(value) => actualizarFiltro("autoriza", value)} />
              </>
            ) : (
              <>
                <Filtro label="Municipio" value={filtros.municipio} options={opcionesDe(datos?.cuestionarios ?? [], "municipio")} onChange={(value) => actualizarFiltro("municipio", value)} />
                <Filtro label="Sector económico" value={filtros.sector} options={opcionesDe(datos?.cuestionarios ?? [], "sector")} onChange={(value) => actualizarFiltro("sector", value)} />
                <Filtro label="Tamaño de empresa" value={filtros.tamano} options={opcionesDe(datos?.cuestionarios ?? [], "tamano")} onChange={(value) => actualizarFiltro("tamano", value)} />
                <Filtro label="Usa IA" value={filtros.usaIA} options={opcionesDe(datos?.cuestionarios ?? [], "usaIA")} onChange={(value) => actualizarFiltro("usaIA", value)} />
                <Filtro label="Conocimiento de IA" value={filtros.conocimientoIA} options={opcionesDe(datos?.cuestionarios ?? [], "conocimientoIA")} onChange={(value) => actualizarFiltro("conocimientoIA", value)} />
                <Filtro label="Cargo" value={filtros.cargo} options={opcionesDe(datos?.cuestionarios ?? [], "cargo")} onChange={(value) => actualizarFiltro("cargo", value)} />
                <Filtro label="Producto de IA" value={filtros.productoIA} options={[...new Set((datos?.cuestionarios ?? []).flatMap((item) => { const valor = item.respuestas.productosIA; return Array.isArray(valor) ? valor.map(String) : []; }))].sort()} onChange={(value) => actualizarFiltro("productoIA", value)} />
                <Filtro label="Autorizaciones" value={filtros.autoriza} options={["Sí", "No"]} onChange={(value) => actualizarFiltro("autoriza", value)} />
              </>
            )}
            <label className="text-xs font-medium text-expoia-gray-dark">
              Desde
              <input type="date" value={filtros.desde} onChange={(event) => actualizarFiltro("desde", event.target.value)} className="mt-1 block w-full rounded-lg border border-expoia-border bg-white px-3 py-2 text-sm text-expoia-navy outline-none focus:border-expoia-cyan" />
            </label>
            <label className="text-xs font-medium text-expoia-gray-dark">
              Hasta
              <input type="date" value={filtros.hasta} onChange={(event) => actualizarFiltro("hasta", event.target.value)} className="mt-1 block w-full rounded-lg border border-expoia-border bg-white px-3 py-2 text-sm text-expoia-navy outline-none focus:border-expoia-cyan" />
            </label>
          </div>

          {error && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {cargando ? <p className="py-12 text-center text-sm text-expoia-gray-dark">Cargando datos...</p> : pestaña === "interes" ? (
            <TablaInteres registros={registrosFiltrados} onDetalle={setDetalle} />
          ) : <TablaEmpresas registros={cuestionariosFiltrados} onDetalle={setDetalle} />}
          <p className="mt-4 text-xs text-expoia-gray-mid">
            Actualización automática cada 8 segundos{datos ? ` · Última consulta: ${fecha(datos.actualizadoEn)}` : ""}
          </p>
        </section>
      </div>
      {detalle && <Detalle registro={detalle} onClose={() => setDetalle(null)} />}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-expoia-border bg-white p-5"><p className="text-sm text-expoia-gray-dark">{label}</p><p className="mt-2 text-3xl font-semibold text-expoia-navy">{value}</p></div>;
}

function Tab({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-lg px-4 py-2 text-sm font-semibold ${activo ? "bg-expoia-navy text-white" : "text-expoia-gray-dark hover:bg-expoia-bg"}`}>{children}</button>;
}

function Filtro({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-medium text-expoia-gray-dark">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 block w-full rounded-lg border border-expoia-border bg-white px-3 py-2 text-sm text-expoia-navy outline-none focus:border-expoia-cyan">
        <option value="">Todos</option>
        {options.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
      </select>
    </label>
  );
}

function TablaInteres({ registros, onDetalle }: { registros: RegistroInteres[]; onDetalle: (registro: RegistroInteres) => void }) {
  return <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-expoia-border text-xs uppercase tracking-wide text-expoia-gray-mid"><th className="px-3 py-3">Persona</th><th className="px-3 py-3">Empresa</th><th className="px-3 py-3">Contacto</th><th className="px-3 py-3">Reto principal</th><th className="px-3 py-3">Fecha</th><th /></tr></thead><tbody>{registros.map((registro) => <tr key={registro.id} className="border-b border-expoia-border last:border-0"><td className="px-3 py-4 font-medium text-expoia-navy">{registro.nombre}</td><td className="px-3 py-4">{registro.empresa}</td><td className="px-3 py-4">{registro.correo}<br />{registro.telefono}</td><td className="px-3 py-4">{registro.principal_reto}</td><td className="px-3 py-4 whitespace-nowrap">{fecha(registro.created_at)}</td><td className="px-3 py-4"><button onClick={() => onDetalle(registro)} className="font-semibold text-expoia-cyan hover:underline">Ver detalle</button></td></tr>)}</tbody></table>{!registros.length && <p className="py-10 text-center text-sm text-expoia-gray-dark">No hay registros con estos filtros.</p>}</div>;
}

function TablaEmpresas({ registros, onDetalle }: { registros: Cuestionario[]; onDetalle: (registro: Cuestionario) => void }) {
  return <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-expoia-border text-xs uppercase tracking-wide text-expoia-gray-mid"><th className="px-3 py-3">Empresa</th><th className="px-3 py-3">Municipio</th><th className="px-3 py-3">Sector</th><th className="px-3 py-3">Usa IA</th><th className="px-3 py-3">Fecha</th><th /></tr></thead><tbody>{registros.map((registro) => <tr key={registro.id} className="border-b border-expoia-border last:border-0"><td className="px-3 py-4 font-medium text-expoia-navy">{encontrar(registro.respuestas, ["empresa"])}</td><td className="px-3 py-4">{encontrar(registro.respuestas, ["municipio"])}</td><td className="px-3 py-4">{encontrar(registro.respuestas, ["sector"])}</td><td className="px-3 py-4">{encontrar(registro.respuestas, ["usaIA"])}</td><td className="px-3 py-4 whitespace-nowrap">{fecha(registro.created_at)}</td><td className="px-3 py-4"><button onClick={() => onDetalle(registro)} className="font-semibold text-expoia-cyan hover:underline">Ver detalle</button></td></tr>)}</tbody></table>{!registros.length && <p className="py-10 text-center text-sm text-expoia-gray-dark">No hay cuestionarios con estos filtros.</p>}</div>;
}

function Detalle({ registro, onClose }: { registro: RegistroInteres | Cuestionario; onClose: () => void }) {
  const campos = "respuestas" in registro ? Object.entries(registro.respuestas) : Object.entries(registro).filter(([clave]) => clave !== "id");
  const columna = (inicio: number) => (
    <div className="grid content-start gap-4">
      {campos
        .filter((_, indice) => indice % 2 === inicio)
        .map(([clave, valor]) => (
          <div key={clave} className="h-fit rounded-lg bg-expoia-bg p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-expoia-gray-mid">
              {formatearClave(clave)}
            </dt>
            <dd className="mt-1 break-words text-sm text-expoia-navy">
              {esFecha(clave, valor) ? fecha(valor) : <ValorLegible valor={valor} />}
            </dd>
          </div>
        ))}
    </div>
  );

  return <div className="fixed inset-0 z-10 flex items-center justify-center bg-expoia-navy/50 p-4" onClick={onClose}><section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><h2 className="text-2xl font-semibold text-expoia-navy">Detalle de respuesta</h2><button onClick={onClose} className="text-2xl text-expoia-gray-mid" aria-label="Cerrar">×</button></div><dl className="mt-6 grid gap-4 sm:grid-cols-2">{columna(0)}{columna(1)}</dl></section></div>;
}
