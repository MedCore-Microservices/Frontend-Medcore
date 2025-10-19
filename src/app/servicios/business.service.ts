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