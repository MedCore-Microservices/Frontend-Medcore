"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getAppointmentById, startAppointment, completeAppointment } from '@/app/servicios/appointment.service';
import ConsultationForm from '@/components/ConsultationForm';
import ClinicalNotes from '@/components/ClinicalNotes';
import PatientVitals from '@/components/PatientVitals';

export default function ConsultationDetailClient({ id }: { id: string }) {
  const { data: session } = useSession();
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
        setError(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error cargando consulta');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStart() {
    try {
      await startAppointment(id);
      const appt = await getAppointmentById(id);
      setAppointment(appt);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error iniciando atención');
    }
  }

  async function handleComplete() {
    try {
      await completeAppointment(id);
      router.push(`/doctor/consultation/${id}/complete`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error completando consulta');
    }
  }

  if (loading) return <div className="p-6">Cargando consulta...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!appointment) return <div className="p-6">Consulta no encontrada.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consulta: {appointment.patientName || `Paciente ${appointment.patientId}`}</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-md bg-green-600 text-white" onClick={handleStart}>Iniciar atención</button>
          <button className="px-3 py-2 rounded-md bg-blue-600 text-white" onClick={handleComplete}>Finalizar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ConsultationForm onSuccess={(res) => console.log('consulta guardada', res)} />
          <ClinicalNotes value={appointment.notes || ''} onChange={(html) => console.log('notes', html)} />
        </div>

        <div className="space-y-4">
          <PatientVitals onSuccess={(res) => console.log('vitals saved', res)} />
        </div>
      </div>
    </div>
  );
}
