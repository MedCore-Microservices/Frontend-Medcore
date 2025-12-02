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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [manualId, setManualId] = useState('');
  const [useManualId, setUseManualId] = useState(false);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [priority, setPriority] = useState<OrderPriority>('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar pacientes cuando el usuario escribe
  useEffect(() => {
    if (searchPatient.length < 2) {
      setPatients([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingPatients(true);
      try {
        const token = getAuthTokenClient();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
        const response = await fetch(
          `${API_URL}/patients/search/advanced?search=${encodeURIComponent(searchPatient)}&limit=10`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.ok) {
          const result = await response.json();
          setPatients(result.data || []);
        } else {
          console.error('Error searching patients:', await response.text());
        }
      } catch (err) {
        console.error('Error searching patients:', err);
      } finally {
        setLoadingPatients(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchPatient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPatientId: number | null = null;
    
    if (useManualId) {
      const parsed = parseInt(manualId);
      if (!manualId || isNaN(parsed) || parsed <= 0) {
        setError('Ingresa un ID de paciente válido (número mayor a 0)');
        return;
      }
      finalPatientId = parsed;
    } else {
      if (!selectedPatientId) {
        setError('Selecciona un paciente de la búsqueda');
        return;
      }
      finalPatientId = selectedPatientId;
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
        patientId: finalPatientId,
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

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

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
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Paciente *</label>
            <button
              type="button"
              onClick={() => {
                setUseManualId(!useManualId);
                setSelectedPatientId(null);
                setSearchPatient('');
                setManualId('');
                setPatients([]);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {useManualId ? '← Buscar paciente' : 'Ingresar ID manualmente →'}
            </button>
          </div>
          
          {!useManualId ? (
            <>
              <input
                type="text"
                value={searchPatient}
                onChange={e => setSearchPatient(e.target.value)}
                placeholder="Buscar por nombre o documento..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {loadingPatients && <p className="text-sm text-gray-500">Buscando...</p>}
              {patients.length > 0 && !selectedPatientId && (
                <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                  {patients.map(patient => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setSearchPatient(patient.fullname);
                        setPatients([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    >
                      <div className="font-medium">{patient.fullname}</div>
                      {patient.identificationNumber && (
                        <div className="text-xs text-gray-500">CC: {patient.identificationNumber}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {selectedPatient && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded">
                  <div>
                    <div className="font-medium text-blue-900">{selectedPatient.fullname}</div>
                    {selectedPatient.identificationNumber && (
                      <div className="text-xs text-blue-700">CC: {selectedPatient.identificationNumber}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(null);
                      setSearchPatient('');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <input
                type="number"
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                placeholder="ID del paciente (ej: 1, 2, 3...)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {manualId && (
                <div className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded text-sm text-yellow-800">
                  Se creará la orden para el paciente con ID: <strong>{manualId}</strong>
                </div>
              )}
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
