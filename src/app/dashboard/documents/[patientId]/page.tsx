import React from 'react';

export default function PatientDocuments({ params }: { params: { patientId: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Documentos del Paciente #{params.patientId}</h1>
      <p className="text-gray-600">Aquí puedes ver y gestionar los documentos médicos del paciente.</p>
      {/* Implementar tabla de documentos */}
    </div>
  );
}