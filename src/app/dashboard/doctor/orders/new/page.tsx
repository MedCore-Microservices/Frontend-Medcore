"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrderTypeSelector from '@/components/medical-orders/OrderTypeSelector';
import LabTestSelector from '@/components/medical-orders/LabTestSelector';
import RadiologyExamSelector from '@/components/medical-orders/RadiologyExamSelector';
import { createLaboratoryOrder, createRadiologyOrder } from '@/app/servicios/medical-order.service';
import { getAuthTokenClient } from '@/lib/getAuthToken';
import type { OrderType, OrderPriority } from '@/types/medical-order';

interface Patient {
  id: number;
  fullname: string;
  identificationNumber?: string;
}

export default function NewOrderPageDirect() {
  const router = useRouter();
  const [manualId, setManualId] = useState('');
  const [manualPatientInfo, setManualPatientInfo] = useState<Patient | null>(null);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [priority, setPriority] = useState<OrderPriority>('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar información del paciente cuando se ingresa el ID
  useEffect(() => {
    const parsed = parseInt(manualId);
    if (!manualId || isNaN(parsed) || parsed <= 0) {
      setManualPatientInfo(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const token = getAuthTokenClient();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
        const response = await fetch(`${API_URL}/patients/${parsed}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const result = await response.json();
          setManualPatientInfo(result.patient);
        } else {
          setManualPatientInfo(null);
        }
      } catch (err) {
        console.error('Error fetching patient:', err);
        setManualPatientInfo(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [manualId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsed = parseInt(manualId);
    if (!manualId || isNaN(parsed) || parsed <= 0) {
      setError('Ingresa un ID de paciente válido (número mayor a 0)');
      return;
    }
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
        patientId: parsed,
        priority,
        clinicalNotes: clinicalNotes.trim() || undefined,
        requestedTests: selectedTests,
      };

      if (orderType === 'laboratory') {
        await createLaboratoryOrder(payload);
      } else {
        await createRadiologyOrder(payload);
      }

      router.push('/dashboard/doctor/orders');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nueva Orden Médica</h2>
          <p className="text-sm text-gray-600 mt-1">Completa los datos para crear una nueva orden</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* Selector de Paciente */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">ID del Paciente *</label>
          <input
            type="number"
            value={manualId}
            onChange={e => setManualId(e.target.value)}
            placeholder="Ingresa el ID del paciente (ej: 36)"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {manualId && manualPatientInfo && (
            <div className="bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">
              <div className="font-medium text-green-900">
                ✓ Se creará la orden para:
              </div>
              <div className="text-green-800 mt-1 space-y-1">
                <div><strong>Nombre:</strong> {manualPatientInfo.fullname}</div>
                {manualPatientInfo.identificationNumber && (
                  <div><strong>Documento:</strong> {manualPatientInfo.identificationNumber}</div>
                )}
                <div><strong>ID:</strong> {manualPatientInfo.id}</div>
              </div>
            </div>
          )}
          {manualId && !manualPatientInfo && parseInt(manualId) > 0 && (
            <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Verificando paciente con ID: <strong>{manualId}</strong>...</span>
              </div>
            </div>
          )}
        </div>

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

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
