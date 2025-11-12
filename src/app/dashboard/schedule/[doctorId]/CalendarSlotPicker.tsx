"use client";
import React, { useMemo } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type Props = {
    selectedFrom: Date | undefined;
    selectedTo: Date | undefined;
    onChange: (from: Date | undefined, to: Date | undefined) => void;
    // Todos los slots disponibles del médico (para colorear días)
    slots?: { start: string; status: 'AVAILABLE' | 'BLOCKED' | 'BOOKED' }[];
};

export default function CalendarSlotPicker({ selectedFrom, selectedTo, onChange, slots = [] }: Props) {
    const [range, setRange] = React.useState<DateRange | undefined>(selectedFrom || selectedTo ? { from: selectedFrom, to: selectedTo } : undefined);

        // Construir mapa de estado por día
        const dayStatus = useMemo(() => {
            const map: Record<string, { blocked: number; available: number; booked: number }> = {};
            slots.forEach(s => {
                const day = s.start.split('T')[0];
                map[day] ||= { blocked: 0, available: 0, booked: 0 };
                if (s.status === 'BLOCKED') map[day].blocked++;
                if (s.status === 'AVAILABLE') map[day].available++;
                if (s.status === 'BOOKED') map[day].booked++;
            });
            return map;
        }, [slots]);

        const modifiers = useMemo(() => {
            const blockedDays: Date[] = [];
            const availableDays: Date[] = [];
            Object.entries(dayStatus).forEach(([day, counts]) => {
                const d = new Date(day + 'T00:00:00');
                if (counts.blocked > 0 && counts.available === 0 && counts.booked === 0) {
                    blockedDays.push(d);
                } else if (counts.available > 0) {
                    availableDays.push(d);
                }
            });
            return { blockedDay: blockedDays, availableDay: availableDays };
        }, [dayStatus]);

        const style = `
            .rdp-day_blockedDay { background: #fecaca !important; color:#7f1d1d; }
            .rdp-day_availableDay { background: #dcfce7 !important; color:#14532d; }
            .rdp-day_blockedDay:hover { background:#fca5a5 !important; }
            .rdp-day_availableDay:hover { background:#bbf7d0 !important; }
        `;

    return (
            <div className="bg-white border rounded p-2">
                <style>{style}</style>
                <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={(r: DateRange | undefined) => { setRange(r); onChange(r?.from, r?.to); }}
                    numberOfMonths={2}
                    weekStartsOn={1}
                    modifiers={modifiers}
                />
            </div>
    );
}
