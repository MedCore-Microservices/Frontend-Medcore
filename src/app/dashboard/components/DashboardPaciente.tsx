"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import AppointmentStatusBadge from "@/components/ui/AppointmentStatusBadge";
import { confirmAppointment } from "@/app/servicios/appointment.service";
import type { AppointmentStatus } from "@/types/appointment";
import { getOrdersByPatient } from "@/app/servicios/medical-order.service";
import { getAuthTokenClient } from "@/lib/getAuthToken";
import { FileText, AlertCircle } from "lucide-react";
import type { MedicalOrderDTO } from "@/types/medical-order";

export default function DashboardPaciente() {
  // Ejemplo de cita próxima para interacción de confirmación
  const [nextAppointment, setNextAppointment] = useState<{ id: string; status: AppointmentStatus; date: string; doctorName: string }>({
    id: "demo-apt-1",
    status: "scheduled" as const,
    date: "2025-11-10T09:00:00Z",
    doctorName: "Dra. Sánchez",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medicalOrders, setMedicalOrders] = useState<MedicalOrderDTO[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [patientId, setPatientId] = useState<number | null>(null);

  // Obtener ID del paciente del token
  useEffect(() => {
    const token = getAuthTokenClient();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const b64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
          const json = JSON.parse(atob(b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=')));
          const id = json.id || json.userId || json.sub;
          setPatientId(id ? Number(id) : null);
        }
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  }, []);

  // Cargar órdenes médicas
  useEffect(() => {
    if (!patientId) return;
    
    const fetchOrders = async () => {
      try {
        const orders = await getOrdersByPatient(patientId);
        // Mostrar solo las 3 más recientes
        setMedicalOrders(orders.slice(0, 3));
      } catch (err) {
        console.error('Error cargando órdenes:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [patientId]);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await confirmAppointment(nextAppointment.id);
      setNextAppointment((a) => ({ ...a, status: "confirmed" }));
    } catch (e: any) {
      setError(e.message || "Error confirmando cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-3 sm:px-0">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Mi Área de Paciente</h2>
        <p className="text-gray-600">Bienvenido a su portal de salud</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900 flex items-center gap-2">
            Próxima Cita <AppointmentStatusBadge status={nextAppointment.status} />
          </h3>
          <p className="text-gray-700 mt-2">
            {nextAppointment.doctorName} - {new Date(nextAppointment.date).toLocaleString()}
          </p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <div className="mt-3 flex gap-2">
            <Link href="/dashboard/paciente/citas" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Ver Mis Citas
            </Link>
            {nextAppointment.status === "scheduled" && (
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="bg-green-600 disabled:opacity-60 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                {loading ? "Confirmando..." : "Confirmar"}
              </button>
            )}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-green-900">Medicamentos Activos</h3>
          <p className="text-2xl font-bold text-green-600">3</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-purple-900">Órdenes Médicas</h3>
          <p className="text-2xl font-bold text-purple-600">{ordersLoading ? '...' : medicalOrders.length}</p>
          <Link href="/dashboard/patient/orders" className="text-sm text-purple-700 hover:underline mt-2 inline-block">
            Ver todas →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Mis Próximas Citas</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <div className="font-medium">Consulta de rutina</div>
              <div className="text-sm text-gray-600">15 Mar 2024 - 10:30 AM</div>
              <div className="text-sm">Dr. Juan García - Cardiología</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-medium">Control de presión</div>
              <div className="text-sm text-gray-600">20 Mar 2024 - 09:15 AM</div>
              <div className="text-sm">Enf. María López</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Mis Órdenes Médicas
            </h3>
            <Link href="/dashboard/patient/orders" className="text-sm text-blue-600 hover:underline">
              Ver todas
            </Link>
          </div>
          
          {ordersLoading ? (
            <div className="text-center py-4 text-gray-500">Cargando órdenes...</div>
          ) : medicalOrders.length === 0 ? (
            <div className="text-center py-4 text-gray-500 flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8 text-gray-400" />
              <p>No tienes órdenes médicas registradas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {medicalOrders.map((order) => (
                <div key={order.id} className="p-3 border rounded hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {order.type === 'laboratory' ? '🧪 Laboratorio' : '📷 Radiología'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.requestedAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.tests.length} examen{order.tests.length !== 1 ? 'es' : ''}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-2">Mi Turno</h3>
        <p className="text-gray-600 mb-4">Únete a la cola y consulta tu número y posición en tiempo real.</p>
        <Link
          href="/patients/turno"
          className="inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          Ir a Mi Turno
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Pacientes (Pruebas)</h3>
          <p className="text-gray-600 mb-4">Acceso limitado para pruebas como paciente</p>
          <Link
            href="/patients"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Ver Pacientes
          </Link>
        </div>
      )}
    </div>
  );
}