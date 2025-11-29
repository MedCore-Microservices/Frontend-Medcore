import React from 'react';
import type { Medication } from '@/app/servicios/prescription.service';

type Props = {
  medication: Medication;
  index: number;
  onUpdate: (index: number, field: keyof Medication, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
};

export default function MedicationItem({ medication, index, onUpdate, onRemove, canRemove }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg">Medicamento {index + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-400 hover:text-red-300 font-medium"
          >
            ✕ Eliminar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medication Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Nombre del Medicamento <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={medication.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            placeholder="Ej: Amoxicilina 500mg"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Dose */}
        <div>
          <label className="block text-sm font-medium mb-1">Dosis</label>
          <input
            type="text"
            value={medication.dose || ''}
            onChange={(e) => onUpdate(index, 'dose', e.target.value)}
            placeholder="Ej: 500mg, 1 tableta"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium mb-1">Frecuencia</label>
          <input
            type="text"
            value={medication.frequency || ''}
            onChange={(e) => onUpdate(index, 'frequency', e.target.value)}
            placeholder="Ej: Cada 8 horas, 3 veces al día"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">Duración</label>
          <input
            type="text"
            value={medication.duration || ''}
            onChange={(e) => onUpdate(index, 'duration', e.target.value)}
            placeholder="Ej: 7 días, 2 semanas"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Instrucciones Especiales</label>
          <textarea
            value={medication.instructions || ''}
            onChange={(e) => onUpdate(index, 'instructions', e.target.value)}
            placeholder="Ej: Tomar con alimentos, evitar lácteos, tomar antes de dormir..."
            rows={2}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
