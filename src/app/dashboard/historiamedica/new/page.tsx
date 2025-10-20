'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDiagnostic } from '@/app/servicios/business.service';

export default function NewDiagnosticPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    observations: '',
    nextAppointment: ''
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      // Validar tipo y tamaño (opcional)
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createDiagnostic(formData.patientId, {
        title: formData.title,
        description: formData.description,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        observations: formData.observations,
        nextAppointment: formData.nextAppointment || undefined
      }, files);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/historiamedica/patient/${formData.patientId}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al crear la consulta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nueva Consulta Médica</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          ¡Consulta creada exitosamente! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ID del paciente */}
        <div>
          <label className="block text-sm font-medium mb-1">ID del Paciente *</label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Ej: 3"
          />
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Ej: Control de rutina"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-1">Descripción *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Motivo de la consulta..."
          />
        </div>

        {/* Síntomas */}
        <div>
          <label className="block text-sm font-medium mb-1">Síntomas *</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            rows={2}
            className="w-full p-2 border rounded"
            placeholder="Síntomas presentados..."
          />
        </div>

        {/* Diagnóstico */}
        <div>
          <label className="block text-sm font-medium mb-1">Diagnóstico *</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Diagnóstico médico..."
          />
        </div>

        {/* Tratamiento */}
        <div>
          <label className="block text-sm font-medium mb-1">Tratamiento *</label>
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Tratamiento prescrito..."
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium mb-1">Observaciones</label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 border rounded"
            placeholder="Notas adicionales..."
          />
        </div>

        {/* Próxima cita */}
        <div>
          <label className="block text-sm font-medium mb-1">Próxima Cita</label>
          <input
            type="datetime-local"
            name="nextAppointment"
            value={formData.nextAppointment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Archivos */}
        <div>
          <label className="block text-sm font-medium mb-1">Documentos Adjuntos (PDF, JPG, PNG, máx. 10MB)</label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {files.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Archivos seleccionados: {files.map(f => f.name).join(', ')}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Consulta'}
          </button>
        </div>
      </form>
    </div>
  );
}