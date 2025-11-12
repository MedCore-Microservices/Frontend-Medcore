"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import PatientsTable from './components/PatientsTable';
import PatientsFilters from './components/PatientsFilters';
import { searchPatients } from '@/app/servicios/patients.service';

type Patient = {
    id: number;
    fullname: string;
    identificationNumber?: string;
    gender?: string;
    age?: number;
    createdAt?: string;
};

type Filters = {
    dateFrom?: string;
    dateTo?: string;
    gender?: string;
    minAge?: string;
    maxAge?: string;
};

export default function PatientsListPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrev, setHasPrev] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({});

    const load = useCallback(async (p = 1, appliedFilters?: Filters) => {
        try {
            setLoading(true);
            const useFilters = appliedFilters ?? filters;
            const data = await searchPatients({
                dateFrom: useFilters.dateFrom,
                dateTo: useFilters.dateTo,
                gender: useFilters.gender,
                minAge: useFilters.minAge ? Number(useFilters.minAge) : undefined,
                maxAge: useFilters.maxAge ? Number(useFilters.maxAge) : undefined,
                page: p,
                limit: limit
            });

            const fetched: Patient[] = data.patients || [];
            setPatients(fetched);
            setTotal(data.pagination?.total ?? fetched.length);
            setTotalPages(data.pagination?.totalPages ?? 1);
            setHasNext(Boolean(data.pagination?.hasNext));
            setHasPrev(Boolean(data.pagination?.hasPrev));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters, limit]);

    useEffect(() => { load(1); }, [load]);

    const onApplyFilters = (f: Filters) => {
        setFilters(f);
        setPage(1);
        // pass the new filters directly to avoid stale closure
        load(1, f);
    };

    const onClearFilters = () => {
        const empty: Filters = {};
        setFilters(empty);
        setPage(1);
        load(1, empty);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Pacientes</h1>
                <Link href="/seguridad/registro-publico-usuarios" className="px-4 py-2 bg-blue-600 text-white rounded">Nuevo Paciente</Link>
            </div>

            <PatientsFilters onApply={onApplyFilters} onClear={onClearFilters} initial={filters} />

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <>
                    {/* Build a compact query string to preserve filters and page when navigating */}
                    {(() => {
                        const params = new URLSearchParams();
                        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
                        if (filters.dateTo) params.append('dateTo', filters.dateTo);
                        if (filters.gender) params.append('gender', filters.gender);
                        if (filters.minAge) params.append('minAge', String(filters.minAge));
                        if (filters.maxAge) params.append('maxAge', String(filters.maxAge));
                        if (page) params.append('page', String(page));
                        const q = params.toString();
                        return <PatientsTable patients={patients} query={q} />;
                    })()}

                    <div className="mt-4 flex items-center justify-between">
                        <div>Mostrando {patients.length} de {total} — Página {page} / {totalPages}</div>
                        <div className="space-x-2">
                            <button disabled={!hasPrev} onClick={() => { if (page > 1) { const np = page - 1; setPage(np); load(np); } }} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
                            <button disabled={!hasNext} onClick={() => { const np = page + 1; setPage(np); load(np); }} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Siguiente</button>
                        </div>
                    </div>
                </>
            )}

            {/* Botón fijo abajo a la izquierda para volver al dashboard */}
            <Link
                href="/dashboard"
                aria-label="Volver al dashboard"
                className="fixed left-4 bottom-4 z-50 inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                ← Volver
            </Link>
        </div>
    );
}
