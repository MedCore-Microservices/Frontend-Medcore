"use client";
import React, { useEffect, useState } from 'react';
import { getRadiologyExamTypes } from '@/app/servicios/medical-order.service';
import type { RadiologyExamType } from '@/types/medical-order';

interface RadiologyExamSelectorProps {
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
}

export default function RadiologyExamSelector({ selectedCodes, onChange }: RadiologyExamSelectorProps) {
  const [radiologyExams, setRadiologyExams] = useState<RadiologyExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRadiologyExamTypes();
        setRadiologyExams(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleExam = (code: string) => {
    if (selectedCodes.includes(code)) {
      onChange(selectedCodes.filter(c => c !== code));
    } else {
      onChange([...selectedCodes, code]);
    }
  };

  const filtered = radiologyExams.filter(
    e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         e.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-sm text-gray-500">Cargando estudios de radiología...</div>;
  if (error) return <div className="text-sm text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Estudios de Radiología</label>
      <input
        type="text"
        placeholder="Buscar estudios..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500 p-2">No se encontraron estudios</div>
        )}
        {filtered.map(exam => (
          <label key={exam.code} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCodes.includes(exam.code)}
              onChange={() => toggleExam(exam.code)}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{exam.name}</div>
              <div className="text-xs text-gray-500">Código: {exam.code}</div>
              {exam.description && <div className="text-xs text-gray-600 mt-1">{exam.description}</div>}
            </div>
          </label>
        ))}
      </div>
      <div className="text-xs text-gray-600">
        {selectedCodes.length} estudio{selectedCodes.length !== 1 ? 's' : ''} seleccionado{selectedCodes.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
