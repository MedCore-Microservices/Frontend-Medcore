const BUSINESS_URL = process.env.NEXT_PUBLIC_MS_BUSINESS_URL || "http://localhost:3002";
import { getAuthTokenClient } from "@/lib/getAuthToken";

export type MedicalOrderType = "LABORATORY" | "RADIOLOGY";
export type MedicalOrderPayload = {
    patientId: number;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    clinicalNotes?: string;
    requestedTests: string[]; // nombres de exámenes
    requested5At?: string; // ISO
};

export type MedicalOrderDTO = {
    id: number;
    type: MedicalOrderType;
    patientId: number;
    doctorId: number;
    priority?: string;
    clinicalNotes?: string;
    requestedTests: string[];
    createdAt: string;
};

function authHeadersJson(): HeadersInit {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    const token = getAuthTokenClient();
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
}

async function parse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = `Error ${res.status}`;
        try { const j = await res.json(); if (j.message) msg = j.message; } catch { }
        throw new Error(msg);
    }
    const json = await res.json();
    return (json.data ?? json) as T;
}

export async function createLaboratoryOrder(payload: Omit<MedicalOrderPayload, "patientId"> & { patientId: number }): Promise<MedicalOrderDTO> {
    const res = await fetch(`${BUSINESS_URL}/api/medical-orders/laboratory`, {
        method: "POST",
        headers: authHeadersJson(),
        body: JSON.stringify(payload),
    });
    return parse(res);
}

export async function createRadiologyOrder(payload: Omit<MedicalOrderPayload, "patientId"> & { patientId: number }): Promise<MedicalOrderDTO> {
    const res = await fetch(`${BUSINESS_URL}/api/medical-orders/radiology`, {
        method: "POST",
        headers: authHeadersJson(),
        body: JSON.stringify(payload),
    });
    return parse(res);
}

export async function getOrder(id: number): Promise<MedicalOrderDTO> {
    const res = await fetch(`${BUSINESS_URL}/api/medical-orders/${id}`, { headers: authHeadersJson() });
    return parse(res);
}

export async function getOrdersByPatient(patientId: number, opts?: { limit?: number; offset?: number }): Promise<MedicalOrderDTO[]> {
    const params = new URLSearchParams();
    if (opts?.limit) params.append("limit", String(opts.limit));
    if (opts?.offset) params.append("offset", String(opts.offset));
    const res = await fetch(`${BUSINESS_URL}/api/medical-orders/patient/${patientId}?${params.toString()}`, { headers: authHeadersJson() });
    return parse(res);
}
