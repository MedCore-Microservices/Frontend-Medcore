'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchPatients, type SearchPatientsOptions } from '@/app/servicios/patients.service';

type Patient = {
  id: number;
  fullname: string;
  identificationNumber: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
};

export default function DoctorPrescriptionsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchPatientsOptions>({
    page: 1,
    limit: 20
  });

  useEffect(() => {
    loadPatients();
  }, [filters]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await searchPatients({ ...filters, search: searchTerm });
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Error cargando pacientes:', error);
      alert('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    loadPatients();
  };

  const handlePatientSelect = (patientId: number) => {
    router.push(`/dashboard/doctor/prescriptions/new/${patientId}`);
  };

  const handleViewHistory = (patientId: number) => {
    router.push(`/dashboard/doctor/prescriptions/${patientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Hacer Prescripción</h1>
          <p className="text-gray-600">Selecciona un paciente para crear una nueva prescripción médica</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, documento o email..."
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Género</label>
            <select
              value={filters.gender || ''}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value || undefined, page: 1 })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Edad Mínima</label>
            <input
              type="number"
              value={filters.minAge || ''}
              onChange={(e) => setFilters({ ...filters, minAge: e.target.value || undefined, page: 1 })}
              placeholder="Ej: 18"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Edad Máxima</label>
            <input
              type="number"
              value={filters.maxAge || ''}
              onChange={(e) => setFilters({ ...filters, maxAge: e.target.value || undefined, page: 1 })}
              placeholder="Ej: 65"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Tipo de Sangre</label>
            <select
              value={filters.bloodType || ''}
              onChange={(e) => setFilters({ ...filters, bloodType: e.target.value || undefined, page: 1 })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        {/* Patient List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No se encontraron pacientes</p>
            <p className="text-sm text-gray-500 mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white border border-gray-300 rounded-lg p-5 hover:border-blue-500 transition-colors shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{patient.fullname}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Documento:</span>
                        <span className="ml-2 text-gray-900">{patient.identificationNumber}</span>
                      </div>
                      {patient.email && (
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 text-gray-900">{patient.email}</span>
                        </div>
                      )}
                      {patient.phone && (
                        <div>
                          <span className="text-gray-600">Teléfono:</span>
                          <span className="ml-2 text-gray-900">{patient.phone}</span>
                        </div>
                      )}
                      {patient.age && (
                        <div>
                          <span className="text-gray-600">Edad:</span>
                          <span className="ml-2 text-gray-900">{patient.age} años</span>
                        </div>
                      )}
                      {patient.gender && (
                        <div>
                          <span className="text-gray-600">Género:</span>
                          <span className="ml-2 text-gray-900">{patient.gender}</span>
                        </div>
                      )}
                      {patient.bloodType && (
                        <div>
                          <span className="text-gray-600">Tipo de sangre:</span>
                          <span className="ml-2 text-gray-900">{patient.bloodType}</span>
                        </div>
                      )}
                    </div>
                    {patient.allergies && (
                      <div className="mt-3 p-2 bg-red-100 border border-red-400 rounded">
                        <span className="text-red-800 font-medium">Alergias:</span>
                        <span className="ml-2 text-red-900">{patient.allergies}</span>
                      </div>
                    )}
                    {patient.chronicDiseases && (
                      <div className="mt-2 p-2 bg-amber-100 border border-amber-400 rounded">
                        <span className="text-amber-800 font-medium">Enfermedades crónicas:</span>
                        <span className="ml-2 text-amber-900">{patient.chronicDiseases}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => handlePatientSelect(patient.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      Nueva Prescripción
                    </button>
                    <button
                      onClick={() => handleViewHistory(patient.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      Ver Historial
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
