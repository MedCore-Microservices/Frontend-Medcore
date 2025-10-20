'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react'; // ✅
import { getPatientByIdClient } from '@/app/servicios/business.service';
import DiagnosticCard from '@/app/dashboard/components/DiagnosticCard';
import DocumentManager from '@/app/dashboard/components/DocumentManager';

interface PageProps {
  params: Promise<{ patientId: string }>;
}

export default function PatientHistoryPage({ params }: PageProps) {
  const { patientId } = use(params);
  const { data: session, status } = useSession(); //  Obtiene la sesión

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //  Verificación de acceso
  useEffect(() => {
    if (status === 'loading') return;

    const user = session?.user;
    if (!user) {
      setError('No autorizado');
      setLoading(false);
      return;
    }

    // Si es paciente y el ID no coincide, denegar acceso
    if (user.role === 'PACIENTE' && String(user.id) !== patientId) {
      setError('No tienes permiso para ver esta historia clínica');
      setLoading(false);
      return;
    }

    // Si pasa las validaciones, cargar los datos
    const loadPatient = async () => {
      try {
        const data = await getPatientByIdClient(patientId);
        setPatient(data.patient);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la historia clínica');
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId, session, status]);

  if (loading || status === 'loading') {
    return <div className="p-6"><h1 className="text-2xl">Cargando...</h1></div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl text-red-600">Acceso denegado</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historia Clínica - {patient.fullname}</h1>
        <p>ID: {patient.identificationNumber}</p>
      </div>

      {patient.diagnosticsAsPatient?.length > 0 ? (
        patient.diagnosticsAsPatient.map((diag: any) => (
          <div key={diag.id} className="space-y-3">
            <DiagnosticCard
              title={diag.title}
              doctorName={diag.doctor?.fullname || 'Desconocido'}
              date={new Date(diag.createdAt).toLocaleDateString()}
              diagnosis={diag.diagnosis}
            />
            {diag.documents && diag.documents.length > 0 && (
              <div className="ml-4 pl-4 border-l-2 border-gray-200">
                <h3 className="text-md font-medium mb-2">Documentos Adjuntos</h3>
                <DocumentManager documents={diag.documents} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No hay diagnósticos.</p>
      )}
    </div>
  );
}