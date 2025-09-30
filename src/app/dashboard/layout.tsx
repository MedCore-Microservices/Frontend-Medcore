import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteger la ruta - si no hay sesión, redirigir al login
  if (!session) {
    redirect("/seguridad/identificacion-usuarios");
  }

  const userRole = session.user?.role || "usuario";
  const userName = session.user?.name || "Usuario";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                MedCore Dashboard
              </h1>
              <p className="text-sm text-gray-500 capitalize">
                Rol: {userRole} | Usuario: {userName}
              </p>
            </div>
            <nav className="flex space-x-4">
              <a 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Inicio
              </a>
              <a 
                href="/seguridad/cambio-clave" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Perfil
              </a>
              <a 
                href="/api/auth/signout" 
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}