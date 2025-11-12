import React from 'react';
import { render, screen } from '@testing-library/react';
import DayGrid from '../../app/dashboard/schedule/[doctorId]/DayGrid';
import { ScheduleSlot } from '../../app/dashboard/schedule/[doctorId]/types';

const sample: ScheduleSlot[] = [
  { id: 1, start: '2025-11-11T08:00:00.000Z', end: '2025-11-11T08:30:00.000Z', status: 'AVAILABLE', blockReason: null },
  { id: 2, start: '2025-11-11T08:30:00.000Z', end: '2025-11-11T09:00:00.000Z', status: 'BOOKED', blockReason: null },
  { id: 3, start: '2025-11-11T09:00:00.000Z', end: '2025-11-11T09:30:00.000Z', status: 'BLOCKED', blockReason: 'Ausencia' }
];

describe('DayGrid', () => {
  it('renders slots with status labels', () => {
    render(<DayGrid day="2025-11-11" slots={sample} />);
    expect(screen.getByText(/2025-11-11/)).toBeInTheDocument();
    expect(screen.getAllByText(/AVAILABLE|BOOKED|BLOCKED/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/Ausencia/)).toBeInTheDocument();
  });
});
