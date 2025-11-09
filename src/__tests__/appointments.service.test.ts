import { confirmAppointment, listAppointmentsByPatient } from "@/app/servicios/business.service";

// Mock global fetch
declare const global: any;

describe('Appointment service', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    // Simular token
    global.localStorage = {
      getItem: (k: string) => k === 'auth_token' ? 'fake-token' : null,
    } as any;
  });

  test('confirmAppointment hace POST a /confirm y devuelve JSON', async () => {
    const mockResponse = { id: '123', status: 'confirmed' };
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await confirmAppointment('123');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/appointments\/123\/confirm$/), expect.objectContaining({ method: 'POST' }));
    expect(result).toEqual(mockResponse);
  });

  test('listAppointmentsByPatient obtiene lista de citas', async () => {
    const mockList = [
      { id: 'a1', status: 'scheduled' },
      { id: 'a2', status: 'completed' }
    ];
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockList });

    // @ts-ignore
    const list = await listAppointmentsByPatient('55');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/appointments\/patient\/55$/), expect.objectContaining({ method: 'GET' }));
    expect(list).toHaveLength(2);
  });

  test('error en confirmAppointment lanza excepción', async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({ message: 'Fallo' }) });
    await expect(confirmAppointment('999')).rejects.toThrow('Fallo');
  });
});
