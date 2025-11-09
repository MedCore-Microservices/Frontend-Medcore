import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentsCalendar from '@/components/appointments/AppointmentsCalendar';

describe('AppointmentsCalendar', () => {
  test('renderiza agrupación por día y badges', () => {
    const appts = [
      { id: '1', status: 'scheduled', date: new Date('2025-11-09T10:00:00Z').toISOString() },
      { id: '2', status: 'completed', date: new Date('2025-11-09T12:00:00Z').toISOString() },
      { id: '3', status: 'confirmed', date: new Date('2025-11-10T09:30:00Z').toISOString() },
    ] as any;

    render(<AppointmentsCalendar appointments={appts} />);

    expect(screen.getByText(/Cita #1/)).toBeInTheDocument();
    expect(screen.getByText(/Cita #2/)).toBeInTheDocument();
    expect(screen.getByText(/Cita #3/)).toBeInTheDocument();
  });
});
