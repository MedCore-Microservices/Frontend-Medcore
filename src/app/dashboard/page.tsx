import { auth } from "@/auth";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardMedico from "./components/DashboardMedico";
import DashboardEnfermero from "./components/DashboardEnfermero";
import DashboardPaciente from "./components/DashboardPaciente";


function normalizarRol(rol: string): string {
  const rolesMap: { [key: string]: string } = {
    'admin': 'admin',
    'administrator': 'admin',
    'medico': 'medico',
    'doctor': 'medico',
    'physician': 'medico',
    'enfermero': 'enfermero',
    'nurse': 'enfermero',
    'paciente': 'paciente',
    'patient': 'paciente',
    'PATIENT': 'paciente' 
  };
  
  return rolesMap[rol.toLowerCase()] || rol;
}








export default async function DashboardPage() {
  // 1. Obtener la sesión del usuario
  const session = await auth();
  const userRole = normalizarRol(session?.user?.role || '');

  // 2. Función que renderiza el dashboard según el rol
  const renderDashboardByRole = () => {
    switch (userRole) {
      case "admin":
        return <DashboardAdmin />;
      case "medico":
        return <DashboardMedico />;
      case "enfermero":
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
  };

  // 3. Retornar el dashboard correspondiente
  return renderDashboardByRole();
}