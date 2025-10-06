// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardMedico from "./components/DashboardMedico";
import DashboardEnfermero from "./components/DashboardEnfermero";
import DashboardPaciente from "./components/DashboardPaciente";
import { normalizarRol } from "@/lib/normalizarRol";

export default async function DashboardPage() {
  // 1. Obtener la sesión del usuario
  const session = await auth();
  const userRole = normalizarRol(session?.user?.role || '');

  // 2. Render según rol
  switch (userRole) {
    case "administrador":
      return <DashboardAdmin />;
    case "medico":
      return <DashboardMedico />;
    case "enfermera":
      return <DashboardEnfermero />;
    case "paciente":
      return <DashboardPaciente />;
    default:
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900">Acceso no autorizado</h2>
          <p className="text-gray-600">No tienes un rol asignado válido. Rol actual: {userRole}</p>
        </div>
      );
  }
}
