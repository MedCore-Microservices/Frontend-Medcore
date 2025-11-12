"use client";
import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSchedule } from './useSchedule';
import { useAppointments } from './useAppointments';
import { groupSlotsByDay } from './utils';
import ScheduleToolbar from './ScheduleToolbar';
import { Appointment, ConfigureSchedulePayload } from './types';
import DayGrid from './DayGrid';
import { useNotifications } from '../../components/NotificationsProvider';

export default function DoctorSchedulePage() {
    const params = useParams();
    const doctorIdParam = params?.doctorId as string | undefined;
    const doctorId = doctorIdParam ? parseInt(doctorIdParam, 10) : 0;

    const { slots, loading, error, fetchAvailability, configureSchedule, blockRange } = useSchedule(doctorId);
    const { appointments, fetchDoctorAppointments } = useAppointments(doctorId);
    const { push } = useNotifications();

    const [pendingBlockDay, setPendingBlockDay] = React.useState<string | null>(null);
    const [conflictAppts, setConflictAppts] = React.useState<Appointment[]>([]);
    const [showConflictModal, setShowConflictModal] = React.useState(false);

    React.useEffect(() => {
        fetchDoctorAppointments();
    }, [fetchDoctorAppointments]);

    const grouped = useMemo(() => groupSlotsByDay(slots), [slots]);
    const days = useMemo(() => Object.keys(grouped).sort(), [grouped]);

        const formatDate = (isoOrDateString: string) => {
                const d = new Date(isoOrDateString);
                return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };

        return (
                <div className="p-4 space-y-4">
            <h1 className="text-xl font-semibold">Agenda del Médico #{doctorId}</h1>
                        <ScheduleToolbar
                            doctorId={doctorId}
                            slots={slots}
                                            onConfigure={async (payload: ConfigureSchedulePayload) => {
                                                const result = await configureSchedule(payload);
                                                const fromDay = payload.from ? formatDate(payload.from) : '';
                                                const toDay = payload.to ? formatDate(payload.to) : '';
                                                const rangeTxt = fromDay && toDay ? `del ${fromDay} al ${toDay}` : '';
                                                const stats = `(${result.created} nuevos / ${result.updated} actualizados)`;
                                                // Persistente para que aparezca en la campana aunque el toast se cierre
                                                push('SCHEDULE_CONFIGURED', 'Horarios disponibles', `${rangeTxt} ${stats}`.trim(), { persistent: true });
                                                fetchAvailability();
                                            }}
                            onBlockDay={async (isoDate) => {
                                const apptsConflict = appointments.filter(a => a.date.startsWith(isoDate));
                                if (apptsConflict.length) {
                                    setPendingBlockDay(isoDate);
                                    setConflictAppts(apptsConflict);
                                    setShowConflictModal(true);
                                } else {
                                    const start = new Date(isoDate + 'T00:00:00');
                                    const end = new Date(isoDate + 'T23:59:59');
                                    await blockRange({ start: start.toISOString(), end: end.toISOString(), reason: 'Bloqueo completo' });
                                      push('SCHEDULE_BLOCKED', 'Día bloqueado', formatDate(isoDate), { persistent: true });
                                    fetchAvailability();
                                }
                            }}
                            reloadAvailability={() => fetchAvailability()}
                        />

            {loading && <p>Cargando disponibilidad...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {days.length === 0 && !loading && <p>No hay horarios configurados.</p>}
            <div className="space-y-8">
                {days.map(day => (
                    <DayGrid key={day} day={day} slots={grouped[day]} />
                ))}
            </div>

            <LocalToaster />

            <InlineConflictModal
                open={showConflictModal}
                date={pendingBlockDay}
                appointments={conflictAppts}
                onCancel={() => { setShowConflictModal(false); setPendingBlockDay(null); setConflictAppts([]); }}
                onConfirm={async () => {
                    if (!pendingBlockDay) return;
                    const start = new Date(pendingBlockDay + 'T00:00:00');
                    const end = new Date(pendingBlockDay + 'T23:59:59');
                    await blockRange({ start: start.toISOString(), end: end.toISOString(), reason: 'Bloqueo completo (forzado)' });
                    push('SCHEDULE_BLOCKED', 'Día bloqueado', pendingBlockDay, { persistent: true });
                    setShowConflictModal(false);
                    setPendingBlockDay(null);
                    setConflictAppts([]);
                    fetchAvailability();
                }}
            />
        </div>
    );
}

function InlineConflictModal({ open, date, appointments, onCancel, onConfirm }: {
    open: boolean; date: string | null; appointments: Appointment[]; onCancel: () => void; onConfirm: () => void | Promise<void>;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded shadow-lg w-full max-w-md p-4 space-y-4 z-50">
                <h3 className="text-lg font-semibold">Conflictos al bloquear día</h3>
                <p className="text-sm">El día <strong>{date}</strong> tiene {appointments.length} cita(s). Si continúas se bloquearán los slots igualmente.</p>
                <div className="max-h-40 overflow-auto border rounded p-2 text-xs space-y-1">
                    {appointments.map(a => (
                        <div key={a.id} className="flex justify-between">
                            <span>{new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="uppercase tracking-wide font-medium text-gray-600">{a.status}</span>
                        </div>
                    ))}
                    {appointments.length === 0 && <p>No hay citas.</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="px-3 py-1 rounded border">Cancelar</button>
                    <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600 text-white">Bloquear igualmente</button>
                </div>
            </div>
        </div>
    );
}

function LocalToaster() {
    const { notifications, markAllRead, remove } = useNotifications();
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 w-72">
            {notifications.slice(0,5).map(n => (
                <div key={n.id} className="rounded shadow border p-3 text-xs bg-white animate-fade-in">
                    <div className="flex justify-between mb-1">
                        <strong className="text-[11px] uppercase tracking-wide">{n.title}</strong>
                        <button onClick={() => remove(n.id)} className="text-[10px] opacity-60 hover:opacity-100">✕</button>
                    </div>
                    <p>{n.message}</p>
                </div>
            ))}
            {notifications.length > 0 && (
                <button onClick={markAllRead} className="text-[10px] underline text-right block w-full opacity-70 hover:opacity-100">Cerrar todas</button>
            )}
        </div>
    );
}
