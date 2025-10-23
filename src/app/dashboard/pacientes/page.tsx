// app/dashboard/pacientes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { searchPatients } from '@/app/servicios/patients.service';
import Link from 'next/link';

type Patient = {
  id: string | number;
  fullname?: string;
  identificationNumber?: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
  // Puedes pasar filtros si los necesitas
  const data = await searchPatients({ page: 1, limit: 20 });
  setPatients(data.patients || []);
      } catch (err) {
        const msg = (err as unknown as { message?: string })?.message || 'Error al cargar pacientes';
        setError(msg);
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
            <Link href={`/dashboard/historiamedica/patient/${patient.id}`} className="text-blue-600 hover:text-blue-800 font-medium">Ver Historia Clínica</Link>
          </div>
        ))}
      </div>
    </div>
  );
}