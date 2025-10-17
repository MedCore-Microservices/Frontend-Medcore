import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/medical-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Bienvenido a <span className="text-blue-300">MedCore</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Sistema Integral de Gestión Hospitalaria. Optimice la atención médica,
            la gestión de pacientes y los flujos clínicos con nuestra plataforma segura y moderna.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/seguridad/identificacion-usuario"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              Iniciar Sesión
            </Link>
            {/* {process.env.NEXT_PUBLIC_ALLOW_REGISTRATION === 'true' && (
            <Link
              href="/seguridad/registro-publico-usuarios"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              Registrarse
            </Link>
            )} */}
          </div>
        </div>
      </div>

      {/* Sobre Nosotros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Sobre MedCore
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tecnología al servicio de la salud
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Desarrollado por profesionales médicos y expertos en TI, MedCore ofrece una solución
              integral para clínicas, hospitales y centros de atención primaria.
              Seguridad, eficiencia y experiencia de usuario en un solo sistema.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="text-4xl font-bold text-blue-600">1000+</div>
                <div className="text-gray-700 mt-2">Pacientes gestionados</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="text-4xl font-bold text-blue-600">100+</div>
                <div className="text-gray-700 mt-2">Profesionales conectados</div>
              </div>
            </div>
          </div>
          <div
            className="rounded-2xl h-96 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/medical-equipment.jpg')",
            }}
          >
            <div className="w-full h-full rounded-2xl bg-black/10"></div>
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Funcionalidades Clave
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Gestión de Pacientes", desc: "Registro, historial médico y seguimiento integral." },
            { title: "Citas y Agendas", desc: "Sistema de programación inteligente para médicos y pacientes." },
            { title: "Recetas Electrónicas", desc: "Generación y seguimiento de tratamientos médicos." },
            { title: "Inventario Médico", desc: "Control de medicamentos, insumos y equipos." },
            { title: "Reportes Clínicos", desc: "Estadísticas y análisis para toma de decisiones." },
            { title: "Seguridad y Auditoría", desc: "Trazabilidad completa de todas las acciones del sistema." }
          ].map((service, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
              {/* Botón pequeño debajo del card 'Inventario Médico' (índice 3) */}
              {i === 3 && (
                <div className="mt-4">
                  <Link
                    href="/seguridad/registro-publico-usuarios"
                    className="inline-block px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm shadow-sm"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">MedCore</h3>
              <p className="text-gray-300 mb-4 max-w-lg">
                Sistema integral de gestión hospitalaria diseñado para optimizar la atención médica
                y mejorar la eficiencia operativa en clínicas y hospitales.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Servicios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <address className="not-italic text-gray-400 space-y-2">
                <p>📍 Calle Salud 123, Ciudad Médica</p>
                <p>📞 +57 300 123 4567</p>
                <p>✉️ contacto@medcore.com</p>
              </address>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MedCore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}