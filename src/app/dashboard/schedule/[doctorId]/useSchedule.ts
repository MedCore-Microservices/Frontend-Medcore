import { useCallback, useEffect, useState } from 'react';
import { AUTH_MS_URL, apiFetch } from './useApi';
import {
  ScheduleSlot,
  ConfigureSchedulePayload,
  BlockRangePayload
} from './types';

interface AvailabilityResponse { availability: ScheduleSlot[] }
interface ConfigureResponse { message: string; result: { created: number; updated: number } }
interface BlockResponse { message: string; result: { blockedFrom: string; blockedTo: string } }

export function useSchedule(doctorId: number) {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (from?: string, to?: string) => {
    if (!doctorId) return;
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const data = await apiFetch<AvailabilityResponse>(`${AUTH_MS_URL}/api/schedule/${doctorId}?${params.toString()}`);
      setSlots(data.availability || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error fetching availability');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  const configureSchedule = useCallback(async (payload: ConfigureSchedulePayload) => {
    const data = await apiFetch<ConfigureResponse>(`${AUTH_MS_URL}/api/schedule/${doctorId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return data.result;
  }, [doctorId]);

  const blockRange = useCallback(async (payload: BlockRangePayload) => {
    const data = await apiFetch<BlockResponse>(`${AUTH_MS_URL}/api/schedule/${doctorId}/block`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    return data.result;
  }, [doctorId]);

  useEffect(() => {
    // carga inicial 7 días (backend ya hace default)
    fetchAvailability();
  }, [fetchAvailability]);

  return {
    slots,
    loading,
    error,
    fetchAvailability,
    configureSchedule,
    blockRange
  };
}
