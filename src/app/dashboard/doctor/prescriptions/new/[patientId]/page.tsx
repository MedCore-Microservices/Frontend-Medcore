'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPatient } from '@/app/servicios/patients.service';
import {
  createPrescription,
  checkAllergies,
  type Medication,
  type PrescriptionPayload
} from '@/app/servicios/prescription.service';
import MedicationItem from '@/components/prescriptions/MedicationItem';
import PrescriptionPreview from '@/components/prescriptions/PrescriptionPreview';

type Patient = {
  id: number;
  fullname: string;
  identificationNumber: string;
  age?: number;
  gender?: string;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
  email?: string;
  phone?: string;
};

export default function NewPrescriptionPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dose: '', frequency: '', duration: '', instructions: '' }
  ]);

  // Allergy warnings
  const [allergyWarnings, setAllergyWarnings] = useState<any[]>([]);
  const [checkingAllergies, setCheckingAllergies] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const data = await getPatient(patientId);
      setPatient(data.patient);
    } catch (error) {
      console.error('Error cargando paciente:', error);
      alert('Error al cargar información del paciente');
      router.push('/dashboard/doctor/prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: '', dose: '', frequency: '', duration: '', instructions: '' }
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleCheckAllergies = async () => {
    try {
      setCheckingAllergies(true);
      const validMeds = medications.filter(m => m.name.trim());
      if (validMeds.length === 0) {
        alert('Agrega al menos un medicamento para verificar alergias');
        return;
      }
      const result = await checkAllergies(Number(patientId), validMeds);
      const warnings = result.results.filter((r: any) => r.allergic);
      setAllergyWarnings(warnings);
      
      if (warnings.length > 0) {
        alert(`⚠️ ADVERTENCIA: Se encontraron ${warnings.length} posible(s) alergia(s)`);
      } else {
        alert('✓ No se detectaron alergias conocidas con los medicamentos ingresados');
      }
    } catch (error) {
      console.error('Error verificando alergias:', error);
      alert('Error al verificar alergias');
    } finally {
      setCheckingAllergies(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const validMeds = medications.filter(m => m.name.trim());
    if (validMeds.length === 0) {
      alert('Debes agregar al menos un medicamento');
      return;
    }

    // Verificar si hay advertencias de alergias sin revisar
    if (allergyWarnings.length > 0) {
      const confirm = window.confirm(
        '⚠️ Hay advertencias de alergias. ¿Estás seguro de continuar con esta prescripción?'
      );
      if (!confirm) return;
    }

    try {
      setSaving(true);
      const payload: PrescriptionPayload = {
        patientId: Number(patientId),
        title,
        notes,
        medications: validMeds
      };

      await createPrescription(payload);
      alert('Prescripción creada exitosamente');
      router.push(`/dashboard/doctor/prescriptions/${patientId}`);
    } catch (error) {
      console.error('Error creando prescripción:', error);
      alert('Error al crear la prescripción');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (!title.trim()) {
      alert('El título es obligatorio para la vista previa');
      return;
    }
    const validMeds = medications.filter(m => m.name.trim());
    if (validMeds.length === 0) {
      alert('Debes agregar al menos un medicamento para la vista previa');
      return;
    }
    setShowPreview(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Paciente no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold mb-2">Nueva Prescripción</h1>
          <p className="text-gray-400">Crea una prescripción médica para el paciente</p>
        </div>

        {/* Patient Info Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
          <h2 className="text-xl font-semibold mb-3">Información del Paciente</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Nombre</p>
              <p className="font-medium">{patient.fullname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Documento</p>
              <p className="font-medium">{patient.identificationNumber}</p>
            </div>
            {patient.age && (
              <div>
                <p className="text-sm text-gray-400">Edad</p>
                <p className="font-medium">{patient.age} años</p>
              </div>
            )}
            {patient.gender && (
              <div>
                <p className="text-sm text-gray-400">Género</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
            )}
            {patient.bloodType && (
              <div>
                <p className="text-sm text-gray-400">Tipo de Sangre</p>
                <p className="font-medium">{patient.bloodType}</p>
              </div>
            )}
          </div>
          {patient.allergies && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded">
              <p className="text-red-400 font-medium">⚠️ Alergias conocidas:</p>
              <p className="text-red-300 mt-1">{patient.allergies}</p>
            </div>
          )}
          {patient.chronicDiseases && (
            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded">
              <p className="text-yellow-400 font-medium">Enfermedades crónicas:</p>
              <p className="text-yellow-300 mt-1">{patient.chronicDiseases}</p>
            </div>
          )}
        </div>

        {/* Prescription Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Detalles de la Prescripción</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Título de la Prescripción <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Tratamiento para infección respiratoria"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Notas e Indicaciones</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Indicaciones especiales, recomendaciones, advertencias..."
              rows={4}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Medications */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium">
                Medicamentos <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addMedication}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                + Agregar Medicamento
              </button>
            </div>

            <div className="space-y-4">
              {medications.map((med, index) => (
                <MedicationItem
                  key={index}
                  medication={med}
                  index={index}
                  onUpdate={updateMedication}
                  onRemove={removeMedication}
                  canRemove={medications.length > 1}
                />
              ))}
            </div>
          </div>

          {/* Allergy Check */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleCheckAllergies}
              disabled={checkingAllergies}
              className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {checkingAllergies ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verificando alergias...
                </>
              ) : (
                <>⚕️ Verificar Alergias</>
              )}
            </button>
            {allergyWarnings.length > 0 && (
              <div className="mt-3 p-4 bg-red-900/30 border-2 border-red-600 rounded-lg">
                <p className="font-bold text-red-400 mb-2">⚠️ ADVERTENCIAS DE ALERGIAS:</p>
                {allergyWarnings.map((warning, idx) => (
                  <div key={idx} className="mb-2 text-red-300">
                    • {warning.medication.name} - Coincide con: {warning.matches.join(', ')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Vista Previa
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              {saving ? 'Guardando...' : 'Generar Prescripción'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PrescriptionPreview
          patient={patient}
          title={title}
          notes={notes}
          medications={medications.filter(m => m.name.trim())}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
