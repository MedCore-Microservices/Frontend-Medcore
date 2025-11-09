import { createAppointment, updateAppointment, deleteAppointment, listAppointmentsAll } from '@/app/servicios/appointment.service';

// Mock global fetch & storage
declare const global: any;

describe('Appointment CRUD service', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.localStorage = {
      getItem: (k: string) => (k === 'auth_token' ? 'fake-token' : null),
    } as any;
    global.sessionStorage = {
      getItem: (k: string) => null,
    } as any;
    jest.clearAllMocks();
  });

  test('createAppointment POST /api/appointments', async () => {
    const mockResponse = { appointment: { id: '10', status: 'scheduled', date: new Date().toISOString(), doctorId: '5' } };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await createAppointment({ date: mockResponse.appointment.date, doctorId: '5' });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/appointments$/), expect.objectContaining({ method: 'POST' }));
    expect(result.id).toBe('10');
    expect(result.status).toBe('scheduled');
  });

  test('updateAppointment PUT /api/appointments/:id', async () => {
    const mockResponse = { appointment: { id: '10', status: 'confirmed', date: new Date().toISOString(), doctorId: '5' } };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await updateAppointment('10', { doctorId: '5' });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/appointments\/10$/), expect.objectContaining({ method: 'PUT' }));
    expect(result.status).toBe('confirmed');
  });

  test('deleteAppointment DELETE /api/appointments/:id', async () => {
    const mockResponse = { appointment: { id: '10', status: 'cancelled' } };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await deleteAppointment('10');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/appointments\/10$/), expect.objectContaining({ method: 'DELETE' }));
    expect(result.success).toBe(true);
    expect(result.status).toBe('cancelled');
  });

  test('listAppointmentsAll GET /api/appointments', async () => {
    const mockResponse = { appointments: [ { id: '1', status: 'scheduled' }, { id: '2', status: 'completed' } ] };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const list = await listAppointmentsAll();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/appointments$/), expect.objectContaining({ method: 'GET' }));
    expect(list).toHaveLength(2);
    expect(list[1].status).toBe('completed');
  });

  test('error path createAppointment lanza excepción', async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({ message: 'Fallo creando' }) });
    await expect(createAppointment({ date: new Date().toISOString(), doctorId: '7' })).rejects.toThrow('Fallo creando');
  });
});
