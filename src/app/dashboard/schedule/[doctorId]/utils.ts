import { ScheduleSlot } from './types';

export const groupSlotsByDay = (slots: ScheduleSlot[]) => {
  return slots.reduce<Record<string, ScheduleSlot[]>>((acc, slot) => {
    const dayKey = slot.start.split('T')[0];
    (acc[dayKey] ||= []).push(slot);
    return acc;
  }, {});
};

export const formatHour = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatHourRange = (start: string, end: string) => {
  return `${formatHour(start)} - ${formatHour(end)}`;
};

export const todayISODate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

export const addDays = (isoDate: string, days: number) => {
  const base = new Date(`${isoDate}T00:00:00`);
  base.setDate(base.getDate() + days);
  return base.toISOString().split('T')[0];
};
