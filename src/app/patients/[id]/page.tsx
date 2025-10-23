"use client";

import { useEffect, useState } from 'react';
import { getPatientByIdClient } from '@/app/servicios/business.service';

type Patient = {
    id: number;
    fullname: string;
    identificationNumber?: string;
    age?: number;
};

export default function PatientDetail({ params }: { params: { id: string } }) {
    const { id } = params;
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getPatientByIdClient(id);
                setPatient(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!patient) return <div>No encontrado</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{patient.fullname}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <p><strong>ID:</strong> {patient.id}</p>
                    <p><strong>Identificación:</strong> {patient.identificationNumber}</p>
                    <p><strong>Edad:</strong> {patient.age}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <a href={`/patients/${patient.id}/edit`} className="px-3 py-1 bg-yellow-500 text-white rounded">Editar</a>
                </div>
            </div>
        </div>
    );
}
