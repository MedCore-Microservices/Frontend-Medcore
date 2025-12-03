"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * QuickActions: acciones rápidas del doctor
 * - Nueva consulta
 * - Ver agenda (citas del día)
 * - Nueva prescripción
 * - Nueva orden médica
 */
export type QuickActionsProps = {
    className?: string;
    patientId?: string | number; // opcional para acciones contextuales
};

export default function QuickActions({ className, patientId }: QuickActionsProps) {
    return (
        <div className={cn("grid gap-2 sm:grid-cols-2 lg:grid-cols-4", className)}>
            <Link href={patientId ? `/doctor/consultation/new/${patientId}` : `/doctor/consultations`}>
                <Button variant="default" className="w-full">Nueva consulta</Button>
            </Link>
            <Link href={`/dashboard/appointments`}>
                <Button variant="secondary" className="w-full">Ver agenda</Button>
            </Link>
            <Link href={patientId ? `/dashboard/doctor/prescriptions/new/${patientId}` : `/dashboard/doctor/prescriptions`}>
                <Button variant="default" className="w-full">Nueva prescripción</Button>
            </Link>
            <Link href={patientId ? `/dashboard/doctor/orders/new/${patientId}` : `/dashboard/doctor/orders/new`}>
                <Button variant="outline" className="w-full">Nueva orden médica</Button>
            </Link>
        </div>
    );
}
