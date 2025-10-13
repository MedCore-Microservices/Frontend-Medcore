export default function DashboardAdmin() {
  return (
    <div className="space-y-6 px-3 sm:px-0">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrador</h2>
        <p className="text-gray-600">Gestión completa del sistema hospitalario</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900">Total Usuarios</h3>
          <p className="text-2xl font-bold text-blue-600">156</p>
        </div>
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-green-900">Médicos Activos</h3>
          <p className="text-2xl font-bold text-green-600">24</p>
        </div>
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-purple-900">Citas Hoy</h3>
          <p className="text-2xl font-bold text-purple-600">38</p>
        </div>
  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-orange-900">Ingresos Mensuales</h3>
          <p className="text-2xl font-bold text-orange-600">$12,450</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Gestión de Usuarios</h3>
          <p className="text-gray-600">Administrar médicos, enfermeros y pacientes</p>
        </div>
  <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Reportes del Sistema</h3>
          <p className="text-gray-600">Generar reportes y estadísticas</p>
        </div>
      </div>
    </div>
  );
}