// URL FIJA para desarrollo - ELIMINA toda la lógica compleja
const BACKEND_URL = "http://localhost:3001";

export async function registerUsuario(email: string, password: string, fullname: string) {
  console.log("📡 Llamando al backend con:", { email, fullname }); 
  console.log("🔗 URL:", `${BACKEND_URL}/api/auth/seguridad/registro-publico-usuarios`);
  
  const res = await fetch(`${BACKEND_URL}/api/auth/seguridad/registro-publico-usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullname }),
  });

  if (!res.ok) {
    let errorMessage = "Credenciales inválidas";
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

  if (!data.user) {
    throw new Error("Respuesta inválida del servidor: usuario no encontrado");
  }

  return data.user;
}

export async function loginUser(email: string, password: string) {
  console.log("📡 Intentando login para:", email);
  console.log("🔗 URL:", `${BACKEND_URL}/api/auth/login`);
  
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  console.log("📊 Status:", res.status, "OK?", res.ok);

  // ✅ PRIMERO parsear SIEMPRE la respuesta
  const data = await res.json();
  console.log("📊 Data del servidor:", data);

  if (!res.ok) {
    throw new Error(data.message || "Error en el login");
  }

  console.log("✅ Login exitoso");
  return data;
}

export async function validarCodigo2FA(usuarioId: string, codigo: string) {
  const res = await fetch(`${BACKEND_URL}/seguridad/verificar-2fa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId, codigo2fa: codigo }),
  });

  if (!res.ok) {
    let errorMessage = "Código 2FA inválido";
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

  return res.json();
}

export async function verifyEmailCode(email: string, code: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al verificar código");
  }

  return await res.json();
}

export async function resendVerificationCode(email: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al reenviar código");
  }

  return await res.json();
}

function determinarRolPorEmail(email: string): string {
  if (email.includes('admin') || email.includes('administrador')) return 'admin';
  if (email.includes('medico') || email.includes('doctor') || email.includes('dr.')) return 'medico';
  if (email.includes('enfermero') || email.includes('enfermera') || email.includes('nurse')) return 'enfermero';
  return 'paciente';
}