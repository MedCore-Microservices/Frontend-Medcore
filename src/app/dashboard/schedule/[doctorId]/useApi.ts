import { getAuthTokenClient } from '@/lib/getAuthToken';

export const AUTH_MS_URL = process.env.NEXT_PUBLIC_AUTH_MS_URL || 'http://localhost:3001';
export const BUSINESS_MS_URL = process.env.NEXT_PUBLIC_BUSINESS_MS_URL || 'http://localhost:3002';

export async function apiFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
            // Inyectar Authorization Bearer si hay token en el cliente
            const token = (typeof window !== 'undefined') ? getAuthTokenClient() : null;
            const headers = new Headers(init.headers || {});
            headers.set('Content-Type', 'application/json');
            if (token) headers.set('Authorization', `Bearer ${token}`);

            const res = await fetch(url, {
                headers,
        credentials: 'include',
        ...init
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed ${res.status}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return (await res.json()) as T;
    // Fallback: devolver texto cuando no sea JSON
    return (await res.text()) as unknown as T;
}
