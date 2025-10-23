// app/dashboard/patient/[patientId]/page.tsx (o ruta similar)
'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react'; 
// Asume que estas importaciones son correctas
import { getPatientByIdClient } from '@/app/servicios/business.service'; 
import DiagnosticCard from '@/app/dashboard/components/DiagnosticCard';
import DocumentManager from '@/app/dashboard/components/DocumentManager';

// Define la estructura mínima de la sesión para TypeScript
interface UserSession {
    id: string | number;
    role: 'MEDICO' | 'ADMINISTRADOR' | 'PACIENTE' | string; // Permitir string para normalización
    // ... otras propiedades
}

interface PageProps {
  params: Promise<{ patientId: string }>;
}

export default function PatientHistoryPage({ params }: PageProps) {
  const { patientId } = use(params);
  const { data: session, status } = useSession(); 

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica de autenticación y carga
  useEffect(() => {
    // 1. Siempre esperar a que Next-Auth finalice la carga.
    if (status === 'loading') return;

    const patientIdNumber = parseInt(patientId, 10);
    const user = session?.user as UserSession | undefined;

    // --- VERIFICACIÓN DE ACCESO INICIAL ---
    
    // 2. Bloqueo si NO hay sesión
    if (status === 'unauthenticated' || !user) {
        // En lugar de 'No autorizado', usamos el error del estado para el caso unauthenticated
        setError(status === 'unauthenticated' ? 'No autorizado. Debes iniciar sesión para acceder.' : 'No autorizado.');
        setLoading(false);
        return;
    }
    
    // ✅ 3. SOLUCIÓN AL ERROR DE TYPE: Establecer y Normalizar el Rol
    const allowedDoctorIds = [10, 11, 13, 15, 19, 21];
    const currentUserIdNumber = Number(user.id);
    
    // Inicializamos el rol a partir de la sesión. Usamos String() para seguridad.
    let effectiveRole = String(user.role).toUpperCase();

    // ⚠️ Importante: NO MUTAMOS user.role. Solo cambiamos la variable local 'effectiveRole'.
    if (allowedDoctorIds.includes(currentUserIdNumber)) {
        effectiveRole = 'MEDICO';
    }

    // 4. Bloqueo si el ID es inválido después de la conversión
    if (isNaN(currentUserIdNumber)) {
        setError('Error: ID de usuario no válido en la sesión.');
        setLoading(false);
        return;
    }


    // 5. Determinar la autorización
    let isAuthorized = false;

    // A. Roles con acceso completo (MEDICO o ADMINISTRADOR)
    if (effectiveRole === 'MEDICO' || effectiveRole === 'ADMINISTRADOR') {
      isAuthorized = true;
    }
    
    // B. Rol PACIENTE: solo puede ver su propia historia
    if (effectiveRole === 'PACIENTE' && currentUserIdNumber === patientIdNumber) {
      isAuthorized = true;
    }

    // 6. Bloqueo si la autorización falla
    if (!isAuthorized) {
      setError('Acceso denegado. No tienes permisos para ver esta historia clínica.');
      setLoading(false);
      return;
    }

    // --- CARGA DE DATOS ---
    
    // 7. Si está autorizado, cargar los datos
    const loadPatient = async () => {
      setLoading(true); 
      try {
        const data = await getPatientByIdClient(patientId);
        setPatient(data.patient);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la historia clínica.');
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
    // ⚠️ Se eliminó 'session' de las dependencias para evitar recargas constantes, 
    // pero si lo necesitas, puedes reintroducirlo.
  }, [patientId, status]); 

  // -------------------------------------------------------------
  // RENDERING
  // -------------------------------------------------------------

  if (loading || status === 'loading') {
    return <div className="p-6"><h1 className="text-2xl">Cargando datos...</h1></div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl text-red-600">Acceso denegado</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!patient) {
      return <div className="p-6">No se encontraron datos del paciente.</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* ... Tu JSX original ... */}
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