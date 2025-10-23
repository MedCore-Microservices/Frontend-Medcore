const BUSINESS_URL = "http://localhost:3002";

// Búsqueda avanzada de pacientes
export async function searchPatientsAdvanced(
  diagnostic?: string, 
  dateFrom?: string, 
  dateTo?: string, 
  page: number = 1, 
  limit: number = 10
) {
  console.log("🔍 Buscando pacientes con filtros:", { diagnostic, dateFrom, dateTo });
  
  // Construir parámetros de query
  const params = new URLSearchParams();
  if (diagnostic) params.append('diagnostic', diagnostic);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

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
    } catch (e) {
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

  const res = await fetch(`http://localhost:3002/api/patients/${id}`, {
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

  const response = await fetch(`http://localhost:3002/api/documents/${id}`, {
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
): Promise<any> {
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

  const res = await fetch(`http://localhost:3002/api/diagnostics/patients/${patientId}/diagnostics`, {
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

// Obtener consulta médica por ID
export async function getConsultationById(id: string) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error("Token requerido");
  }

  const res = await fetch(`${BUSINESS_URL}/api/consultations/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al obtener la consulta médica");
  }

  return await res.json();
}

// Actualizar consulta médica
export async function updateConsultation(id: string, data: any) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error("Token requerido");
  }

  const res = await fetch(`${BUSINESS_URL}/api/consultations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al actualizar la consulta médica");
  }

  return await res.json();
}