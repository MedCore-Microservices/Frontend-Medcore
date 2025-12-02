"use client";
import { useEffect, useState } from "react";
import { getOrdersByPatient, type MedicalOrderDTO } from "@/app/servicios/medical-orders.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EnfermeriaLaboratorioPage() {
    const [patientId, setPatientId] = useState<string>("");
    const [orders, setOrders] = useState<MedicalOrderDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        if (!patientId) { setError("Ingresa un patientId"); return; }
        setLoading(true); setError(null);
        try {
            const list = await getOrdersByPatient(Number(patientId));
            setOrders(list.filter(o => o.type === "LABORATORY"));
        } catch (e: any) {
            setError(e.message || "Error cargando órdenes");
        } finally { setLoading(false); }
    }

    useEffect(() => { /* noop initial */ }, []);

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-2xl font-bold">Órdenes de Laboratorio</h1>
            <p className="text-gray-600">Enfermería puede consultar los exámenes enviados a pacientes.</p>

            <div className="flex items-center gap-2">
                <Input placeholder="patientId" value={patientId} onChange={e => setPatientId(e.target.value)} />
                <Button onClick={load} disabled={loading}>Buscar</Button>
            </div>

            {loading && <p className="text-sm text-gray-500">Cargando...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="space-y-2">
                {orders.length === 0 && !loading && (
                    <p className="text-sm text-gray-500">Sin órdenes de laboratorio para este paciente.</p>
                )}
                {orders.map(o => (
                    <div key={o.id} className="border rounded p-3">
                        <div className="flex justify-between">
                            <div>
                                <div className="font-medium">Orden #{o.id}</div>
                                <div className="text-sm text-gray-600">Solicitado: {new Date(o.createdAt).toLocaleString()}</div>
                                {o.clinicalNotes && <div className="text-sm">Notas: {o.clinicalNotes}</div>}
                            </div>
                            <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Laboratorio</div>
                        </div>
                        <ul className="mt-2 list-disc list-inside text-sm">
                            {o.requestedTests.map((t, idx) => (<li key={idx}>{t}</li>))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
