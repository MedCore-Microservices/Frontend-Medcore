import Link from "next/link";

export default function DashboardPaciente() {
  return (
    <div className="space-y-6 px-3 sm:px-0">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Mi Área de Paciente</h2>
        <p className="text-gray-600">Bienvenido a su portal de salud</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900">Próxima Cita</h3>
          <p className="text-xl font-bold text-blue-600">15 Mar 2024</p>
          <p className="text-sm text-blue-700">10:30 AM - Dr. García</p>
        </div>
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-green-900">Medicamentos Activos</h3>
          <p className="text-2xl font-bold text-green-600">3</p>
        </div>
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-purple-900">Resultados Pendientes</h3>
          <p className="text-2xl font-bold text-purple-600">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Mis Próximas Citas</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <div className="font-medium">Consulta de rutina</div>
              <div className="text-sm text-gray-600">15 Mar 2024 - 10:30 AM</div>
              <div className="text-sm">Dr. Juan García - Cardiología</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-medium">Control de presión</div>
              <div className="text-sm text-gray-600">20 Mar 2024 - 09:15 AM</div>
              <div className="text-sm">Enf. María López</div>
            </div>
          </div>
        </div>
        
  <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Medicamentos Actuales</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Atorvastatina 20mg</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 rounded">Activo</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Metformina 500mg</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 rounded">Activo</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Losartán 50mg</span>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 rounded">Por terminar</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-2">Mi Turno</h3>
        <p className="text-gray-600 mb-4">Únete a la cola y consulta tu número y posición en tiempo real.</p>
        <Link href="/patients/turno" className="inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Ir a Mi Turno</Link>
      </div>
      {/* Mostrar acceso a lista de pacientes solo en desarrollo para pruebas */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Pacientes (Pruebas)</h3>
          <p className="text-gray-600 mb-4">Acceso limitado para pruebas como paciente</p>
          <Link href="/patients" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Ver Pacientes</Link>
        </div>
      )}
    </div>
  );
}