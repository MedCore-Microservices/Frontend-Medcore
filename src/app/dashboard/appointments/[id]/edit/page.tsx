"use client";
import React from 'react';
import AppointmentForm from '@/components/appointments/AppointmentForm';

export default function EditAppointmentPage() {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Editar Cita</h1>
      <AppointmentForm mode='edit' />
    </div>
  );
}
