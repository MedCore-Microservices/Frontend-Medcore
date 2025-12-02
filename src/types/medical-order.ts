// Tipos para órdenes médicas (laboratorio y radiología)

export type OrderType = 'laboratory' | 'radiology';
export type OrderPriority = 'routine' | 'urgent' | 'stat';
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface MedicalOrderDTO {
  id: string;
  type: OrderType;
  patientId: number;
  patientName?: string;
  patient?: {
    id: number;
    fullname: string;
    identificationNumber?: string;
    email?: string;
  };
  requestedBy: number;
  requestedByName?: string;
  requestedByUser?: {
    id: number;
    fullname: string;
    role: string;
  };
  priority: OrderPriority;
  clinicalNotes?: string;
  tests: LabTest[] | RadiologyExam[];
  status: OrderStatus;
  requestedAt: string;
  medicalRecordId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LabTest {
  code: string;
  name: string;
  description?: string;
}

export interface RadiologyExam {
  code: string;
  name: string;
  description?: string;
  procedures?: string[];
}

export interface LabExamType {
  id: number;
  code: string;
  name: string;
  description?: string;
  tests?: Array<{ code: string; name?: string; description?: string }>;
}

export interface RadiologyExamType {
  id: number;
  code: string;
  name: string;
  description?: string;
  procedures?: Array<{ code: string; name?: string; description?: string }>;
}

export interface CreateOrderPayload {
  patientId: number;
  requestedBy?: number;
  priority: OrderPriority;
  clinicalNotes?: string;
  requestedTests: string[]; // códigos de tests/exámenes
  requestedAt?: string;
}
