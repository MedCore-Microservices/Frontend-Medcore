"use client";
import { useState, useEffect, useCallback } from 'react';
import { joinQueue, getPosition, estimateWaitTime } from '@/app/servicios/queue.service';

export default function PatientTurnoPage() {
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!ticketId) return;
    try {
      const data = await getPosition(ticketId);
      setPosition(data.position);
      setStatus(data.ticket.status);
    } catch (e:unknown) {
      if (e instanceof Error) {
      setError(e.message);
      }
    }
  }, [ticketId]);

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleJoin() {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await joinQueue(Number(doctorId));
      setTicketId(res.ticket.id);
      setPosition(res.position);
      setStatus(res.ticket.status);
    } catch (e:unknown) {
      if (e instanceof Error) {
      setError(e.message);
      } else {
        setError(String(e));
      }
    }
  }

  const etaMinutes = estimateWaitTime(position ? Math.max(0, position - 1) : 0, 5);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Mi Turno</h1>
      {error && <div className="text-red-600">{error}</div>}
      <div className="bg-white rounded shadow p-4 space-y-3">
        <label className="block text-sm">ID del Médico</label>
        <input
          className="border rounded px-3 py-2 w-60"
          type="number"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Ej. 1"
          disabled={!!ticketId}
        />
        {!ticketId ? (
          <button onClick={handleJoin} disabled={!doctorId || loading} className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
            {loading ? 'Uniendo...' : 'Unirme a la cola'}
          </button>
        ) : (
          <div className="space-y-1">
            <p>Ticket #: <span className="font-semibold">{ticketId}</span></p>
            <p>Estado: {status}</p>
            {status === 'WAITING' && position && <p>Posición en cola: {position}</p>}
            {status === 'WAITING' && position && position > 1 && (
              <p>Tiempo estimado de espera: ~ {etaMinutes} min</p>
            )}
            {status === 'CALLED' && <p className="text-blue-600 font-semibold">¡Es tu turno! Dirígete al consultorio.</p>}
            {status === 'COMPLETED' && <p className="text-green-600 font-semibold">Atención completada.</p>}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400">Actualiza cada 5s. Promedio de 5 min por paciente para la estimación.</p>
    </div>
  );
}
