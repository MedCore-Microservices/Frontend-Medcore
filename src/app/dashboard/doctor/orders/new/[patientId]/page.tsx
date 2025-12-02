"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import OrderForm from '@/components/medical-orders/OrderForm';

export default function NewOrderPage() {
  const params = useParams();
  const patientId = params.patientId ? Number(params.patientId) : null;
  const [patientName, setPatientName] = useState<string>('');

  useEffect(() => {
    // En producción, aquí harías una llamada para obtener datos del paciente
    // Por ahora usamos un placeholder
    if (patientId) {
      setPatientName(`Paciente #${patientId}`);
    }
  }, [patientId]);

  if (!patientId) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          ID de paciente inválido
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <OrderForm
        patientId={patientId}
        patientName={patientName}
        onCancel={() => window.history.back()}
      />
    </div>
  );
}
