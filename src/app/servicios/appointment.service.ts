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
