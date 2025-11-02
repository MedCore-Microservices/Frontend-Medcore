const BUSINESS_URL = "http://localhost:3002";

export type PatientPayload = {
    fullname: string;
    identificationNumber: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    age?: number;
    gender?: string;
    bloodType?: string;
    allergies?: string;
    chronicDiseases?: string;
    emergencyContact?: string;
    status?: string;
};

export type SearchPatientsOptions = {
    diagnostic?: string;
    dateFrom?: string;
    dateTo?: string;
    gender?: string;
    minAge?: number | string;
    maxAge?: number | string;
    bloodType?: string;
    allergies?: string;
    chronicDiseases?: string;
    search?: string;
    page?: number;
    limit?: number;
};

async function authHeader() {
    if (typeof window === 'undefined') throw new Error('Solo cliente');
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token requerido');
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function searchPatients(options: SearchPatientsOptions) {
    const params = new URLSearchParams();
    if (options) {
        if (options.diagnostic) params.append('diagnostic', String(options.diagnostic));
        if (options.dateFrom) params.append('dateFrom', String(options.dateFrom));
        if (options.dateTo) params.append('dateTo', String(options.dateTo));
    if (options.gender) params.append('gender', String(options.gender));
        if (options.minAge !== undefined && options.minAge !== null && options.minAge !== '') params.append('minAge', String(options.minAge));
        if (options.maxAge !== undefined && options.maxAge !== null && options.maxAge !== '') params.append('maxAge', String(options.maxAge));
        if (options.bloodType) params.append('bloodType', String(options.bloodType));
        if (options.allergies) params.append('allergies', String(options.allergies));
        if (options.chronicDiseases) params.append('chronicDiseases', String(options.chronicDiseases));
        if (options.search) params.append('search', String(options.search));
        if (options.page) params.append('page', String(options.page));
        if (options.limit) params.append('limit', String(options.limit));
    }

    const headers = await authHeader();
    const res = await fetch(`${BUSINESS_URL}/api/patients/search/advanced?${params.toString()}`, {
        method: 'GET',
        headers
    });
    if (!res.ok) {
        const errorDetails = await res.json().catch(() => ({}));
        console.error('Error buscando pacientes:', errorDetails);
        throw new Error('Error buscando pacientes');
    }
    return res.json();
}

export async function getPatient(id: string | number) {
    const headers = await authHeader();
    const res = await fetch(`${BUSINESS_URL}/api/patients/${id}`, { headers });
    if (!res.ok) throw new Error('Error cargando paciente');
    return res.json();
}

export async function createPatient(payload: PatientPayload) {
    const headers = await authHeader();
    const res = await fetch(`${BUSINESS_URL}/api/patients`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error creando paciente');
    }
    return res.json();
}

export async function updatePatient(id: string | number, payload: Partial<PatientPayload>) {
    const headers = await authHeader();
    const res = await fetch(`${BUSINESS_URL}/api/patients/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error actualizando paciente');
    }
    return res.json();
}
