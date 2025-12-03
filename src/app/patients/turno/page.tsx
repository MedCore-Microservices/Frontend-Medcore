"use client";
import { useState, useEffect, useCallback } from 'react';
import { joinQueue, getPosition, estimateWaitTime, getQueueStats, type QueueStats } from '@/app/servicios/queue.service';

export default function PatientTurnoPage() {
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);

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

  // Actualizar estadísticas de la cola cuando se selecciona un doctor
  const refreshQueueStats = useCallback(async () => {
    if (!doctorId || ticketId) return; // Solo refrescar si no hay ticket aún
    try {
      const stats = await getQueueStats(Number(doctorId));
      setQueueStats(stats);
    } catch (e: unknown) {
      // Silenciar errores de stats para no interferir con la UX principal
      console.error('Error al obtener estadísticas de cola:', e);
    }
  }, [doctorId, ticketId]);

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    refreshQueueStats();
    const id = setInterval(refreshQueueStats, 3000); // Actualizar stats cada 3s
    return () => clearInterval(id);
  }, [refreshQueueStats]);

  async function handleJoin() {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await joinQueue(Number(doctorId));
      setTicketId(res.ticket.id);
      setPosition(res.position);
      setStatus(res.ticket.status);
      setQueueStats(null); // Limpiar stats después de unirse
    } catch (e:unknown) {
      if (e instanceof Error) {
      setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  }

  const etaMinutes = estimateWaitTime(position ? Math.max(0, position - 1) : 0, 5);
  const isQueueFull = queueStats?.isFull ?? false;
  const canJoin = !ticketId && doctorId && !loading && !isQueueFull;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Mi Turno</h1>
      {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-3">{error}</div>}
      
      <div className="bg-white rounded shadow p-4 space-y-3">
        <label className="block text-sm font-medium">ID del Médico</label>
        <input
          className="border rounded px-3 py-2 w-60"
          type="number"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Ej. 1"
          disabled={!!ticketId}
        />

        {/* Indicador de estado de la cola */}
        {doctorId && !ticketId && queueStats && (
          <div className={`p-3 rounded border ${
            queueStats.isFull 
              ? 'bg-red-50 border-red-300 text-red-800' 
              : queueStats.waiting >= 3 
                ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                : 'bg-green-50 border-green-300 text-green-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {queueStats.isFull ? '🚫 Cola llena' : `✅ ${queueStats.availableSlots} espacios disponibles`}
                </p>
                <p className="text-sm">
                  {queueStats.waiting} de {queueStats.maxCount} personas en espera
                </p>
              </div>
              {queueStats.isFull && (
                <div className="text-xs bg-red-100 px-2 py-1 rounded">
                  Intenta más tarde
                </div>
              )}
            </div>
          </div>
        )}

        {!ticketId ? (
          <button 
            onClick={handleJoin} 
            disabled={!canJoin} 
            className={`px-4 py-2 rounded font-medium transition ${
              canJoin 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={isQueueFull ? 'La cola está llena (máximo 5 personas)' : 'Unirme a la cola'}
          >
            {loading ? 'Uniendo...' : isQueueFull ? 'Cola llena' : 'Unirme a la cola'}
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
      <div className="text-xs text-gray-400 space-y-1">
        <p>• Se actualiza cada 3-5 segundos automáticamente</p>
        <p>• Promedio de 5 minutos por paciente para la estimación</p>
        <p>• Máximo 5 personas en cola simultáneamente</p>
      </div>
    </div>
  );
}
