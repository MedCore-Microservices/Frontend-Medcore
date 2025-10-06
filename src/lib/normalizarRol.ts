// src/lib/normalizarRol.ts
export function normalizarRol(rolInput?: string | null) {
    if (!rolInput) return "guest";
    const rol = String(rolInput).toLowerCase();
    const rolesMap: Record<string, string> = {
      admin: "admin",
      administrator: "admin",
      medico: "medico",
      doctor: "medico",
      physician: "medico",
      enfermero: "enfermero",
      nurse: "enfermero",
      paciente: "paciente",
      patient: "paciente",
      PATIENT: "paciente"
    };
    return rolesMap[rol] ?? rol;
  }
  