import { NextRequest, NextResponse } from "next/server";
import { crearClienteSupabaseServidor } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const datos = await request.json();

  const { nombre, empresa, correo, telefono, principalReto, resultadoPorcentaje, resultadoEtiqueta } = datos;

  if (!nombre || !empresa || !correo || !telefono || !principalReto) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  // 1) Guardado en Supabase (fuente de verdad / respaldo real).
  //    Ejecuta antes el SQL de /supabase/schema.sql en el SQL Editor de su proyecto.
  const supabase = crearClienteSupabaseServidor();
  const { error } = await supabase.from("registros_interes").insert({
    nombre,
    empresa,
    correo,
    telefono,
    principal_reto: principalReto,
    resultado_porcentaje: resultadoPorcentaje,
    resultado_etiqueta: resultadoEtiqueta,
  });

  if (error) {
    console.error("Error guardando en Supabase:", error.message);
    return NextResponse.json(
      { error: "No se pudo guardar el registro" },
      { status: 500 }
    );
  }

  // 2) Notificación por correo — PENDIENTE de conectar.
  //    Cuando tengan cuenta de Resend y el dominio verificado, descomenten esto
  //    e instalen la dependencia: npm install resend
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "EXPOIA <registro@SU-DOMINIO.co>",
  //   to: process.env.CORREO_NOTIFICACIONES!, // el correo específico a definir
  //   subject: `Nuevo registro de interés: ${empresa}`,
  //   text: `Nombre: ${nombre}\nEmpresa: ${empresa}\nCorreo: ${correo}\nTeléfono: ${telefono}\nReto: ${principalReto}\nResultado del test: ${resultadoPorcentaje ?? "N/A"}% (${resultadoEtiqueta ?? "N/A"})`,
  // });

  // 3) Guardado tipo "excel" — PENDIENTE de definir método (Google Sheets en
  //    vivo vs. .xlsx descargable), a la espera de los requisitos completos
  //    del registro oficial. Por ahora, la tabla de Supabase ya cumple esa
  //    función de respaldo consultable/exportable.

  return NextResponse.json({ ok: true });
}
