import { normalizeStatus } from "@/app/servicios/appointment.service";

describe('normalizeStatus', () => {
  const cases: Array<[string | null | undefined, string]> = [
    [undefined, 'scheduled'],
    [null, 'scheduled'],
    ['PENDING', 'scheduled'],
    ['PROGRAMADA', 'scheduled'],
    ['CONFIRMED', 'confirmed'],
    ['CONFIRMADA', 'confirmed'],
    ['IN_PROGRESS', 'in_progress'],
    ['EN_CURSO', 'in_progress'],
    ['COMPLETED', 'completed'],
    ['COMPLETADA', 'completed'],
    ['CANCELLED', 'cancelled'],
    ['CANCELADA', 'cancelled'],
    ['NO_SHOW', 'no_show'],
    ['NO SHOW', 'no_show'],
    // Valor inesperado => fallback
    ['DESCONOCIDO', 'scheduled']
  ];

  test.each(cases)('"%s" -> %s', (input, expected) => {
    expect(normalizeStatus(input as any)).toBe(expected);
  });
});
