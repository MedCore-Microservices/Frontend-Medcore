"use client";
import { useEffect, useState, useCallback } from 'react';
import { callNext, getCurrent } from '@/app/servicios/queue.service';
import { useSession } from 'next-auth/react';

export default function DoctorQueuePage() {
  const { data: session } = useSession();
  // El doctorId debe venir del usuario logueado con rol MEDICO
  const doctorId = session?.user?.role === 'MEDICO' ? Number(session.user.id) : undefined;
  const [current, setCurrent] = useState<any>(null);
  const [loadingCall, setLoadingCall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!doctorId) {
      setError('No se detectó un doctorId válido para esta sesión. Verifica que iniciaste como MEDICO.');
      return;
    }
    try {
      const c = await getCurrent(doctorId);
      setCurrent(c);
    } catch (e:any) {
      setError(e.message);
    }
  }, [doctorId]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000); // Poll cada 5s
    return () => clearInterval(id);
  }, [refresh]);

  async function handleCallNext() {
    if (!doctorId) {
      setError('doctorId faltante: inicia sesión como MEDICO.');
      return;
    }
    setLoadingCall(true);
    try {
      await callNext(doctorId);
      await refresh();
    } catch (e:any) {
      setError(e.message);
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
          {current ? <p className="text-xl">#{current.id} Paciente {current.patientId}</p> : <p className="text-gray-500">Ninguno</p>}
        </div>
        <button
          onClick={handleCallNext}
          disabled={loadingCall}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          {loadingCall ? 'Llamando...' : 'Llamar Siguiente'}
        </button>
      </div>
      <p className="text-xs text-gray-400">Actualiza cada 5s. Próximo paso: mostrar lista completa.</p>
    </div>
  );
}
