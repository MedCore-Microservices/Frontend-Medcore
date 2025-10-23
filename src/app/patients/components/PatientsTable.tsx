"use client";

import React from 'react';

type Patient = {
    id: number;
    fullname: string;
    identificationNumber?: string;
    gender?: string;
    age?: number;
    createdAt?: string;
};

export default function PatientsTable({ patients }: { patients: Patient[] }) {
    if (!patients || patients.length === 0) {
        return <div className="p-4 bg-yellow-50 rounded">No se encontraron pacientes.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Identificación</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Género</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Edad</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha registro</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm">{p.fullname}</td>
                            <td className="px-4 py-2 text-sm">{p.identificationNumber}</td>
                            <td className="px-4 py-2 text-sm">{p.gender ?? '-'}</td>
                            <td className="px-4 py-2 text-sm">{p.age ?? '-'}</td>
                            <td className="px-4 py-2 text-sm">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-2 text-sm text-right">
                                <a href={`/patients/${p.id}`} className="text-blue-600 hover:underline mr-2">Ver</a>
                                <a href={`/patients/${p.id}/edit`} className="text-yellow-600 hover:underline">Editar</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
