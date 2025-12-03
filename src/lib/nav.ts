// src/lib/nav.ts
export type NavItem = { label: string; href: string; icon?: string /* opcional */ };

// Constructor dinámico, evitando hardcodear userId en string literal
export function buildNavItems(role: string, userId?: string): NavItem[] {
  switch (role) {
    case 'ADMINISTRADOR':
    case 'administrador':
      return [
        { label: 'Inicio', href: '/dashboard' },
        { label: 'Crear cita', href: '/dashboard/appointments' },
        { label: 'Usuarios', href: '/dashboard/seguridad/identificacion-usuario' },
        { label: 'Servicios', href: '/dashboard/servicios' },
        { label: 'Reportes', href: '/dashboard/reportes' },
        { label: 'Historia Clínica', href: '/dashboard/historiamedica/new' },
      ];
    case 'MEDICO':
    case 'medico':
      return [
        { label: 'Inicio', href: '/dashboard' },
        { label: 'Crear cita', href: '/dashboard/appointments' },
        { label: 'Citas diarias', href: '/doctor/consultations' },
        { label: 'Hacer prescripción', href: '/dashboard/doctor/prescriptions' },
        // Nueva página de gestión de horarios (usa dynamic segment doctorId)
        { label: 'Agenda Horarios', href: '/dashboard/schedule/ME' },
        { label: 'Pacientes', href: '/dashboard/pacientes' },
        { label: 'Cola de Pacientes', href: '/dashboard/queue' },
        { label: 'Órdenes Médicas', href: '/dashboard/doctor/orders' },
        { label: 'Historia Clínica', href: '/dashboard/historiamedica/new' },
      ];
    case 'ENFERMERA':
    case 'enfermera':
      return [
        { label: 'Inicio', href: '/dashboard' },
        { label: 'Crear cita', href: '/dashboard/appointments' },
        { label: 'Pacientes', href: '/dashboard/enfermero/pacientes' },
        { label: 'Laboratorio', href: '/dashboard/enfermeria/laboratorio' },
      ];
    case 'PACIENTE':
    case 'paciente':
      return [
        { label: 'Inicio', href: '/dashboard' },
        { label: 'Mis Citas', href: '/dashboard/appointments' },
        { label: 'Mi Turno', href: '/patients/turno' },
        { label: 'Mis Órdenes', href: '/dashboard/patient/orders' },
        { label: 'Perfil', href: '/seguridad/cambio-clave' },
        // Ruta dinámica a historia clínica del paciente
        ...(userId ? [{ label: 'Mi Historia Clínica', href: `/dashboard/historiamedica/patient/${userId}` }] : []),
      ];
    default:
      return [{ label: 'Inicio', href: '/dashboard' }];
  }
}

// Compatibilidad temporal (si código previo usa NAV_ITEMS)
export const NAV_ITEMS: Record<string, NavItem[]> = {
  paciente: buildNavItems('paciente'),
  medico: buildNavItems('medico'),
  administrador: buildNavItems('administrador'),
  enfermera: buildNavItems('enfermera'),
};
