"use client";
import React, { useEffect, useState } from 'react';
import { listAppointmentsByDoctor, listAppointmentsByPatient, listAppointmentsAll } from '@/app/servicios/appointment.service';
import AppointmentStatusBadge from '@/components/ui/AppointmentStatusBadge';
import type { AppointmentDTO } from '@/types/appointment';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import AppointmentsCalendar from '@/components/appointments/AppointmentsCalendar';

// Vista general de citas (admin/doctor/paciente). Filtra por rol.
export default function AppointmentsListPage() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const [role, setRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(()=>{
    // Decodificar token para rol e id usuario
    try {
      const raw = (typeof window !== 'undefined') ? (sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token')) : null;
      if (raw) {
        const payloadBase64 = raw.split('.')[1];
        if (payloadBase64) {
          const json = JSON.parse(atob(payloadBase64));
          if (json.role) setRole(String(json.role).toLowerCase());
          if (json.sub) setUserId(String(json.sub));
        }
      }
    } catch {}
  }, []);

  useEffect(()=>{
    if (!userId) return;
    const load = async () => {
      setLoading(true); setError(undefined);
      try {
        let data: AppointmentDTO[] = [];
        if (role === 'medico' || role === 'doctor') {
          data = await listAppointmentsByDoctor(userId);
        } else if (role === 'paciente' || role === 'patient') {
          data = await listAppointmentsByPatient(userId);
        } else {
          // Rol admin u otro: intentar cargar todas
          try {
            data = await listAppointmentsAll();
          } catch {
            // fallback (si no hay endpoint general): usar por paciente
            data = await listAppointmentsByPatient(userId);
          }
        }
        setAppointments(data);
      } catch(e:any) {
        setError(e.message || 'Error cargando citas');
        showToast(e.message || 'Error cargando citas', 'error');
      } finally { setLoading(false); }
    }; load();
  }, [role, userId]);

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Citas</h1>
        <Link href='/dashboard/appointments/new' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>Nueva Cita</Link>
      </div>
      {loading && <p className='text-sm text-gray-500'>Cargando...</p>}
      {error && <p className='text-sm text-red-600'>{error}</p>}
      <div className='space-y-6'>
        <AppointmentsCalendar appointments={appointments} />
        <div className='h-px bg-gray-200' />
        <h2 className='text-lg font-semibold'>Listado</h2>
        <div className='space-y-3'>
        {appointments.map(a => (
          <Link key={a.id} href={`/dashboard/appointments/${a.id}`} className='block border rounded p-4 hover:bg-gray-50'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>Cita #{a.id}</span>
              <AppointmentStatusBadge status={a.status} />
            </div>
            {a.date && <div className='text-sm text-gray-600'>{new Date(a.date).toLocaleString()}</div>}
            {a.doctorName && <div className='text-sm'>{a.doctorName}</div>}
            {a.patientName && <div className='text-sm'>{a.patientName}</div>}
          </Link>
        ))}
        {(!loading && appointments.length === 0) && <p className='text-sm text-gray-500'>No hay citas registradas.</p>}
        </div>
      </div>
    </div>
  );
}
