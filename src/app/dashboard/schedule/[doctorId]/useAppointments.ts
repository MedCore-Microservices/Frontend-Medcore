import { useCallback, useState } from 'react';
import { AUTH_MS_URL, BUSINESS_MS_URL, apiFetch } from './useApi';
import { Appointment, AppointmentStatus } from './types';

interface AppointmentsResponse { appointments: Appointment[] }

const statusActionEndpoint = (id: number, status: AppointmentStatus) => {
    switch (status) {
        case 'CONFIRMED': return `${AUTH_MS_URL}/api/appointments/${id}/confirm`;
        case 'IN_PROGRESS': return `${AUTH_MS_URL}/api/appointments/${id}/start`;
        case 'COMPLETED': return `${AUTH_MS_URL}/api/appointments/${id}/complete`;
        case 'NO_SHOW': return `${AUTH_MS_URL}/api/appointments/${id}/mark-no-show`;
        case 'CANCELLED': return `${AUTH_MS_URL}/api/appointments/${id}`; // DELETE
        default: return '';
    }
};

export function useAppointments(doctorId: number) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctorAppointments = useCallback(async () => {
        if (!doctorId) return;
        setLoading(true); setError(null);
        try {
            const data = await apiFetch<AppointmentsResponse>(`${AUTH_MS_URL}/api/appointments/doctor/${doctorId}`);
            setAppointments(data.appointments || []);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Error fetching appointments');
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    const transition = useCallback(async (id: number, next: AppointmentStatus) => {
        const endpoint = statusActionEndpoint(id, next);
        if (!endpoint) throw new Error('Acción no soportada');
        if (next === 'CANCELLED') {
            await apiFetch(`${endpoint}`, { method: 'DELETE' });
        } else {
            await apiFetch(`${endpoint}`, { method: 'POST' });
        }
        // Notificar (auto)
        try {
            await apiFetch(`${BUSINESS_MS_URL}/api/notifications/auto`, {
                method: 'POST',
                body: JSON.stringify({ action: next, appointmentId: id })
            });
        } catch { /* no-op notificación */ }
        await fetchDoctorAppointments();
    }, [fetchDoctorAppointments]);

    return { appointments, loading, error, fetchDoctorAppointments, transition };
}
