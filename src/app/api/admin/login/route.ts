import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import {
  ADMIN_COOKIE_NAME,
  validarPasswordAdmin,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let datos: { password?: unknown };
  try {
    datos = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (typeof datos.password !== "string" || !datos.password) {
    return NextResponse.json({ error: "Ingresa la contraseña" }, { status: 400 });
  }

  try {
    if (!validarPasswordAdmin(datos.password)) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error configurando el acceso administrativo:", error);
    return NextResponse.json(
      { error: "El acceso administrativo no está configurado" },
      { status: 500 }
    );
  }

  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set(ADMIN_COOKIE_NAME, createHmac("sha256", process.env.ADMIN_PANEL_PASSWORD!)
    .update("expoia-admin-session")
    .digest("hex"), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return respuesta;
}
