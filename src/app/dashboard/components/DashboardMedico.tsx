"use client";
import Link from "next/link";
import AppointmentStatusBadge from "@/components/ui/AppointmentStatusBadge";
import QuickActions from "@/app/dashboard/components/QuickActions";
import { useEffect, useState } from "react";
import { getAuthTokenClient } from '@/lib/getAuthToken';
import { listAppointmentsByDoctor, startAppointment, completeAppointment, markNoShowAppointment, cancelAppointment } from "@/app/servicios/appointment.service";
import type { AppointmentDTO, AppointmentStatus } from "@/types/appointment";

function decodeDoctorIdFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = getAuthTokenClient();
  if (!raw) return null;
  try {
    const payload = raw.split('.')[1];
    if (!payload) return null;
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '='));
    const data = JSON.parse(json);
    // En nuestros tokens suele venir userId (id de usuario). Para médicos coincide con doctorId.
    const id = data.doctorId ?? data.userId ?? data.sub;
    return id != null ? String(id) : null;
  } catch { return null; }
}

export default function DashboardMedico() {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debug, setDebug] = useState<{ token?: string|null; derivedDoctorId?: string|null }>({});

  useEffect(() => {
    if (!doctorId) {
      const derived = decodeDoctorIdFromToken();
      setDebug(prev => ({ ...prev, token: (typeof window!=='undefined') ? localStorage.getItem('auth_token') : null, derivedDoctorId: derived }));
      setDoctorId(derived);
      return;
    }
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const data = await listAppointmentsByDoctor(doctorId);
        setAppointments(data);
      } catch (e: any) {
        setError(e.message || 'Error cargando citas del médico');
      } finally { setLoading(false); }
    };
    load();
  }, [doctorId]);

  async function runAction(action: 'start' | 'complete' | 'no_show' | 'cancel', id: string) {
    setActionId(id); setError(null); setSuccess(null);
    try {
      let updated: any;
      switch(action){
        case 'start': updated = await startAppointment(id); break;
        case 'complete': updated = await completeAppointment(id); break;
        case 'no_show': updated = await markNoShowAppointment(id); break;
        case 'cancel': updated = await cancelAppointment(id); break;
      }
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status as AppointmentStatus } : a));
      setSuccess(`Acción '${action}' aplicada`);
    } catch(e: any){
      setError(e.message || 'Acción fallida');
    } finally { setActionId(null); }
  }

  return (
    <div className="space-y-6 px-3 sm:px-0">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Médico</h2>
        <p className="text-gray-600">Gestión de pacientes y consultas</p>
        {/* Acceso directo a Cola de Pacientes */}
        <div className="mt-4">
          <Link
            href="/dashboard/queue"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition shadow-sm"
          >
            <span>Gestionar Cola (Turnos)</span>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900">Citas Pendientes</h3>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-green-900">Pacientes Hoy</h3>
          <p className="text-2xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-purple-900">Urgencias</h3>
          <p className="text-2xl font-bold text-purple-600">2</p>
        </div>
      </div>

      {/* Acciones rápidas y Cola de Pacientes movidas más abajo */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="mb-4">
          <QuickActions />
        </div>
        <div>
          <Link
            href="/dashboard/queue"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition shadow-sm"
          >
            <span>Gestionar Cola (Turnos)</span>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Citas</h3>
        {/* DEBUG temporal para diagnóstico */}
        <details className="mb-2 text-xs text-gray-600">
          <summary>Ver depuración</summary>
          <div className="mt-2 space-y-1">
            <div><b>doctorId derivado:</b> {String(doctorId || debug.derivedDoctorId || '')}</div>
            <div className="break-all"><b>token:</b> {(debug.token || '').slice(0,80)}...</div>
          </div>
        </details>
        {!doctorId && <p className="text-gray-500 text-sm">Derivando ID de médico...</p>}
        {loading && <p className="text-gray-500 text-sm">Cargando...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <div className="space-y-3">
          {appointments.length === 0 && !loading && doctorId && (
            <div className="text-gray-500 text-sm space-y-2">
              <p>No hay citas próximas para el médico {doctorId}.</p>
              <div className="flex items-end gap-2">
                <input value={doctorId || ''} onChange={e=>setDoctorId(e.target.value)} placeholder="Ingresar doctorId manual" className="border px-2 py-1 rounded" />
                <button className="px-3 py-1 border rounded" onClick={()=>setDoctorId(doctorId || '')}>Recargar</button>
              </div>
            </div>
          )}
          {appointments.map(appt => (
            <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">Cita #{appt.id}</span>
                <AppointmentStatusBadge status={appt.status} />
                {appt.date && <span className="text-sm text-gray-600">{new Date(appt.date).toLocaleString()}</span>}
                {appt.patientName && <span className="text-sm">Paciente: {appt.patientName}</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                {appt.status === 'scheduled' && (
                  <button disabled={actionId===appt.id} onClick={()=>runAction('start', appt.id)} className="bg-yellow-600 disabled:opacity-50 text-white px-3 py-1 rounded">Iniciar</button>
                )}
                {appt.status === 'confirmed' && (
                  <button disabled={actionId===appt.id} onClick={()=>runAction('start', appt.id)} className="bg-yellow-600 disabled:opacity-50 text-white px-3 py-1 rounded">Iniciar</button>
                )}
                {appt.status === 'in_progress' && (
                  <button disabled={actionId===appt.id} onClick={()=>runAction('complete', appt.id)} className="bg-green-600 disabled:opacity-50 text-white px-3 py-1 rounded">Completar</button>
                )}
                {(appt.status === 'scheduled' || appt.status === 'confirmed') && (
                  <button disabled={actionId===appt.id} onClick={()=>runAction('no_show', appt.id)} className="bg-orange-600 disabled:opacity-50 text-white px-3 py-1 rounded">No Show</button>
                )}
                {(appt.status !== 'cancelled' && appt.status !== 'completed') && (
                  <button disabled={actionId===appt.id} onClick={()=>runAction('cancel', appt.id)} className="bg-red-600 disabled:opacity-50 text-white px-3 py-1 rounded">Cancelar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  NUEVO BLOQUE: Historia Clínica */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Historia Clínica</h3>
        <p className="text-gray-600 mb-4">Gestiona las consultas y registros médicos.</p>
        <a
          href="/dashboard/historiamedica/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Nueva Consulta
        </a>
      </div>
      {/* Bloque: Acceso a Pacientes */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
        <p className="text-gray-600 mb-4">Ver lista de pacientes, buscar y administrar.</p>
        <Link
          href="/patients"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Ir a Pacientes
        </Link>
      </div>

      {/*  NUEVO BLOQUE: Consultas Médicas */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Consultas Médicas</h3>
        <ul className="space-y-3">
          {([
            { id: 123, title: 'Consulta 1' },
            { id: 456, title: 'Consulta 2' },
          ]).map((consultation) => (
            <li key={consultation.id} className="flex justify-between items-center p-3 border rounded">
              <span>{consultation.title}</span>
              <a
                href={`/dashboard/historiamedica/${consultation.id}/edit`}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
              >
                Editar
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-2">Cola de Pacientes</h3>
        <p className="text-gray-600 mb-4">Gestiona los turnos en tiempo real.</p>
        <Link href="/dashboard/queue" className="inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
          Ver Cola
        </Link>
      </div>
    </div>
  );
}