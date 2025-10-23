"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPatient } from '@/app/servicios/patients.service';

export default function GetPatientPage() {
    const params = useSearchParams();
    const id = params.get('id');
    type MedRecord = { id: number; diagnosis: string; description?: string; createdAt?: string };
    type PatientDetail = {
        id: number;
        fullname: string;
        email?: string;
        identificationNumber?: string;
        phone?: string;
        dateOfBirth?: string;
        age?: number;
        gender?: string;
        bloodType?: string;
        allergies?: string;
        chronicDiseases?: string;
        emergencyContact?: string;
        medicalRecordsAsPatient?: MedRecord[];
    } | null;

    const [patient, setPatient] = useState<PatientDetail>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await getPatient(id);
                setPatient(res.patient || res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (!id) return <div className="p-6">ID requerido en query string, ej: /patients/getPatient?id=123</div>;
    if (loading) return <div className="p-6">Cargando...</div>;
    if (!patient) return <div className="p-6">Paciente no encontrado</div>;

    return (
        <div className="p-6">
            <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold mb-4">Paciente: {patient.fullname}</h1>
                <div className="space-x-2">
                    <Link href={`/patients/editPatient?id=${patient.id}${params.toString() ? `&${params.toString().replace(/(^|&)id=[^&]*&?/, '').replace(/(^&|&$)/, '')}` : ''}`} className="px-3 py-1 bg-yellow-500 text-white rounded">Editar</Link>
                    <Link href={`/patients${params.toString() ? `?${params.toString().replace(/(^|&)id=[^&]*&?/, '').replace(/(^&|&$)/, '')}` : ''}`} className="px-3 py-1 bg-gray-200 rounded">Volver</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
                <div>
                    <div className="text-sm text-gray-500">ID</div>
                    <div className="font-medium">{patient.id}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{patient.email ?? '-'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Identificación</div>
                    <div className="font-medium">{patient.identificationNumber ?? '-'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Teléfono</div>
                    <div className="font-medium">{patient.phone ?? '-'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Fecha de nacimiento</div>
                    <div className="font-medium">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Edad</div>
                    <div className="font-medium">{patient.age ?? '-'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Género</div>
                    <div className="font-medium">{patient.gender ?? '-'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Tipo de sangre</div>
                    <div className="font-medium">{patient.bloodType ?? '-'}</div>
                </div>
                <div className="md:col-span-2">
                    <div className="text-sm text-gray-500">Alergias</div>
                    <div className="font-medium">{patient.allergies ?? '-'}</div>
                </div>
                <div className="md:col-span-2">
                    <div className="text-sm text-gray-500">Enfermedades crónicas</div>
                    <div className="font-medium">{patient.chronicDiseases ?? '-'}</div>
                </div>
                <div className="md:col-span-2">
                    <div className="text-sm text-gray-500">Contacto de emergencia</div>
                    <div className="font-medium">{patient.emergencyContact ?? '-'}</div>
                </div>
            </div>

            {/* Historial médico resumido */}
            {patient.medicalRecordsAsPatient && patient.medicalRecordsAsPatient.length > 0 && (
                <div className="mt-6 bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold">Últimas historias clínicas</h2>
                    <ul className="mt-3 space-y-2">
                        {patient.medicalRecordsAsPatient.map((r: { id: number; diagnosis: string; description?: string; createdAt?: string }) => (
                            <li key={r.id} className="border p-2 rounded">
                                <div className="font-medium">{r.diagnosis}</div>
                                <div className="text-sm text-gray-600">{r.description}</div>
                                <div className="text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
