export type SlotStatus = 'AVAILABLE' | 'BLOCKED' | 'BOOKED';

export interface ScheduleSlot {
    id: number;
    start: string; // ISO
    end: string;   // ISO
    status: SlotStatus;
    blockReason: string | null;
}

export type AppointmentStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';

export interface AppointmentUserLite {
    id: number;
    fullname: string;
}

export interface Appointment {
    id: number;
    date: string; // ISO
    status: AppointmentStatus;
    user?: AppointmentUserLite;
    doctor?: AppointmentUserLite;
    reason?: string | null;
}

export interface ConfigureSchedulePayload {
    date?: string; // YYYY-MM-DD
    from?: string; // ISO
    to?: string;   // ISO
    startHour: string; // HH:mm
    endHour: string;   // HH:mm
    slotMinutes?: number; // default 30
    overwrite?: boolean;  // default true
}

export interface BlockRangePayload {
    start: string; // ISO
    end: string;   // ISO
    reason?: string;
}

export type NotificationKind =
    | 'APPOINTMENT_CREATED'
    | 'APPOINTMENT_STATUS_CHANGED'
    | 'SCHEDULE_CONFIGURED'
    | 'SCHEDULE_BLOCKED'
    | 'INFO'
    | 'ERROR';

export interface UILocalNotification {
    id: string;
    kind: NotificationKind;
    title: string;
    message: string;
    createdAt: number;
    read?: boolean;
}
