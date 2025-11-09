"use client";
import { useEffect, useState, useCallback } from 'react';
import { callNext, getCurrent, getWaiting, type QueueTicket } from '@/app/servicios/queue.service';
import { useSession } from 'next-auth/react';
import { normalizarRol } from '@/lib/normalizarRol';

export default function DoctorQueuePage() {
  const { data: session, status } = useSession();
  // El doctorId debe venir del usuario logueado con rol MEDICO
  const normalizedRole = normalizarRol(session?.user?.role);
  const doctorId = normalizedRole === 'medico' ? Number(session?.user?.id) : undefined;
  const [current, setCurrent] = useState<QueueTicket | null>(null);
  const [waiting, setWaiting] = useState<QueueTicket[]>([]);
  const [loadingCall, setLoadingCall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    // Evitar falso positivo mientras la sesión se está cargando
    if (status === 'loading') return;
    if (!doctorId) {
      // Solo mostrar error si ya estamos autenticados y el rol debe ser médico
      if (status === 'authenticated' && normalizedRole === 'medico') {
        setError('No se detectó un doctorId válido para esta sesión. Verifica que iniciaste como MEDICO.');
      }
      return;
    }
    try {
      const [c, w] = await Promise.all([
        getCurrent(doctorId),
        getWaiting(doctorId),
      ]);
      setCurrent(c);
      setWaiting(w || []);
      setError(null); // limpiar error si todo salió bien
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al actualizar la cola';
      setError(msg);
    }
  }, [doctorId, status, normalizedRole]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000); // Poll cada 5s
    return () => clearInterval(id);
  }, [refresh]);

  async function handleCallNext() {
    if (!doctorId) return;
    setLoadingCall(true);
    try {
      await callNext(doctorId);
      await refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al llamar al siguiente paciente';
      setError(msg);
    } finally {
      setLoadingCall(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Cola de Pacientes</h1>
      {error && <div className="text-red-600">{error}</div>}
      <div className="bg-white rounded shadow p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">Ticket actual:</p>
          {current ? (
            <p className="text-xl">Ticket #{current.id} • {current.patient?.fullname || `Paciente ${current.patientId}`}</p>
          ) : (
            <p className="text-gray-500">Ninguno</p>
          )}
        </div>
        <button
          onClick={handleCallNext}
          disabled={loadingCall}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          {loadingCall ? 'Llamando...' : 'Llamar Siguiente'}
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">En espera</p>
          <span className="text-sm bg-gray-100 border rounded px-2 py-1">{waiting.length} pacientes</span>
        </div>
        {waiting.length === 0 ? (
          <p className="text-gray-500">No hay pacientes en espera.</p>
        ) : (
          <ul className="divide-y">
            {waiting.map((t) => (
              <li key={t.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">Ticket #{t.id}</p>
                  <p className="text-sm text-gray-500">{t.patient?.fullname || `Paciente ${t.patientId}`}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-gray-400">Se actualiza cada 5s.</p>
    </div>
  );
}
