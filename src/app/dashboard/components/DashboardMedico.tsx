export default function DashboardMedico() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Médico</h2>
        <p className="text-gray-600">Gestión de pacientes y consultas</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900">Citas Pendientes</h3>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900">Pacientes Hoy</h3>
          <p className="text-2xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900">Urgencias</h3>
          <p className="text-2xl font-bold text-purple-600">2</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Citas</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Juan Pérez - 09:00 AM</span>
            <button className="bg-blue-500 text-white px-3 py-1 rounded">Atender</button>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>María García - 10:30 AM</span>
            <button className="bg-blue-500 text-white px-3 py-1 rounded">Atender</button>
          </div>
        </div>
      </div>
    </div>
  );
}