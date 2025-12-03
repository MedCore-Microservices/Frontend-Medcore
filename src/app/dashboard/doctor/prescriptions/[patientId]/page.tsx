'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPatient } from '@/app/servicios/patients.service';
import {
  getPrescriptionsByPatient,
  downloadPrescriptionPDF,
  type Prescription
} from '@/app/servicios/prescription.service';

type Patient = {
  id: number;
  fullname: string;
  identificationNumber: string;
  age?: number;
  gender?: string;
  allergies?: string;
};

export default function PrescriptionHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [patientData, prescData] = await Promise.all([
        getPatient(patientId),
        getPrescriptionsByPatient(patientId)
      ]);
      setPatient(patientData.patient);
      setPrescriptions(prescData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (prescriptionId: number) => {
    try {
      downloadPrescriptionPDF(prescriptionId);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar PDF');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-900 text-xl">Paciente no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Historial de Prescripciones</h1>
          <p className="text-gray-600">Revisa todas las prescripciones médicas del paciente</p>
        </div>

        {/* Patient Card */}
        <div className="bg-white border border-gray-300 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">{patient.fullname}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Documento:</span>
                  <span className="ml-2 text-gray-900">{patient.identificationNumber}</span>
                </div>
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
              </div>
              {patient.allergies && (
                <div className="mt-3 p-2 bg-red-100 border border-red-400 rounded">
                  <span className="text-red-800 font-medium">⚠️ Alergias:</span>
                  <span className="ml-2 text-red-900">{patient.allergies}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push(`/dashboard/doctor/prescriptions/new/${patientId}`)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              + Nueva Prescripción
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        {prescriptions.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-lg p-12 text-center shadow-sm">
            <p className="text-xl text-gray-600 mb-4">No hay prescripciones registradas</p>
            <p className="text-sm text-gray-500">Crea la primera prescripción para este paciente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((presc) => (
              <div
                key={presc.id}
                className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Header */}
                <div className="p-5 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{presc.title}</h3>
                      <span className="px-2 py-1 bg-blue-600 text-xs rounded">
                        ID: {presc.id}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        📅 Fecha:{' '}
                        {new Date(presc.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {presc.doctor && (
                        <p>👨‍⚕️ Médico: {presc.doctor.fullname}</p>
                      )}
                      <p>💊 Medicamentos: {presc.medications.length}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleExpand(presc.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      {expandedId === presc.id ? 'Ocultar' : 'Ver Detalles'}
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(presc.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      📄 Descargar PDF
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === presc.id && (
                  <div className="border-t border-gray-300 p-5 bg-gray-50">
                    {presc.notes && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-gray-900">Notas e Indicaciones:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{presc.notes}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">Medicamentos Prescritos:</h4>
                      <div className="space-y-3">
                        {presc.medications.map((med, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold mb-2 text-gray-900">{med.name}</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                  {med.dose && (
                                    <div>
                                      <span className="text-gray-600">Dosis:</span>
                                      <span className="ml-2 text-gray-900">{med.dose}</span>
                                    </div>
                                  )}
                                  {med.frequency && (
                                    <div>
                                      <span className="text-gray-600">Frecuencia:</span>
                                      <span className="ml-2 text-gray-900">{med.frequency}</span>
                                    </div>
                                  )}
                                  {(med.duration || med.durationDays) && (
                                    <div>
                                      <span className="text-gray-600">Duración:</span>
                                      <span className="ml-2">
                                        {med.duration || `${med.durationDays} días`}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {med.instructions && (
                                  <div className="mt-2 p-2 bg-amber-100 border border-amber-400 rounded">
                                    <span className="text-amber-800 text-sm font-medium">
                                      Instrucciones:
                                    </span>
                                    <span className="ml-2 text-amber-900 text-sm">
                                      {med.instructions}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
