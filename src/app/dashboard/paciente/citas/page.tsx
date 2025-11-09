"use client";
import React, { useEffect, useState } from "react";
import AppointmentStatusBadge from "@/components/ui/AppointmentStatusBadge";
import { listAppointmentsByPatient, confirmAppointment, completeAppointment, markNoShowAppointment } from "@/app/servicios/appointment.service";
import type { AppointmentDTO, AppointmentStatus } from "@/types/appointment";
import { getAuthTokenClient } from "@/lib/getAuthToken";
import { useToast } from "@/components/ui/ToastProvider";

// Asumimos que el patientId se recupera de algún contexto/session; mientras tanto lo derivamos del token decodificado en futuro.
// Para esta versión usamos un input manual si no hay id.

export default function MisCitasPage() {
  const [patientId, setPatientId] = useState<string>("");
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  // filtros y paginación client-side
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Obtener patientId automáticamente desde session.user.id (si el rol es paciente) mediante token decodificado simple
  useEffect(() => {
    if (!patientId) {
      try {
        const raw = getAuthTokenClient();
        if (raw) {
          const payloadBase64 = raw.split('.')[1];
          if (payloadBase64) {
            const json = JSON.parse(atob(payloadBase64));
            // asumiendo que el token trae sub como id de usuario/paciente
            if (json.sub) setPatientId(String(json.sub));
            // si trae patientId explícito también lo tomamos
            if (json.patientId) setPatientId(String(json.patientId));
          }
        }
      } catch {}
    }
    if (!patientId) return; // aún no lo tenemos
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const data = await listAppointmentsByPatient(patientId);
        setAppointments(data);
        setPage(1);
      } catch (e: any) {
        setError(e.message || 'Error cargando citas');
        showToast(e.message || 'Error cargando citas', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const handleConfirm = async (id: string) => {
    setActionLoading(id);
    try {
      const updated = await confirmAppointment(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status as AppointmentStatus } : a));
      showToast('Cita confirmada', 'success');
    } catch (e: any) {
      setError(e.message || 'Error confirmando cita');
      showToast(e.message || 'Error confirmando cita', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id: string) => {
    setActionLoading(id);
    try {
      const updated = await completeAppointment(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status as AppointmentStatus } : a));
      showToast('Cita marcada como completada', 'success');
    } catch (e: any) {
      setError(e.message || 'Error completando la cita');
      showToast(e.message || 'Error completando la cita', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkNoShow = async (id: string) => {
    setActionLoading(id);
    try {
      const updated = await markNoShowAppointment(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status as AppointmentStatus } : a));
      showToast('Cita marcada como No-Show', 'warning');
    } catch (e: any) {
      setError(e.message || 'Error marcando No-Show');
      showToast(e.message || 'Error marcando No-Show', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mis Citas</h1>
      <p className="text-gray-600">Consulta y gestiona el estado de tus citas médicas.</p>

      {/* Ya no se requiere que el paciente escriba el ID manualmente */}
      {!patientId && (
        <p className="text-sm text-gray-500">Derivando identificador de paciente...</p>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)} className="border px-3 py-2 rounded">
            <option value="all">Todos</option>
            <option value="scheduled">Programada</option>
            <option value="confirmed">Confirmada</option>
            <option value="in_progress">En curso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Desde</label>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hasta</label>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="border px-3 py-2 rounded" />
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Cargando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {(() => {
        // aplicar filtros client-side
        const filtered = appointments.filter(a => {
          if (statusFilter !== 'all' && a.status !== statusFilter) return false;
          if (dateFrom && a.date && new Date(a.date) < new Date(dateFrom)) return false;
          if (dateTo && a.date && new Date(a.date) > new Date(dateTo + 'T23:59:59')) return false;
          return true;
        });
        const total = filtered.length;
        const start = (page-1)*pageSize;
        const paged = filtered.slice(start, start+pageSize);

        return (
          <>
            <div className="space-y-3">
              {total === 0 && !loading && (
          <p className="text-gray-500 text-sm">No hay citas para mostrar.</p>
              )}
              {paged.map(appt => (
          <div key={appt.id} className="border rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Cita #{appt.id}</span>
                <AppointmentStatusBadge status={appt.status} />
              </div>
              {appt.date && <div className="text-sm text-gray-600">{new Date(appt.date).toLocaleString()}</div>}
              {appt.doctorName && <div className="text-sm">{appt.doctorName}</div>}
            </div>
            <div className="flex gap-2">
              {appt.status === 'scheduled' && (
                <button
                  disabled={actionLoading === appt.id}
                  onClick={() => handleConfirm(appt.id)}
                  className="bg-green-600 disabled:opacity-60 text-white px-3 py-2 rounded hover:bg-green-700"
                >
                  {actionLoading === appt.id ? 'Confirmando...' : 'Confirmar'}
                </button>
              )}
              {/* Acciones adicionales: completar, marcar no-show */}
              {appt.status === 'in_progress' && (
                <button
                  disabled={actionLoading === appt.id}
                  onClick={() => handleComplete(appt.id)}
                  className="bg-blue-600 disabled:opacity-60 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  {actionLoading === appt.id ? 'Procesando...' : 'Completar'}
                </button>
              )}

              {(appt.status === 'scheduled' || appt.status === 'confirmed') && (
                <button
                  disabled={actionLoading === appt.id}
                  onClick={() => handleMarkNoShow(appt.id)}
                  className="bg-orange-600 disabled:opacity-60 text-white px-3 py-2 rounded hover:bg-orange-700"
                >
                  {actionLoading === appt.id ? 'Procesando...' : 'Marcar No-Show'}
                </button>
              )}
            </div>
          </div>
              ))}
            </div>
            {/* paginación */}
            {total > pageSize && (
              <div className="flex items-center gap-2 mt-4">
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
                <span className="text-sm">Página {page} de {Math.ceil(total/pageSize)}</span>
                <button disabled={start+pageSize>=total} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Siguiente</button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
