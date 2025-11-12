"use client";
import React from 'react';
import { ConfigureSchedulePayload, ScheduleSlot } from './types';
import { todayISODate, addDays } from './utils';
import CalendarSlotPicker from './CalendarSlotPicker';

type Props = {
    doctorId: number;
    onConfigure: (payload: ConfigureSchedulePayload) => Promise<void>;
    onBlockDay: (isoDate: string) => Promise<void>;
    reloadAvailability: () => void;
    slots?: ScheduleSlot[]; // para colorear calendario
};

export default function ScheduleToolbar({ doctorId, onConfigure, onBlockDay, reloadAvailability, slots = [] }: Props) {
    const [dateFrom, setDateFrom] = React.useState(todayISODate());
    const [dateTo, setDateTo] = React.useState(addDays(todayISODate(), 6));
    const [startHour, setStartHour] = React.useState('08:00');
    const [endHour, setEndHour] = React.useState('13:00');
    const [slotMinutes, setSlotMinutes] = React.useState(30);
    const [overwrite, setOverwrite] = React.useState(true);
    const [blockDay, setBlockDay] = React.useState(todayISODate());
    const [showCalendar, setShowCalendar] = React.useState(false);

    const handleConfigure = async () => {
        if (!doctorId) return;
        if (!startHour || !endHour) return;
        const fromISO = new Date(`${dateFrom}T00:00:00`).toISOString();
        const toISO = new Date(`${dateTo}T00:00:00`).toISOString();
        await onConfigure({ from: fromISO, to: toISO, startHour, endHour, slotMinutes, overwrite });
        reloadAvailability();
    };

    const handleBlockDay = async () => {
        await onBlockDay(blockDay);
    };

    return (
        <div className="rounded border p-3 space-y-3">
            <div className="flex flex-wrap gap-2 items-end">
                <div>
                    <label className="block text-xs">Desde</label>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border px-2 py-1 rounded" />
                </div>
                <div>
                    <label className="block text-xs">Hasta</label>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border px-2 py-1 rounded" />
                </div>
                <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded"
                    onClick={() => setShowCalendar(s => !s)}
                >
                    {showCalendar ? 'Ocultar calendario' : 'Seleccionar en calendario'}
                </button>
                <div>
                    <label className="block text-xs">Inicio</label>
                    <input type="time" value={startHour} onChange={e => setStartHour(e.target.value)} className="border px-2 py-1 rounded" />
                </div>
                <div>
                    <label className="block text-xs">Fin</label>
                    <input type="time" value={endHour} onChange={e => setEndHour(e.target.value)} className="border px-2 py-1 rounded" />
                </div>
                <div>
                    <label className="block text-xs">Slot (min)</label>
                    <select value={slotMinutes} onChange={e => setSlotMinutes(Number(e.target.value))} className="border px-2 py-1 rounded">
                        {[15, 20, 30, 45, 60].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={overwrite} onChange={e => setOverwrite(e.target.checked)} /> overwrite
                </label>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleConfigure}>Configurar horarios</button>
            </div>
            {showCalendar && (
                <div className="mt-2">
                    <CalendarSlotPicker
                        selectedFrom={dateFrom ? new Date(dateFrom) : undefined}
                        selectedTo={dateTo ? new Date(dateTo) : undefined}
                        onChange={(from, to) => {
                            const fmt = (d?: Date) => d ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0,10) : '';
                            if (from) setDateFrom(fmt(from));
                            if (to) setDateTo(fmt(to));
                        }}
                        slots={slots.map(s => ({ start: s.start, status: s.status }))}
                    />
                </div>
            )}
            <div className="flex items-end gap-2">
                <div>
                    <label className="block text-xs">Bloquear día</label>
                    <input type="date" value={blockDay} onChange={e => setBlockDay(e.target.value)} className="border px-2 py-1 rounded" />
                </div>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={handleBlockDay}>Bloquear día completo</button>
            </div>
        </div>
    );
}
