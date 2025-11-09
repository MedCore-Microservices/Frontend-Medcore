"use client";
import React, { useEffect, useState } from 'react';
import { getAppointmentById, updateAppointment, deleteAppointment } from '@/app/servicios/appointment.service';
import { useParams, useRouter } from 'next/navigation';
import type { AppointmentDTO } from '@/types/appointment';
import AppointmentStatusBadge from '@/components/ui/AppointmentStatusBadge';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';

export default function AppointmentDetailPage() {
  const params = useParams();
  const id = String(params?.id);
  const { showToast } = useToast();
  const router = useRouter();
  const [appt, setAppt] = useState<AppointmentDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentById(id);
        setAppt(data);
      } catch(e:any) {
        showToast(e.message || 'Error cargando cita', 'error');
      } finally { setLoading(false); }
    }; load();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteAppointment(id);
      showToast('Cita eliminada', 'success');
      router.push('/dashboard/appointments');
    } catch(e:any) {
      showToast(e.message || 'Error eliminando cita', 'error');
    }
  };

  if (loading) return <div className='p-6'>Cargando...</div>;
  if (!appt) return <div className='p-6 text-sm text-gray-500'>No encontrada.</div>;

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Cita #{appt.id}</h1>
        <Link href={`/dashboard/appointments/${id}/edit`} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>Editar</Link>
      </div>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>Estado: <AppointmentStatusBadge status={appt.status} /></div>
        {appt.date && <div>Fecha: {new Date(appt.date).toLocaleString()}</div>}
        {appt.doctorName && <div>Médico: {appt.doctorName}</div>}
        {appt.patientName && <div>Paciente: {appt.patientName}</div>}
      </div>
      <div className='pt-4 border-t'>
        {!confirmDelete && (
          <button onClick={()=>setConfirmDelete(true)} className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>Eliminar</button>
        )}
        {confirmDelete && (
          <div className='space-y-3'>
            <p className='text-sm'>¿Seguro que deseas eliminar esta cita? Esta acción no se puede deshacer.</p>
            <div className='flex gap-2'>
              <button onClick={handleDelete} className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>Confirmar</button>
              <button onClick={()=>setConfirmDelete(false)} className='border px-4 py-2 rounded hover:bg-gray-50'>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
