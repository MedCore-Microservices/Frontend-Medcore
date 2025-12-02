"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderTypeSelector from './OrderTypeSelector';
import LabTestSelector from './LabTestSelector';
import RadiologyExamSelector from './RadiologyExamSelector';
import { createLaboratoryOrder, createRadiologyOrder } from '@/app/servicios/medical-order.service';
import type { OrderType, OrderPriority } from '@/types/medical-order';

interface OrderFormProps {
  patientId: number;
  patientName?: string;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

export default function OrderForm({ patientId, patientName, onSuccess, onCancel }: OrderFormProps) {
  const router = useRouter();
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [priority, setPriority] = useState<OrderPriority>('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderType) {
      setError('Selecciona un tipo de orden');
      return;
    }
    if (selectedTests.length === 0) {
      setError('Selecciona al menos un examen');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        patientId,
        priority,
        clinicalNotes: clinicalNotes.trim() || undefined,
        requestedTests: selectedTests,
      };

      let result;
      if (orderType === 'laboratory') {
        result = await createLaboratoryOrder(payload);
      } else {
        result = await createRadiologyOrder(payload);
      }

      if (onSuccess) {
        onSuccess(result.id);
      } else {
        router.push('/dashboard/doctor/orders');
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Nueva Orden Médica</h2>
        {patientName && <p className="text-sm text-gray-600 mt-1">Paciente: {patientName}</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <OrderTypeSelector selected={orderType} onSelect={setOrderType} />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Prioridad</label>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as OrderPriority)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="routine">Rutina</option>
          <option value="urgent">Urgente</option>
          <option value="stat">STAT (Inmediato)</option>
        </select>
      </div>

      {orderType === 'laboratory' && (
        <LabTestSelector selectedCodes={selectedTests} onChange={setSelectedTests} />
      )}

      {orderType === 'radiology' && (
        <RadiologyExamSelector selectedCodes={selectedTests} onChange={setSelectedTests} />
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Notas Clínicas (Opcional)</label>
        <textarea
          value={clinicalNotes}
          onChange={e => setClinicalNotes(e.target.value)}
          rows={4}
          placeholder="Indicaciones, síntomas relevantes, etc."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !orderType || selectedTests.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Creando...' : 'Crear Orden'}
        </button>
      </div>
    </form>
  );
}
