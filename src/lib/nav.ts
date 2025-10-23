// src/lib/nav.ts
export type NavItem = { label: string; href: string; icon?: string /* opcional */ };

export const NAV_ITEMS: Record<string, NavItem[]> = {
  administrador: [
    { label: "Inicio", href: "/dashboard" },
    { label: "Usuarios", href: "/dashboard/seguridad/identificacion-usuario" },
    { label: "Servicios", href: "/dashboard/servicios" },
    { label: "Reportes", href: "/dashboard/reportes" },
    { label: "Historia Clínica", href: "/dashboard/historiamedica/new" },
  ],
  medico: [
    { label: "Inicio", href: "/dashboard" },
    { label: "Mi Agenda", href: "/dashboard/medico/agenda" },
    { label: "Pacientes", href: "/dashboard/pacientes" },
    { label: "Historia Clínica", href: "/dashboard/historiamedica/new" },
  ],
  enfermera: [
    { label: "Inicio", href: "/dashboard" },
    { label: "Pacientes", href: "/dashboard/enfermero/pacientes" },
  ],
  paciente: [
    { label: "Inicio", href: "/dashboard" },
    { label: "Pacientes", href: "/patients" },
    { label: "Mis Citas", href: "/dashboard/paciente/citas" },
    { label: "Perfil", href: "/seguridad/cambio-clave" },
    { label: "Historia Clínica", href: "/dashboard/historiamedica/patient/${userId}" },
  ],
};
