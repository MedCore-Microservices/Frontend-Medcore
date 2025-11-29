import React from 'react';
import type { Medication } from '@/app/servicios/prescription.service';

type Patient = {
  fullname: string;
  identificationNumber: string;
  age?: number;
  gender?: string;
  bloodType?: string;
};

type Props = {
  patient: Patient;
  title: string;
  notes?: string;
  medications: Medication[];
  onClose: () => void;
};

export default function PrescriptionPreview({ patient, title, notes, medications, onClose }: Props) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-100 border-b border-gray-300 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Vista Previa - Prescripción Médica</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Document Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">PRESCRIPCIÓN MÉDICA</h1>
            <p className="text-gray-600">MedCore - Sistema de Gestión Médica</p>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>

          {/* Patient Information */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-xl font-semibold mb-4">Información del Paciente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre Completo:</p>
                <p className="font-medium">{patient.fullname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Documento de Identidad:</p>
                <p className="font-medium">{patient.identificationNumber}</p>
              </div>
              {patient.age && (
                <div>
                  <p className="text-sm text-gray-600">Edad:</p>
                  <p className="font-medium">{patient.age} años</p>
                </div>
              )}
              {patient.gender && (
                <div>
                  <p className="text-sm text-gray-600">Género:</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
              )}
              {patient.bloodType && (
                <div>
                  <p className="text-sm text-gray-600">Tipo de Sangre:</p>
                  <p className="font-medium">{patient.bloodType}</p>
                </div>
              )}
            </div>
          </div>

          {/* Prescription Title */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Diagnóstico / Motivo:</h3>
            <p className="text-lg">{title}</p>
          </div>

          {/* Notes */}
          {notes && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Indicaciones Generales:</h3>
              <p className="whitespace-pre-line">{notes}</p>
            </div>
          )}

          {/* Medications */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Medicamentos Prescritos:</h3>
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{med.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {med.dose && (
                          <div>
                            <span className="text-gray-600 font-medium">Dosis:</span>
                            <p>{med.dose}</p>
                          </div>
                        )}
                        {med.frequency && (
                          <div>
                            <span className="text-gray-600 font-medium">Frecuencia:</span>
                            <p>{med.frequency}</p>
                          </div>
                        )}
                        {med.duration && (
                          <div>
                            <span className="text-gray-600 font-medium">Duración:</span>
                            <p>{med.duration}</p>
                          </div>
                        )}
                      </div>
                      {med.instructions && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded">
                          <p className="text-sm">
                            <span className="font-medium text-yellow-800">Instrucciones:</span>{' '}
                            {med.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-300 pt-6 mt-8">
            <div className="text-center space-y-4">
              <div>
                <p className="font-semibold">Firma del Médico</p>
                <div className="border-t border-gray-400 w-64 mx-auto mt-8"></div>
              </div>
              <p className="text-sm text-gray-600">
                Este documento es una vista previa. La prescripción oficial será generada al guardar.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-100 border-t border-gray-300 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
