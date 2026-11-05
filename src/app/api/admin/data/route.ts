import { NextResponse } from "next/server";
import { tieneSesionAdmin } from "@/lib/admin-auth";
import { crearClienteSupabaseServidor } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await tieneSesionAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = crearClienteSupabaseServidor();
    const [interes, cuestionarios] = await Promise.all([
      supabase
        .from("registros_interes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("cuestionarios_empresas_huila")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000),
    ]);

    if (interes.error) throw interes.error;
    if (cuestionarios.error) throw cuestionarios.error;

    return NextResponse.json({
      registrosInteres: interes.data,
      cuestionarios: cuestionarios.data,
      actualizadoEn: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error cargando datos del panel administrativo:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los datos" },
      { status: 500 }
    );
  }
}
