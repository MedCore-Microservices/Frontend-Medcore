// Base URL del microservicio de autenticación (citas viven allí según rutas /api/appointments)
// Usar variable de entorno pública para permitir configuración por ambiente
const AUTH_URL = process.env.NEXT_PUBLIC_MS_AUTH_URL || "http://localhost:3001";
import type { AppointmentDTO, AppointmentStatus } from "@/types/appointment";
import { getAuthTokenClient } from "@/lib/getAuthToken";

function getToken(): string {
  const token = getAuthTokenClient();
  if (!token) throw new Error('Token requerido');
  return token;
}

async function handleJson(res: Response, defaultMsg: string) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || defaultMsg);
  }
  return res.json();
}

async function postAction<T = unknown>(id: string, actionPath: string, defaultMsg: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments/${id}/${actionPath}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return handleJson(res, defaultMsg);
}

export async function confirmAppointment(id: string): Promise<AppointmentDTO> {
  return normalizeAppointment(await postAction<any>(id, 'confirm', "Error al confirmar cita"));
}

export async function completeAppointment(id: string): Promise<AppointmentDTO> {
  return normalizeAppointment(await postAction<any>(id, 'complete', "Error al completar cita"));
}

export async function markNoShowAppointment(id: string): Promise<AppointmentDTO> {
  return normalizeAppointment(await postAction<any>(id, 'mark-no-show', "Error al marcar no show"));
}

// Iniciar atención: intentamos /start y si no existe, fallback a /in-progress
export async function startAppointment(id: string): Promise<AppointmentDTO> {
  const token = getToken();
  let res = await fetch(`${AUTH_URL}/api/appointments/${id}/start`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (res.status === 404) {
  res = await fetch(`${AUTH_URL}/api/appointments/${id}/in-progress`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  }
  return normalizeAppointment(await handleJson(res, 'Error al iniciar atención'));
}

export async function cancelAppointment(id: string): Promise<{ success: boolean } & Partial<AppointmentDTO>> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error al cancelar cita');
  return { success: true, ...normalizeAppointment(data.appointment || data) };
}

export async function getAppointmentById(id: string): Promise<AppointmentDTO> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments/${id}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error cargando cita');
  return normalizeAppointment(data.appointment || data);
}

export async function listAppointmentsByPatient(patientId: string): Promise<AppointmentDTO[]> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments/patient/${patientId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error listando citas');
  const appts = data.appointments || [];
  return appts.map((a: any) => normalizeAppointment(a));
}

export async function listAppointmentsByDoctor(doctorId: string): Promise<AppointmentDTO[]> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments/doctor/${doctorId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error listando citas del médico');
  const appts = data.appointments || [];
  return appts.map((a: any) => normalizeAppointment(a));
}

// Listado general (si el backend lo soporta)
export async function listAppointmentsAll(): Promise<AppointmentDTO[]> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error listando citas');
  const appts = data.appointments || data || [];
  return appts.map((a: any) => normalizeAppointment(a));
}

export type UpsertAppointmentPayload = {
  date: string; // ISO o compatible con backend
  doctorId: string;
  specializationId?: string;
  patientId?: string;
  notes?: string;
};

export async function createAppointment(payload: UpsertAppointmentPayload): Promise<AppointmentDTO> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleJson(res, 'Error creando cita');
  const appt = normalizeAppointment(data.appointment || data);
  // Notificación global en el Front para paciente (campana)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('appointment:created', { detail: { appointmentId: appt.id } }));
  }
  // Auto notificación backend (SMS/Email mock) en Business MS
  try {
    const BUSINESS_URL = process.env.NEXT_PUBLIC_MS_BUSINESS_URL || 'http://localhost:3002';
    await fetch(`${BUSINESS_URL}/api/notifications/auto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'CREATED', appointmentId: appt.id })
    });
  } catch { /* no-op */ }
  return appt;
}

export async function updateAppointment(id: string, payload: Partial<UpsertAppointmentPayload>): Promise<AppointmentDTO> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleJson(res, 'Error actualizando cita');
  return normalizeAppointment(data.appointment || data);
}

export async function deleteAppointment(id: string): Promise<{ success: boolean } & Partial<AppointmentDTO>> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/appointments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error eliminando cita');
  return { success: true, ...normalizeAppointment(data.appointment || data) };
}

// Recursos auxiliares para selectores dinámicos (si el backend expone estos endpoints)
export type DoctorDTO = { id: string; fullname: string; specializationId?: string };
export type SpecializationDTO = { id: string; name: string };

export async function fetchDoctors(): Promise<DoctorDTO[]> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/doctors`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error cargando doctores');
  const list = data.doctors || data || [];
  return list.map((d: any) => ({ id: String(d.id), fullname: d.fullname || `${d.name || ''} ${d.lastname || ''}`.trim(), specializationId: d.specializationId ? String(d.specializationId) : undefined }));
}

export async function fetchSpecializations(): Promise<SpecializationDTO[]> {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}/api/specializations`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await handleJson(res, 'Error cargando especialidades');
  const list = data.specializations || data || [];
  return list.map((s: any) => ({ id: String(s.id), name: s.name || s.title || s.specializationName }));
}

// Normaliza diferencias entre backend y frontend
export function normalizeStatus(raw?: string | null): AppointmentStatus {
  if (!raw) return 'scheduled';
  const v = raw.toUpperCase();
  // Backend actual usa PENDING, COMPLETED, CANCELLED; histórico puede usar español
  if (v === 'PENDING' || v === 'PROGRAMADA') return 'scheduled';
  if (v === 'CONFIRMED' || v === 'CONFIRMADA') return 'confirmed';
  if (v === 'IN_PROGRESS' || v === 'EN_CURSO') return 'in_progress';
  if (v === 'COMPLETED' || v === 'COMPLETADA') return 'completed';
  if (v === 'CANCELLED' || v === 'CANCELADA') return 'cancelled';
  if (v === 'NO_SHOW' || v === 'NO SHOW') return 'no_show';
  return 'scheduled';
}

export function normalizeAppointment(a: any): AppointmentDTO {
  return {
    id: String(a.id),
    status: normalizeStatus(a.status),
    date: a.date ? new Date(a.date).toISOString() : undefined,
    patientId: a.userId ? String(a.userId) : undefined,
    patientName: a.user?.fullname,
    doctorId: a.doctorId ? String(a.doctorId) : undefined,
    doctorName: a.doctor?.fullname,
  };
}
