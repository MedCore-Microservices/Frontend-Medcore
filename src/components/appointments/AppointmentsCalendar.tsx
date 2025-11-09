"use client";
import React, { useMemo, useState } from 'react';
import type { AppointmentDTO, AppointmentStatus } from '@/types/appointment';
import AppointmentStatusBadge from '@/components/ui/AppointmentStatusBadge';

// Calendario simple: vistas día/semana/mes con grilla simplificada.
// Está pensado como una primera versión ligera sin dependencias externas.

type Props = {
  appointments: AppointmentDTO[];
};

type View = 'day' | 'week' | 'month';

export default function AppointmentsCalendar({ appointments }: Props) {
  const [view, setView] = useState<View>('week');
  const today = new Date();

  const groupedByDate = useMemo(()=>{
    const map = new Map<string, AppointmentDTO[]>();
    for (const a of appointments) {
      const key = a.date ? new Date(a.date).toDateString() : 'Sin fecha';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return map;
  }, [appointments]);

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-600'>Vista:</span>
        <div className='inline-flex border rounded overflow-hidden'>
          {(['day','week','month'] as View[]).map(v => (
            <button key={v} onClick={()=>setView(v)} className={`px-3 py-1 ${view===v? 'bg-gray-800 text-white':'bg-white text-gray-700 hover:bg-gray-50'}`}>{v}</button>
          ))}
        </div>
      </div>
      {/* Render simplificado: lista agrupada por día; en futuras iteraciones reemplazar por cuadrículas y time slots */}
      {Array.from(groupedByDate.entries()).map(([dateLabel, items]) => (
        <div key={dateLabel} className='border rounded'>
          <div className='px-3 py-2 bg-gray-50 text-sm font-medium'>{dateLabel}</div>
          <div className='divide-y'>
            {items.map(i => (
              <div key={i.id} className='p-3 flex items-center justify-between'>
                <div>
                  <div className='font-medium'>Cita #{i.id}</div>
                  {i.date && <div className='text-xs text-gray-600'>{new Date(i.date).toLocaleTimeString()}</div>}
                  {i.doctorName && <div className='text-xs'>{i.doctorName}</div>}
                  {i.patientName && <div className='text-xs'>{i.patientName}</div>}
                </div>
                <AppointmentStatusBadge status={i.status} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
