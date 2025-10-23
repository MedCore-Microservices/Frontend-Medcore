"use client";

import { useState, FormEvent } from 'react';

export default function NewPatientPage() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // TODO: llamar al endpoint de creación de pacientes en ms-logica-negocio
        alert('Crear paciente: ' + fullname);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Nuevo paciente</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm">Nombre completo</label>
                    <input value={fullname} onChange={(e) => setFullname(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Crear</button>
                </div>
            </form>
        </div>
    );
}
