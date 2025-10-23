const BUSINESS_URL = "http://localhost:3002";

// Búsqueda avanzada de pacientes
// Legacy-compatible: can be called either with positional args (diagnostic, dateFrom, dateTo, page, limit)
// or with a single options object { diagnostic, dateFrom, dateTo, bloodType, allergies, chronicDiseases, search, page, limit }
type SearchPatientsOptions = {
  diagnostic?: string;
  dateFrom?: string;
  dateTo?: string;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export async function searchPatientsAdvanced(
  diagnosticOrOptions?: SearchPatientsOptions | string,
  dateFrom?: string,
  dateTo?: string,
  page: number = 1,
  limit: number = 10
) {
  // Normalize input
  let diagnostic: string | undefined;
  let dateFromVal: string | undefined;
  let dateToVal: string | undefined;
  let pageVal = page;
  let limitVal = limit;
  let bloodType: string | undefined;
  let allergies: string | undefined;
  let chronicDiseases: string | undefined;
  let search: string | undefined;

  if (diagnosticOrOptions && typeof diagnosticOrOptions === 'object' && !Array.isArray(diagnosticOrOptions)) {
    const opts = diagnosticOrOptions as SearchPatientsOptions;
    diagnostic = opts.diagnostic;
    dateFromVal = opts.dateFrom;
    dateToVal = opts.dateTo;
    bloodType = opts.bloodType;
    allergies = opts.allergies;
    chronicDiseases = opts.chronicDiseases;
    search = opts.search;
    pageVal = opts.page ?? pageVal;
    limitVal = opts.limit ?? limitVal;
  } else {
    diagnostic = diagnosticOrOptions as string | undefined;
    dateFromVal = dateFrom;
    dateToVal = dateTo;
  }

  console.log("🔍 Buscando pacientes con filtros:", { diagnostic, dateFrom: dateFromVal, dateTo: dateToVal, bloodType, allergies, chronicDiseases, search, page: pageVal, limit: limitVal });

  // Construir parámetros de query
  const params = new URLSearchParams();
  if (diagnostic) params.append('diagnostic', diagnostic);
  if (dateFromVal) params.append('dateFrom', dateFromVal);
  if (dateToVal) params.append('dateTo', dateToVal);
  if (bloodType) params.append('bloodType', bloodType);
  if (allergies) params.append('allergies', allergies);
  if (chronicDiseases) params.append('chronicDiseases', chronicDiseases);
  if (search) params.append('search', search);
  params.append('page', pageVal.toString());
  params.append('limit', limitVal.toString());

  // Obtener token del localStorage
  const token = localStorage.getItem('auth_token');
  console.log("🔑 Token obtenido:", token ? 'SÍ' : 'NO');

  const res = await fetch(`${BUSINESS_URL}/api/patients/search/advanced?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  console.log("📊 Status búsqueda:", res.status, "OK?", res.ok);
  if (!res.ok) {
    let errorMessage = "Error buscando pacientes";
    try {
      const errorData = await res.json();
      if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      }
    } catch {
        errorMessage = res.statusText || "Error de conexión";
      }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  console.log("📊 Data de búsqueda:", data);
  return data;
}

// Obtener paciente por ID
export async function getPatientByIdClient(id: string) {
  if (typeof window === 'undefined') {
    throw new Error("Solo se puede usar en el cliente");
  }

  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error("Token requerido");
  }

  const res = await fetch(`${BUSINESS_URL}/api/patients/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al cargar paciente");
  }

  return res.json();
}
// Verificar salud del servicio de negocio
export async function checkBusinessHealth() {
  const res = await fetch(`${BUSINESS_URL}/health`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Servicio de negocio no disponible");
  }

  return await res.json();
}

// Descargar un documento por ID
export async function downloadDocument(id: number): Promise<void> {
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error("Token requerido");
  }

  const response = await fetch(`${BUSINESS_URL}/api/documents/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al descargar el documento");
  }

  // Obtener el nombre del archivo desde el header Content-Disposition (opcional)
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `documento-${id}`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+)"?/);
    if (match && match[1]) filename = match[1];
  }

  // Crear un enlace temporal y simular clic para descargar
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Crear un nuevo diagnóstico

// src/app/servicios/business.service.ts
export async function createDiagnostic(
  patientId: string,
  diagnosticData: {
    title: string;
    description: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    observations?: string;
    nextAppointment?: string;
  },
  files?: File[]
): Promise<Record<string, unknown>> {
  if (typeof window === 'undefined') throw new Error("Solo se puede usar en el cliente");

  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error("Token requerido");

  const formData = new FormData();
  
  // Enviar cada campo directamente (NO dentro de un JSON)
  formData.append('title', diagnosticData.title);
  formData.append('description', diagnosticData.description);
  formData.append('symptoms', diagnosticData.symptoms);
  formData.append('diagnosis', diagnosticData.diagnosis);
  formData.append('treatment', diagnosticData.treatment);
  
  if (diagnosticData.observations) {
    formData.append('observations', diagnosticData.observations);
  }
  if (diagnosticData.nextAppointment) {
    formData.append('nextAppointment', diagnosticData.nextAppointment);
  }

  // Adjuntar archivos
  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append('documents', file);
    });
  }

  const res = await fetch(`${BUSINESS_URL}/api/diagnostics/patients/${patientId}/diagnostics`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`

    },
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear diagnóstico");
  }

  return res.json();
}