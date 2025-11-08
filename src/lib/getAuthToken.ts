import { auth } from "@/auth";

/**
 * Obtiene el token de autenticación desde la sesión de NextAuth
 * Para usar en Server Components y Server Actions
 */
export async function getAuthToken(): Promise<string | null> {
  const session = await auth();
  return session?.accessToken || null;
}

/**
 * Obtiene el token de autenticación desde localStorage
 * Para usar en Client Components
 * NOTA: Esto es temporal hasta migrar completamente a NextAuth
 */
export function getAuthTokenClient(): string | null {
  if (typeof window === 'undefined') return null;
  // Preferir sessionStorage para permitir múltiples sesiones (medico/paciente) en ventanas distintas
  try {
    const sessionToken = sessionStorage.getItem('auth_token');
    if (sessionToken) return sessionToken;
  } catch {}

  // Compatibilidad con código existente
  try {
    const localToken = localStorage.getItem('auth_token');
    if (localToken) return localToken;
  } catch {}
  
  return null;
}
