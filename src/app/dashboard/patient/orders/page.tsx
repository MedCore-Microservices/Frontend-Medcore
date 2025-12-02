"use client";
import React, { useEffect, useState } from 'react';
import { getOrdersByPatient } from '@/app/servicios/medical-order.service';
import { FlaskConical, X, Calendar, FileText } from 'lucide-react';
import { getAuthTokenClient } from '@/lib/getAuthToken';
import type { MedicalOrderDTO, OrderType } from '@/types/medical-order';

const getOrderTypeIcon = (type: OrderType) => {
  return type === 'laboratory' ? (
    <FlaskConical className="w-5 h-5 text-blue-600" />
  ) : (
    <X className="w-5 h-5 text-purple-600" />
  );
};

const getPriorityBadge = (priority: string) => {
  const styles = {
    routine: 'bg-gray-100 text-gray-800',
    urgent: 'bg-orange-100 text-orange-800',
    stat: 'bg-red-100 text-red-800',
  };
  const labels = {
    routine: 'Rutina',
    urgent: 'Urgente',
    stat: 'STAT',
  };
  return { style: styles[priority as keyof typeof styles] || styles.routine, label: labels[priority as keyof typeof labels] || priority };
};

const getStatusBadge = (status: string) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  const labels = {
    pending: 'Pendiente',
    in_progress: 'En Proceso',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };
  return { style: styles[status as keyof typeof styles] || styles.pending, label: labels[status as keyof typeof labels] || status };
};

export default function PatientOrdersPage() {
  const [orders, setOrders] = useState<MedicalOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);

  useEffect(() => {
    // Derivar patientId del token
    const token = getAuthTokenClient();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const b64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
          const json = JSON.parse(atob(b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=')));
          // En el token de paciente, el ID viene como 'id' o 'userId'
          const id = json.id || json.userId || json.sub;
          setPatientId(id ? Number(id) : null);
        }
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!patientId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrdersByPatient(patientId);
        setOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  if (!patientId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          No se pudo determinar tu ID de paciente. Por favor, inicia sesión nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Órdenes Médicas</h1>
        <p className="text-sm text-gray-600 mt-1">Consulta tus órdenes de laboratorio y radiología</p>
      </div>

      {loading && <div className="text-sm text-gray-500">Cargando órdenes...</div>}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {orders.length === 0 && !loading && (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No tienes órdenes médicas registradas
          </div>
        )}
        {orders.map(order => {
          const priorityBadge = getPriorityBadge(order.priority);
          const statusBadge = getStatusBadge(order.status);
          return (
            <div key={order.id} className="bg-white shadow rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getOrderTypeIcon(order.type)}
                  <div>
                    <div className="font-semibold text-gray-900">Orden #{order.id}</div>
                    <div className="text-sm text-gray-600">
                      {order.type === 'laboratory' ? 'Laboratorio' : 'Radiología'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${priorityBadge.style}`}>
                    {priorityBadge.label}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${statusBadge.style}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">Solicitada: {new Date(order.requestedAt).toLocaleString()}</span>
              </div>

              {order.requestedByName && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Solicitada por: </span>
                  <span className="text-gray-600">{order.requestedByName}</span>
                </div>
              )}

              {order.clinicalNotes && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Indicaciones: </span>
                  <span className="text-gray-600">{order.clinicalNotes}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {Array.isArray(order.tests) ? order.tests.length : 0} examen{Array.isArray(order.tests) && order.tests.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {Array.isArray(order.tests) && order.tests.length > 0 && (
                <div className="mt-2 border-t pt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Exámenes solicitados:</div>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    {order.tests.map((test: { code: string; name?: string }, idx: number) => (
                      <li key={idx}>{test.name || test.code}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
