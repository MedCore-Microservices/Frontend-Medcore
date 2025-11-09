"use client";
import { getAuthTokenClient } from '@/lib/getAuthToken';
const BUSINESS_URL = process.env.NEXT_PUBLIC_BUSINESS_API || 'http://localhost:3002';

export type QueueStatus = 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELLED';
interface UserLite { id: number; fullname: string }
export interface QueueTicket {
  id: number;
  doctorId: number;
  patientId: number;
  status: QueueStatus;
  createdAt: string;
  calledAt?: string | null;
  completedAt?: string | null;
  patient?: UserLite; // datos enriquecidos opcionales
  doctor?: UserLite;  // datos enriquecidos opcionales
}

// Helpers
function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = getAuthTokenClient();
    if (token) h.Authorization = `Bearer ${token}`;
  }
  return h;
}

function withJsonHeaders(extra?: Record<string, string>): Record<string, string> {
  return { 'Content-Type': 'application/json', ...(extra || {}) };
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { const j = await res.json(); if (j.message) msg = j.message; } catch {}
    throw new Error(msg);
  }
  const json = await res.json();
  return json.data ?? json;
}

export async function joinQueue(doctorId: number): Promise<{ ticket: QueueTicket; position: number | null }> {
  const res = await fetch(`${BUSINESS_URL}/api/queue/join`, {
    method: 'POST',
    headers: withJsonHeaders(authHeaders()),
    body: JSON.stringify({ doctorId }),
  });
  return parse(res);
}

export async function callNext(doctorId: number): Promise<QueueTicket | null> {
  const res = await fetch(`${BUSINESS_URL}/api/queue/call-next`, {
    method: 'POST',
    headers: withJsonHeaders(authHeaders()),
    body: JSON.stringify({ doctorId }),
  });
  return parse(res);
}

export async function getCurrent(doctorId: number): Promise<QueueTicket | null> {
  const res = await fetch(`${BUSINESS_URL}/api/queue/doctor/${doctorId}/current`, { headers: authHeaders() });
  return parse(res);
}

// Lista de pacientes en espera para un médico
export async function getWaiting(doctorId: number): Promise<QueueTicket[]> {
  const res = await fetch(`${BUSINESS_URL}/api/queue/doctor/${doctorId}/waiting`, { headers: authHeaders() });
  return parse(res);
}

export async function getPosition(ticketId: number): Promise<{ ticket: QueueTicket; position: number | null }> {
  const res = await fetch(`${BUSINESS_URL}/api/queue/ticket/${ticketId}/position`, { headers: authHeaders() });
  return parse(res);
}

// Estimación simple: cada paciente tarda promedio de serviceMinutes
export function estimateWaitTime(position: number | null | undefined, serviceMinutes = 5): number {
  if (!position || position <= 0) return 0;
  return position * serviceMinutes; // minutos estimados
}
