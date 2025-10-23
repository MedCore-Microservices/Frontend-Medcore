"use client";

"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { createPatient } from '@/app/servicios/patients.service';

export default function NewPatientPageRoute() {
    const [form, setForm] = useState({
        fullname: '',
        identificationNumber: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        bloodType: '',
        allergies: '',
        chronicDiseases: '',
        emergencyContact: '',
        status: 'ACTIVE'
    });

    const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.fullname || !form.identificationNumber) return alert('Nombre completo e identificación son obligatorios');
            try {
                await createPatient({
                fullname: form.fullname,
                identificationNumber: form.identificationNumber,
                email: form.email || undefined,
                phone: form.phone || undefined,
                dateOfBirth: form.dateOfBirth || undefined,
                age: form.age ? Number(form.age) : undefined,
                    gender: form.gender || undefined,
                    bloodType: form.bloodType || undefined,
                allergies: form.allergies || undefined,
                chronicDiseases: form.chronicDiseases || undefined,
                emergencyContact: form.emergencyContact || undefined,
                status: form.status
            });
            window.location.href = '/patients';
        } catch (err) {
            const msg = (err as unknown as { message?: string })?.message || 'Error';
            alert('Error creando paciente: ' + msg);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Nuevo paciente</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm">Nombre completo</label>
                        <input value={form.fullname} onChange={(e) => handleChange('fullname', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm">Identificación</label>
                        <input value={form.identificationNumber} onChange={(e) => handleChange('identificationNumber', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm">Email</label>
                        <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm">Teléfono</label>
                        <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm">Fecha de nacimiento</label>
                        <input type="date" value={form.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm">Edad</label>
                        <input type="number" value={form.age} onChange={(e) => handleChange('age', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm">Género</label>
                        <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className="mt-1 block w-full border rounded p-2">
                            <option value="">--</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm">Tipo de sangre</label>
                        <input value={form.bloodType} onChange={(e) => handleChange('bloodType', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm">Alergias</label>
                        <input value={form.allergies} onChange={(e) => handleChange('allergies', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm">Enfermedades crónicas</label>
                        <input value={form.chronicDiseases} onChange={(e) => handleChange('chronicDiseases', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm">Contacto de emergencia</label>
                        <input value={form.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} className="mt-1 block w-full border rounded p-2" />
                    </div>
                </div>

                <div className="flex justify-between">
                    <Link href="/patients" className="px-4 py-2 bg-gray-200 rounded">Cancelar</Link>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Crear paciente</button>
                </div>
            </form>
        </div>
    );
}
