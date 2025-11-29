const BUSINESS_URL = "http://localhost:3002";

export type Medication = {
  name: string;
  dose?: string;
  dosage?: string;
  frequency?: string;
  duration?: string | number;
  durationDays?: number;
  instructions?: string;
};

export type PrescriptionPayload = {
  patientId: number;
  title: string;
  notes?: string;
  medications: Medication[];
};

export type Prescription = {
  id: number;
  doctorId: number;
  patientId: number;
  title: string;
  notes?: string;
  medications: Medication[];
  createdAt: string;
  updatedAt: string;
  doctor?: {
    id: number;
    fullname: string;
  };
  patient?: {
    id: number;
    fullname: string;
  };
};

async function authHeader() {
  if (typeof window === 'undefined') throw new Error('Solo cliente');
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Token requerido');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function createPrescription(payload: PrescriptionPayload): Promise<Prescription> {
  const headers = await authHeader();
  const res = await fetch(`${BUSINESS_URL}/api/prescriptions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error creando prescripción');
  }
  const data = await res.json();
  return data.data;
}

export async function getPrescriptionsByPatient(patientId: number | string): Promise<Prescription[]> {
  const headers = await authHeader();
  const res = await fetch(`${BUSINESS_URL}/api/prescriptions/patient/${patientId}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error obteniendo prescripciones');
  }
  const data = await res.json();
  return data.data;
}

export async function checkAllergies(patientId: number, medications: Medication[]) {
  const headers = await authHeader();
  const res = await fetch(`${BUSINESS_URL}/api/prescriptions/check-allergies`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ patientId, medications })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error verificando alergias');
  }
  const data = await res.json();
  return data.data;
}

export async function estimateDuration(medications: Medication[]) {
  const headers = await authHeader();
  const res = await fetch(`${BUSINESS_URL}/api/prescriptions/estimate-duration`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ medications })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error estimando duración');
  }
  const data = await res.json();
  return data.data;
}

export function downloadPrescriptionPDF(prescriptionId: number) {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Token requerido');
  
  const url = `${BUSINESS_URL}/api/prescriptions/${prescriptionId}/pdf`;
  const link = document.createElement('a');
  link.href = url;
  link.download = `prescripcion-${prescriptionId}.pdf`;
  link.target = '_blank';
  
  // Add authorization header by opening in new window with fetch
  fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(err => {
      console.error('Error descargando PDF:', err);
      throw err;
    });
}
