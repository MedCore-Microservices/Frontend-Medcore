"use client";

import { useState } from 'react';

type Filters = {
    dateFrom?: string;
    dateTo?: string;
    gender?: string;
    minAge?: string;
    maxAge?: string;
};

export default function PatientsFilters({ onApply, onClear, initial }: { onApply: (f: Filters) => void; onClear: () => void; initial: Filters }) {
    const [dateFrom, setDateFrom] = useState(initial.dateFrom || '');
    const [dateTo, setDateTo] = useState(initial.dateTo || '');
    const [gender, setGender] = useState(initial.gender || '');
    const [minAge, setMinAge] = useState(initial.minAge || '');
    const [maxAge, setMaxAge] = useState(initial.maxAge || '');

    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div>
                    <label className="block text-sm text-gray-600">Fecha desde</label>
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Fecha hasta</label>
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Género</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 block w-full border rounded p-2">
                        <option value="">Todos</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Edad mínima</label>
                    <input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Edad máxima</label>
                    <input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div className="flex items-end gap-2">
                    <button onClick={() => onApply({ dateFrom, dateTo, gender, minAge, maxAge })} className="px-4 py-2 bg-blue-600 text-white rounded">Aplicar</button>
                    <button onClick={() => { setDateFrom(''); setDateTo(''); setGender(''); setMinAge(''); setMaxAge(''); onClear(); }} className="px-4 py-2 bg-gray-200 rounded">Limpiar</button>
                </div>
            </div>
        </div>
    );
}
