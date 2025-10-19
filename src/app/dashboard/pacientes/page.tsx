// app/dashboard/pacientes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { searchPatientsAdvanced } from '@/app/servicios/business.service';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        // Puedes pasar filtros si los necesitas
        const data = await searchPatientsAdvanced();
        setPatients(data.patients || []);
      } catch (err: any) {
        setError(err.message || 'Error al cargar pacientes');
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pacientes</h1>
      <div className="space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{patient.fullname}</h3>
              <p className="text-sm text-gray-600">ID: {patient.identificationNumber}</p>
            </div>
            <a
              href={`/dashboard/historiamedica/patient/${patient.id}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver Historia Clínica
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}