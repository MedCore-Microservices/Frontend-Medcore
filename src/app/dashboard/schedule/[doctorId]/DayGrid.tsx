"use client";
import React from 'react';
import { ScheduleSlot } from './types';
import { formatHourRange } from './utils';
import SlotCell from './SlotCell';

type Props = {
  day: string; // YYYY-MM-DD
  slots: ScheduleSlot[];
};

export default function DayGrid({ day, slots }: Props) {
  return (
    <div>
      <h3 className="font-medium mb-2">{day}</h3>
      <div className="grid grid-cols-2 gap-2">
        {slots.filter(s => s.status !== 'BLOCKED').map((s) => (
          <SlotCell key={s.id} slot={s} label={formatHourRange(s.start, s.end)} />
        ))}
        {slots.every(s => s.status === 'BLOCKED') && (
          <p className="text-sm text-gray-500 col-span-2">Día bloqueado completo.</p>
        )}
      </div>
    </div>
  );
}
