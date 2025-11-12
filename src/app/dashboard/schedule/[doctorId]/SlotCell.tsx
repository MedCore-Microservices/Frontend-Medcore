"use client";
import React from 'react';
import { ScheduleSlot } from './types';

const statusClasses: Record<string, string> = {
  AVAILABLE: 'bg-green-100 border-green-400 text-green-800',
  BLOCKED: 'bg-red-100 border-red-400 text-red-800',
  BOOKED: 'bg-amber-100 border-amber-400 text-amber-800'
};

type Props = {
  slot: ScheduleSlot;
  label: string;
};

export default function SlotCell({ slot, label }: Props) {
  return (
    <div className={`border rounded px-2 py-1 text-xs flex flex-col ${statusClasses[slot.status] || ''}`}> 
      <span className="font-medium">{label}</span>
      <span>{slot.status}</span>
      {slot.blockReason && <span className="opacity-70">{slot.blockReason}</span>}
    </div>
  );
}
