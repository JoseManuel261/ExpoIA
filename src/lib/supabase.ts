import { createClient } from "@supabase/supabase-js";

// Usa la Service Role Key SOLO en código de servidor (API routes),
// nunca la expongan en un componente de cliente ("use client").
export function crearClienteSupabaseServidor() {
  const url = process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceRoleKey);
}
