// src/app/dashboard/layout.tsx
import MobileSidebar from "./components/mobileSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { normalizarRol } from "@/lib/normalizarRol";
import React from "react";
import DashboardShell from './components/dashboardShell';
import { SidebarStateProvider } from "./components/SidebarStateProvider";
import { NotificationsProvider } from './components/NotificationsProvider';
import NotificationBell from '@/app/dashboard/components/notificationBell';

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const session = await auth();

  if (!session) redirect('/seguridad/identificacion-usuario');

  const rawRole = session.user?.role ?? 'guest';
  const userRole = normalizarRol(rawRole);
  const userName = session.user?.name ?? 'Usuario';

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarStateProvider>
        <NotificationsProvider>
        {/* Header */}
        <header className="bg-white shadow-sm border-b z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                {/* Mobile button inline — dentro del provider */}
                <div className="md:hidden">
                  <MobileSidebar role={userRole} inlineButton />
                </div>

                <div>
                  <h1 className="text-xl font-semibold text-gray-900">MedCore Dashboard</h1>
                  <p className="text-sm text-gray-500 capitalize">Rol: {userRole} | Usuario: {userName}</p>
                </div>
              </div>

              <nav className="flex space-x-4 items-center">
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Inicio</a>
                <a href="/seguridad/cambio-clave" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Perfil</a>
                <a href="/seguridad/cerrar-sesion" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">Cerrar Sesión</a>
                <NotificationBell />
              </nav>
            </div>
          </div>
        </header>

        {/* Shell cliente que maneja sidebars y children */}
        <DashboardShell role={userRole}>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </DashboardShell>
        </NotificationsProvider>
      </SidebarStateProvider>
    </div>
  );
}
