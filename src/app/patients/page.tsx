"use client";

import { useEffect, useState, useCallback } from 'react';
import PatientsTable from './components/PatientsTable';
import PatientsFilters from './components/PatientsFilters';
import { searchPatientsAdvanced } from '@/app/servicios/business.service';

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
    const [filters, setFilters] = useState<Filters>({});

        const load = useCallback(async (p = 1) => {
        try {
            setLoading(true);
                // send only supported filters to backend (dateFrom/dateTo, diagnostic/search, page, limit)
                const data = await searchPatientsAdvanced({
                    dateFrom: filters.dateFrom,
                    dateTo: filters.dateTo,
                    page: p,
                    limit: limit,
                });
                const fetched: Patient[] = data.patients || [];

                // apply client-side filters for gender and age (backend does not support gender/age params)
                const filtered = fetched.filter((pt: Patient) => {
                    if (filters.gender && pt.gender !== filters.gender) return false;
                    if (filters.minAge && typeof pt.age === 'number' && pt.age < parseInt(filters.minAge)) return false;
                    if (filters.maxAge && typeof pt.age === 'number' && pt.age > parseInt(filters.maxAge)) return false;
                    return true;
                });

                setPatients(filtered);
                setTotal(data.pagination?.total ?? filtered.length);
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
        load(1);
    };

    const onClearFilters = () => {
        const empty: Filters = {};
        setFilters(empty);
        setPage(1);
        load(1);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Pacientes</h1>
                <a href="/patients/new" className="px-4 py-2 bg-blue-600 text-white rounded">Nuevo Paciente</a>
            </div>

            <PatientsFilters onApply={onApplyFilters} onClear={onClearFilters} initial={filters} />

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <>
                    <PatientsTable patients={patients} />

                    <div className="mt-4 flex items-center justify-between">
                        <div>Mostrando {patients.length} de {total}</div>
                        <div className="space-x-2">
                            <button onClick={() => { if (page > 1) { setPage(page - 1); load(page - 1); } }} className="px-3 py-1 bg-gray-200 rounded">Anterior</button>
                            <button onClick={() => { setPage(page + 1); load(page + 1); }} className="px-3 py-1 bg-gray-200 rounded">Siguiente</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
