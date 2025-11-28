"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { listAppointmentsByDoctor } from '@/app/servicios/appointment.service';
import ConsultationCard from '@/components/ConsultationCard';

export default function DoctorConsultationsPage() {
  const { data: session, status } = useSession();
  const doctorId = session?.user?.id ? String(session.user.id) : undefined;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (!doctorId) {
          setError('No se detectó doctorId en la sesión');
          setAppointments([]);
          return;
        }
        const list = await listAppointmentsByDoctor(doctorId);
        // Filtrar por fecha de hoy
        const today = new Date();
        const isSameDay = (d?: string) => {
          if (!d) return false;
          const dt = new Date(d);
          return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && dt.getDate() === today.getDate();
        };
        const todays = list.filter((a: any) => isSameDay(a.date));
        setAppointments(todays || []);
        setError(null);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error cargando consultas';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    if (status !== 'loading') load();
  }, [doctorId, status]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Consultas del día</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div>Cargando...</div>}
      {!loading && appointments.length === 0 && <div>No hay consultas para hoy.</div>}

      <div className="space-y-3">
        {appointments.map((a) => (
          <Link key={a.id} href={`/doctor/consultation/${a.id}`}>
            <ConsultationCard consultation={{ id: a.id, patientName: a.patientName || a.patient?.fullname, date: a.date, reason: a.reason || a.clinicalNotes, status: a.status }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
