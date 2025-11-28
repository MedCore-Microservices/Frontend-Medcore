import React from 'react';
import { Card, CardContent } from './ui/card';
import AppointmentStatusBadge from './ui/AppointmentStatusBadge';

export default function ConsultationCard({ consultation = {}, selected = false, onSelect = () => {}, onView = () => {}, onCreateOrder = () => {} }) {
  const { id, patientName, patientId, date, reason, status } = consultation || {};

  return (
    <Card className={`${selected ? 'border-primary bg-muted' : ''} cursor-pointer`} onClick={() => onSelect(consultation)}>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Paciente</div>
              <div className="text-xs text-muted-foreground">{date ? new Date(date).toLocaleString() : '—'}</div>
            </div>
            <div className="font-semibold text-base mt-1">{patientName || 'Paciente desconocido'}</div>
            {reason && <div className="text-sm text-muted-foreground mt-1">{reason}</div>}
          </div>

          <div className="flex flex-col items-end gap-3">
            <AppointmentStatusBadge status={(status || 'ACTIVE').toUpperCase()} />
            <div className="flex flex-col items-end gap-2">
              <button
                className="px-3 py-1 rounded-md bg-primary text-white text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(consultation);
                }}
              >
                Ver
              </button>
              <button
                className="px-3 py-1 rounded-md border text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateOrder(consultation);
                }}
              >
                Orden
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
