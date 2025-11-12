"use client";
import React from 'react';
import { Appointment } from './types';

interface Props {
  open: boolean;
  date: string | null;
  appointments: Appointment[];
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function ConflictModal({ open, date, appointments, onCancel, onConfirm }: Props) {
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