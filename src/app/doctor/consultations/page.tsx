"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { listAppointmentsByDoctor } from '@/app/servicios/appointment.service';
import ConsultationCard from '@/components/ConsultationCard';

export default function DoctorConsultationsPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (status === 'loading') return;
      
      setLoading(true);
      try {
        // Obtener doctorId del token JWT
        const raw = (typeof window !== 'undefined') 
          ? (sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token')) 
          : null;
        
        if (!raw) {
          setError('No se encontró token de autenticación. Por favor, inicie sesión nuevamente.');
          setLoading(false);
          return;
        }

        const payloadBase64 = raw.split('.')[1];
        if (!payloadBase64) {
          setError('Token inválido. Por favor, inicie sesión nuevamente.');
          setLoading(false);
          return;
        }

        const json = JSON.parse(atob(payloadBase64));
        
        // Intentar obtener el ID del doctor de diferentes formas
        const doctorId = json.sub || json.id || json.userId;
        
        console.log('Token decodificado:', json);
        console.log('Doctor ID obtenido:', doctorId);

        if (!doctorId) {
          setError('No se pudo obtener el ID del doctor del token. Token: ' + JSON.stringify(json));
          setLoading(false);
          return;
        }

        // Cargar citas del doctor
        const list = await listAppointmentsByDoctor(String(doctorId));
        
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
        const msg = e instanceof Error ? e.message : 'Error cargando citas';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [status]);

  const refreshAppointments = async () => {
    setLoading(true);
    try {
      const raw = (typeof window !== 'undefined') 
        ? (sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token')) 
        : null;
      
      if (!raw) {
        setError('No se encontró token de autenticación');
        return;
      }

      const payloadBase64 = raw.split('.')[1];
      const json = JSON.parse(atob(payloadBase64));
      const doctorId = json.sub || json.id || json.userId;

      if (!doctorId) {
        setError('No se pudo obtener el ID del doctor');
        return;
      }

      const list = await listAppointmentsByDoctor(String(doctorId));
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
      const msg = e instanceof Error ? e.message : 'Error cargando citas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Citas diarias</h1>
        <button
          onClick={refreshAppointments}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div>Cargando citas...</div>}
      {!loading && appointments.length === 0 && !error && (
        <div className="text-gray-600">
          No hay citas para hoy. Las citas creadas aparecerán aquí automáticamente.
        </div>
      )}

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
