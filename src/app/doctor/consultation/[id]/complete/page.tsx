"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAppointmentById, completeAppointment } from '@/app/servicios/appointment.service';

export default function ConsultationCompletePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [appointment, setAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const appt = await getAppointmentById(id);
        setAppointment(appt);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error cargando consulta');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleClose() {
    try {
      await completeAppointment(id);
      router.push('/doctor/consultations');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error cerrando consulta');
    }
  }

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!appointment) return <div className="p-6">Consulta no encontrada.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resumen de consulta</h1>
      <div className="bg-white rounded shadow p-4 space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">Paciente</div>
          <div className="font-medium">{appointment.patientName || `Paciente ${appointment.patientId}`}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Fecha</div>
          <div className="font-medium">{appointment.date ? new Date(appointment.date).toLocaleString() : '—'}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Motivo</div>
          <div className="font-medium">{appointment.reason || appointment.clinicalNotes || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Estado</div>
          <div className="font-medium">{appointment.status}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 rounded-md bg-blue-600 text-white" onClick={handleClose}>Confirmar cierre</button>
        <button className="px-4 py-2 rounded-md border" onClick={() => router.push(`/doctor/consultation/${id}`)}>Volver</button>
      </div>
    </div>
  );
}
