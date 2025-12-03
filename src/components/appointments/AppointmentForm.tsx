"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAppointment, updateAppointment, fetchDoctors, fetchSpecializations, type DoctorDTO, type SpecializationDTO, type UpsertAppointmentPayload, getAppointmentById } from '@/app/servicios/appointment.service';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter, useParams } from 'next/navigation';

const schema = z.object({
  date: z.string().min(1, 'Fecha requerida'),
  doctorId: z.string().min(1, 'Doctor requerido'),
  specializationId: z.string().optional(),
  patientId: z.string().min(1, 'ID de paciente requerido'),
  reason: z.string().min(1, 'Motivo requerido').max(500, 'Máximo 500 caracteres'),
});

export type AppointmentFormValues = z.infer<typeof schema>;

interface Props {
  mode: 'create' | 'edit';
}

export default function AppointmentForm({ mode }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const appointmentId = mode === 'edit' ? String(params?.id) : undefined;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { date: '', doctorId: '', specializationId: '', reason: '' }
  });
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [specializations, setSpecializations] = useState<SpecializationDTO[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // cargar catálogos
  useEffect(()=>{
    let cancelled = false;
    const loadRefs = async () => {
      setLoadingRefs(true);
      try {
        const [d, s] = await Promise.allSettled([fetchDoctors(), fetchSpecializations()]);
        if (!cancelled) {
          if (d.status === 'fulfilled') setDoctors(d.value);
          if (s.status === 'fulfilled') setSpecializations(s.value);
        }
      } catch {}
      finally { if (!cancelled) setLoadingRefs(false); }
    };
    loadRefs();
    return () => { cancelled = true; };
  }, []);

  // cargar datos al editar
  useEffect(()=>{
    if (mode !== 'edit' || !appointmentId) return;
    let cancelled = false;
    const load = async () => {
      setLoadingData(true);
      try {
        const appt = await getAppointmentById(appointmentId);
        if (!cancelled) {
          reset({
            date: appt.date ? appt.date.slice(0,16) : '',
            doctorId: appt.doctorId || '',
            reason: '', // TODO: mapear si viene del backend
            specializationId: undefined,
            patientId: appt.patientId,
          });
        }
      } catch(e:any) {
        showToast(e.message || 'Error cargando cita', 'error');
      } finally { if (!cancelled) setLoadingData(false); }
    }; load();
    return () => { cancelled = true; };
  }, [mode, appointmentId, reset]);

  const onSubmit = async (values: AppointmentFormValues) => {
    const payload: UpsertAppointmentPayload = {
      date: values.date,
      doctorId: values.doctorId,
      specializationId: values.specializationId || undefined,
      patientId: values.patientId || undefined,
      reason: values.reason || undefined,
    };
    try {
      if (mode === 'create') {
        await createAppointment(payload);
        showToast('Cita creada', 'success');
      } else if (appointmentId) {
        await updateAppointment(appointmentId, payload);
        showToast('Cita actualizada', 'success');
      }
      router.push('/dashboard/appointments');
    } catch(e:any) {
      showToast(e.message || 'Error guardando cita', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-xl'>
      <div>
        <label className='block text-sm font-medium mb-1'>Fecha y hora</label>
        <input type='datetime-local' className='border px-3 py-2 rounded w-full' {...register('date')} />
        {errors.date && <p className='text-xs text-red-600'>{errors.date.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Doctor</label>
        <select className='border px-3 py-2 rounded w-full' {...register('doctorId')}>
          <option value=''>Seleccione...</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.fullname}</option>)}
        </select>
        {errors.doctorId && <p className='text-xs text-red-600'>{errors.doctorId.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Especialidad</label>
        <select className='border px-3 py-2 rounded w-full' {...register('specializationId')}>
          <option value=''>--</option>
          {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Paciente ID</label>
        <input type='text' placeholder='Ej: 5' className='border px-3 py-2 rounded w-full' {...register('patientId')} />
        {errors.patientId && <p className='text-xs text-red-600'>{errors.patientId.message}</p>}
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Motivo de la consulta</label>
        <textarea className='border px-3 py-2 rounded w-full' rows={4} {...register('reason')} />
        {errors.reason && <p className='text-xs text-red-600'>{errors.reason.message}</p>}
      </div>
      <div className='flex gap-3 pt-2'>
        <button disabled={isSubmitting} type='submit' className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60'>
          {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Crear' : 'Guardar Cambios')}
        </button>
        <button type='button' onClick={()=>router.back()} className='border px-4 py-2 rounded hover:bg-gray-50'>Cancelar</button>
      </div>
      {(loadingRefs || loadingData) && <p className='text-xs text-gray-500'>Cargando referencias...</p>}
    </form>
  );
}
