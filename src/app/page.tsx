export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Bienvenido a MedCore</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl">
        Sistema Integral de Gestión Hospitalaria. Optimice la atención médica, la gestión de pacientes y los flujos clínicos con nuestra plataforma segura y moderna.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/seguridad/identificacion-usuario"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </a>
        <a
          href="/seguridad/registro-publico-usuario"
          className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Registrarse
        </a>
      </div>
    </div>
  );
}