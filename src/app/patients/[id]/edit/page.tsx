"use client";

import { useState, FormEvent } from 'react';

export default function EditPatient({ params }: { params: { id: string } }) {
    const { id } = params;
    const [fullname, setFullname] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        alert('Actualizar paciente ' + id + ' => ' + fullname);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Editar paciente</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm">Nombre completo</label>
                    <input value={fullname} onChange={(e) => setFullname(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                </div>
            </form>
        </div>
    );
}
