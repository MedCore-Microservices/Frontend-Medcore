import { groupSlotsByDay } from '../../app/dashboard/schedule/[doctorId]/utils';
import { ScheduleSlot } from '../../app/dashboard/schedule/[doctorId]/types';

// Jest globals are provided via setup (jest.setup.js). This file just uses them.

describe('groupSlotsByDay', () => {
    it('groups slots by YYYY-MM-DD date portion of start', () => {
        const slots: ScheduleSlot[] = [
            { id: 1, start: '2025-11-11T08:00:00.000Z', end: '2025-11-11T08:30:00.000Z', status: 'AVAILABLE', blockReason: null },
            { id: 2, start: '2025-11-11T08:30:00.000Z', end: '2025-11-11T09:00:00.000Z', status: 'BOOKED', blockReason: null },
            { id: 3, start: '2025-11-12T08:00:00.000Z', end: '2025-11-12T08:30:00.000Z', status: 'BLOCKED', blockReason: 'Ausencia' }
        ];
        const grouped = groupSlotsByDay(slots);
        expect(Object.keys(grouped)).toHaveLength(2);
        expect(grouped['2025-11-11']).toHaveLength(2);
        expect(grouped['2025-11-12']).toHaveLength(1);
    });
});
