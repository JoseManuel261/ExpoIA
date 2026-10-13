import { NextRequest, NextResponse } from "next/server";
import { crearClienteSupabaseServidor } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const datos = await request.json();

  const {
    correo,
    nombre,
    telefono,
    tipoVinculacion,
    tipoVinculacionOtro,
    pais,
    paisOtro,
    ciudad,
    institucion,
    programaOSector,
    expectativas,
    expectativasOtro,
    autorizaDatos,
  } = datos;

  if (!correo || !nombre || !telefono || !tipoVinculacion || !pais || !ciudad || !autorizaDatos) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  // Igual que /api/registro: guardado en Supabase como fuente de verdad.
  // Ejecutar antes el SQL de /supabase/schema.sql (tabla registros_completos).
  const supabase = crearClienteSupabaseServidor();
  const { error } = await supabase.from("registros_completos").insert({
    correo,
    nombre,
    telefono,
    tipo_vinculacion: tipoVinculacion,
    tipo_vinculacion_otro: tipoVinculacionOtro || null,
    pais,
    pais_otro: paisOtro || null,
    ciudad,
    institucion: institucion || null,
    programa_o_sector: programaOSector || null,
    expectativas: Array.isArray(expectativas) ? expectativas : [],
    expectativas_otro: expectativasOtro || null,
    autoriza_datos: autorizaDatos,
  });

  if (error) {
    console.error("Error guardando registro completo en Supabase:", error.message);
    return NextResponse.json({ error: "No se pudo guardar el registro" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}