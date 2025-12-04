"use client";
import React, { useEffect, useState } from 'react';
import { getAllOrders } from '@/app/servicios/medical-order.service';
import { FileText, FlaskConical, X, Calendar, User, ChevronDown, ChevronUp, Mail, IdCard } from 'lucide-react';
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
  return styles[priority as keyof typeof styles] || styles.routine;
};

const getStatusBadge = (status: string) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return styles[status as keyof typeof styles] || styles.pending;
};

export default function DoctorOrdersPage() {
  const [orders, setOrders] = useState<MedicalOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | OrderType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Cargar todas las órdenes (para doctores/staff)
        const data = await getAllOrders();
        setOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = orders.filter(order => {
    if (filterType !== 'all' && order.type !== filterType) return false;
    
    const patientName = order.patient?.fullname || order.patientName || '';
    const patientId = order.patient?.identificationNumber || '';
    
    if (searchTerm && 
        !order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) && 
        !patientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !patientId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Órdenes Médicas</h1>
        <button
          onClick={() => window.location.href = '/dashboard/doctor/orders/new'}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Nueva Orden
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por ID o paciente..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as 'all' | OrderType)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="laboratory">Laboratorio</option>
            <option value="radiology">Radiología</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Cargando órdenes...</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && !loading && (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No se encontraron órdenes
          </div>
        )}
        {filtered.map(order => {
          const isExpanded = expandedOrders.has(order.id);
          const patientName = order.patient?.fullname || order.patientName || 'Paciente desconocido';
          const patientIdNumber = order.patient?.identificationNumber;
          const patientEmail = order.patient?.email;
          const requestedByName = order.requestedByUser?.fullname || order.requestedByName || 'No especificado';
          
          return (
            <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* Header de la orden */}
              <div className="p-4 space-y-3 border-b border-gray-200">
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
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityBadge(order.priority)}`}>
                      {order.priority.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Información del paciente */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">Paciente</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Nombre: </span>
                      <span className="text-gray-900">{patientName}</span>
                    </div>
                    {patientIdNumber && (
                      <div className="flex items-center gap-1">
                        <IdCard className="w-3 h-3 text-gray-500" />
                        <span className="font-medium text-gray-700">CC: </span>
                        <span className="text-gray-900">{patientIdNumber}</span>
                      </div>
                    )}
                    {patientEmail && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-900">{patientEmail}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">ID: </span>
                      <span className="text-gray-900">{order.patientId}</span>
                    </div>
                  </div>
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{new Date(order.requestedAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Solicitado por: </span>
                    <span className="text-gray-900">{requestedByName}</span>
                  </div>
                </div>

                {order.clinicalNotes && (
                  <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200">
                    <span className="font-medium text-gray-700">Notas clínicas: </span>
                    <span className="text-gray-600">{order.clinicalNotes}</span>
                  </div>
                )}

                {/* Botón para expandir/colapsar */}
                <button
                  onClick={() => toggleExpanded(order.id)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded transition text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>
                      {Array.isArray(order.tests) ? order.tests.length : 0} examen{Array.isArray(order.tests) && order.tests.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Detalles expandibles de los exámenes */}
              {isExpanded && Array.isArray(order.tests) && order.tests.length > 0 && (
                <div className="p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Exámenes solicitados:
                  </h4>
                  <div className="space-y-2">
                    {order.tests.map((test: any, idx: number) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="font-medium text-gray-900">
                          {test.name || test.testName || 'Examen sin nombre'}
                        </div>
                        {test.testCode && (
                          <div className="text-xs text-gray-500 mt-1">
                            Código: {test.testCode}
                          </div>
                        )}
                        {test.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {test.description}
                          </div>
                        )}
                        {test.specimen && (
                          <div className="text-xs text-gray-500 mt-1">
                            Muestra: {test.specimen}
                          </div>
                        )}
                        {test.status && (
                          <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${getStatusBadge(test.status)}`}>
                            {test.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
