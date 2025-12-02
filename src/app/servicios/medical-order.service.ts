// Servicio para consumir API de órdenes médicas
import { getAuthTokenClient } from '@/lib/getAuthToken';
import type { MedicalOrderDTO, CreateOrderPayload, LabExamType, RadiologyExamType } from '@/types/medical-order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthTokenClient();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

// ========== Crear órdenes ==========
export async function createLaboratoryOrder(payload: CreateOrderPayload): Promise<MedicalOrderDTO> {
  const result = await fetchWithAuth(`${API_URL}/medical-orders/laboratory`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function createRadiologyOrder(payload: CreateOrderPayload): Promise<MedicalOrderDTO> {
  const result = await fetchWithAuth(`${API_URL}/medical-orders/radiology`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.data;
}

// ========== Listar órdenes ==========
export async function getAllOrders(type?: 'laboratory' | 'radiology'): Promise<MedicalOrderDTO[]> {
  const url = type ? `${API_URL}/medical-orders?type=${type}` : `${API_URL}/medical-orders`;
  const result = await fetchWithAuth(url);
  return result.data || [];
}

export async function getOrdersByPatient(patientId: number): Promise<MedicalOrderDTO[]> {
  const result = await fetchWithAuth(`${API_URL}/medical-orders/patient/${patientId}`);
  return result.data || [];
}

export async function getOrderById(orderId: string): Promise<MedicalOrderDTO> {
  const result = await fetchWithAuth(`${API_URL}/medical-orders/${orderId}`);
  return result.data;
}

// ========== Catálogos ==========
export async function getLabExamTypes(): Promise<LabExamType[]> {
  const result = await fetchWithAuth(`${API_URL}/lab-exam-types`);
  return result.data || [];
}

export async function getRadiologyExamTypes(): Promise<RadiologyExamType[]> {
  const result = await fetchWithAuth(`${API_URL}/rad-exam-types`);
  return result.data || [];
}
