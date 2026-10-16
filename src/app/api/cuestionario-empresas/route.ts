import { NextRequest, NextResponse } from "next/server";
import { crearClienteSupabaseServidor } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const datos = await request.json();
  if (!datos?.aceptaPolitica || !datos?.respuestas?.empresa || !datos?.respuestas?.usaIA) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const supabase = crearClienteSupabaseServidor();
  const { error } = await supabase.from("cuestionarios_empresas_huila").insert({
    respuestas: datos.respuestas,
    autoriza_contacto: datos.respuestas.autorizaContacto === "Sí, autorizo",
    autoriza_proveedores: datos.respuestas.autorizaProveedores === "Sí, autorizo",
    acepta_politica: true,
  });

  if (error) {
    console.error("Error guardando cuestionario de empresas:", error.message);
    return NextResponse.json({ error: "No se pudo guardar el cuestionario" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}