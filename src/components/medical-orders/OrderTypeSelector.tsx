"use client";
import React from 'react';
import { FlaskConical, X } from 'lucide-react';
import type { OrderType } from '@/types/medical-order';

interface OrderTypeSelectorProps {
  selected: OrderType | null;
  onSelect: (type: OrderType) => void;
}

export default function OrderTypeSelector({ selected, onSelect }: OrderTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Tipo de Orden</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelect('laboratory')}
          className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
            selected === 'laboratory'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <FlaskConical className={`w-8 h-8 ${selected === 'laboratory' ? 'text-blue-600' : 'text-gray-400'}`} />
          <div className="text-left">
            <div className="font-semibold text-gray-900">Laboratorio</div>
            <div className="text-xs text-gray-600">Exámenes de sangre, orina, etc.</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('radiology')}
          className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
            selected === 'radiology'
              ? 'border-purple-500 bg-purple-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
          }`}
        >
          <X className={`w-8 h-8 ${selected === 'radiology' ? 'text-purple-600' : 'text-gray-400'}`} />
          <div className="text-left">
            <div className="font-semibold text-gray-900">Radiología</div>
            <div className="text-xs text-gray-600">Rayos X, TAC, Resonancia, etc.</div>
          </div>
        </button>
      </div>
    </div>
  );
}
