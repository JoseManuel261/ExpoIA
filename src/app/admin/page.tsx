import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { tieneSesionAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let autenticado = false;
  try {
    autenticado = await tieneSesionAdmin();
  } catch (error) {
    console.error("Error verificando el acceso administrativo:", error);
  }

  return autenticado ? <AdminDashboard /> : <AdminLogin />;
}
