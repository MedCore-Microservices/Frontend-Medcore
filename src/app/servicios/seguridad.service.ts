
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function registerUsuario(email: string, password: string, fullname: string) {
  console.log("📡 Llamando al backend con:", { email, fullname }); 
  const res = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password,fullname }),
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