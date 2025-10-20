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
  
  // Primero intentar obtener de localStorage (para compatibilidad con código viejo)
  const localToken = localStorage.getItem('auth_token');
  if (localToken) return localToken;
  
  return null;
}
