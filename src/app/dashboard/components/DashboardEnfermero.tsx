import Link from "next/link";

export default function DashboardEnfermero() {
  return (
    <div className="space-y-6 px-3 sm:px-0">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Enfermero/a</h2>
        <p className="text-gray-600">Gestión de cuidados y atención a pacientes</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900">Pacientes Asignados</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-green-900">Medicamentos Pendientes</h3>
          <p className="text-2xl font-bold text-green-600">7</p>
        </div>
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-purple-900">Signos Vitales</h3>
          <p className="text-2xl font-bold text-purple-600">3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Tareas Pendientes</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="rounded h-5 w-5" />
              <span>Tomar signos vitales - Hab. 204</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="rounded h-5 w-5" />
              <span>Administrar medicamento - Sr. Rodríguez</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="rounded h-5 w-5" />
              <span>Cambio de vendaje - Hab. 301</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Pacientes Críticos</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <span className="font-medium">Ana López - Hab. 105</span>
              <p className="text-sm text-red-600">Presión arterial elevada</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <span className="font-medium">Carlos Ruiz - Hab. 208</span>
              <p className="text-sm text-yellow-600">Fiebre persistente</p>
            </div>
          </div>
        </div>
      </div>
      {/* Acceso rápido a Pacientes */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
        <p className="text-gray-600 mb-4">Accede a la lista de pacientes asignados</p>
        <Link href="/patients" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Ver Pacientes</Link>
      </div>
    </div>
  );
}