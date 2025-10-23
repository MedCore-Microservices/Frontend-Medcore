const BACKEND_URL ="http://localhost:3001";
export async function registerUsuario(email: string, password: string, fullname: string) {
  console.log("📡 Llamando al backend con:", { email, fullname }); 
  console.log("🔗 URL del backend:", BACKEND_URL); // ← Agrega esto para debug
  console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
  
  const res = await fetch(`${BACKEND_URL}/api/auth/seguridad/registro-publico-usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullname }),
  });

  console.log("📥 Respuesta completa del backend:", res);
  
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
  console.log("📤 Datos procesados:", data);

  if (!data.user) {
    throw new Error("Respuesta inválida del servidor: usuario no encontrado");
  }

  return data.user;
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

// Verificar código de email
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

// Reenviar código de verificación
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


export async function loginUser(email: string, password: string) {
  console.log("📡 Intentando login para:", email);
  
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let errorMessage = "Error en el login";
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
  
  // Asegurar que el usuario tenga un rol
  if (data.user) {
    // Si el backend no envía rol, lo determinamos por email
    if (!data.user.role) {
      data.user.role = determinarRolPorEmail(email);
    }
  }
  
  return data;
}



function determinarRolPorEmail(email: string): string {
  if (email.includes('admin') || email.includes('administrador')) return 'admin';
  if (email.includes('medico') || email.includes('doctor') || email.includes('dr.')) return 'medico';
  if (email.includes('enfermero') || email.includes('enfermera') || email.includes('nurse')) return 'enfermero';
  return 'paciente';
}