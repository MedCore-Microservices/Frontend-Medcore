"use client";
import React, { useEffect, useState } from 'react';
import { getLabExamTypes } from '@/app/servicios/medical-order.service';
import type { LabExamType } from '@/types/medical-order';

interface LabTestSelectorProps {
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
}

export default function LabTestSelector({ selectedCodes, onChange }: LabTestSelectorProps) {
  const [labTests, setLabTests] = useState<LabExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLabExamTypes();
        setLabTests(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleTest = (code: string) => {
    if (selectedCodes.includes(code)) {
      onChange(selectedCodes.filter(c => c !== code));
    } else {
      onChange([...selectedCodes, code]);
    }
  };

  const filtered = labTests.filter(
    t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-sm text-gray-500">Cargando exámenes de laboratorio...</div>;
  if (error) return <div className="text-sm text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Exámenes de Laboratorio</label>
      <input
        type="text"
        placeholder="Buscar exámenes..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500 p-2">No se encontraron exámenes</div>
        )}
        {filtered.map(test => (
          <label key={test.code} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCodes.includes(test.code)}
              onChange={() => toggleTest(test.code)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{test.name}</div>
              <div className="text-xs text-gray-500">Código: {test.code}</div>
              {test.description && <div className="text-xs text-gray-600 mt-1">{test.description}</div>}
            </div>
          </label>
        ))}
      </div>
      <div className="text-xs text-gray-600">
        {selectedCodes.length} examen{selectedCodes.length !== 1 ? 'es' : ''} seleccionado{selectedCodes.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
