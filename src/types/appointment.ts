// Tipos y utilidades para estados de Citas

export type AppointmentStatus =
  | "scheduled" // Programada
  | "confirmed" // Confirmada por paciente
  | "in_progress" // En curso
  | "completed" // Completada
  | "cancelled" // Cancelada
  | "no_show"; // Paciente no se presentó

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No se presentó",
};

// Clases de Tailwind para badges por estado
export const APPOINTMENT_STATUS_STYLE: Record<AppointmentStatus, string> = {
  scheduled: "bg-gray-100 text-gray-800 border border-gray-200",
  confirmed: "bg-blue-100 text-blue-800 border border-blue-200",
  in_progress: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  completed: "bg-green-100 text-green-800 border border-green-200",
  cancelled: "bg-red-100 text-red-800 border border-red-200",
  no_show: "bg-orange-100 text-orange-800 border border-orange-200",
};

export interface AppointmentDTO {
  id: string;
  status: AppointmentStatus;
  // Campos opcionales comunes en listados
  date?: string;
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName?: string;
}
