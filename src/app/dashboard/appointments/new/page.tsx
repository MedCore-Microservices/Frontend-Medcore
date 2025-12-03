"use client";
import React from 'react';
import AppointmentForm from '@/components/appointments/AppointmentForm';

export default function NewAppointmentPage() {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Crear cita</h1>
      <AppointmentForm mode='create' />
    </div>
  );
}
