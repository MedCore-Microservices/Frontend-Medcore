// app/ClientLayout.tsx
'use client';

import { useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const sesionActiva = false;

  return (
    <>
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">MedCore</a>
          <ul className="flex space-x-4">
            {!sesionActiva ? (
              <>
                <li>
                  <a href="/seguridad/identificacion-usuario" className="hover:underline">
                    Iniciar Sesión
                  </a>
                </li>
                <li>
                  <a href="/seguridad/registro-publico-usuarios" className="hover:underline font-medium">
                    Registrarse
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/seguridad/cambiar-clave" className="hover:underline">
                    Cambiar Clave
                  </a>
                </li>
                <li>
                  <a href="/seguridad/cerrar-sesion" className="hover:underline">
                    Cerrar Sesión
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="container mx-auto py-8 min-h-screen">
        {children}
      </main>

      <footer className="bg-blue-800 text-white p-6">
        <div className="container mx-auto text-center">
          © 2025 MedCore - Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}