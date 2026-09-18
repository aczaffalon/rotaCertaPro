import { describe, it, expect } from 'vitest';
import { calculateRoute, validateRouteInput } from '../../src/utils/calculations';

describe('calculateRoute', () => {
  it('returns zero total for empty inputs', () => {
    const res = calculateRoute('', '', false, 'AM');
    expect(res.total).toBe(0);
  });

  it('applies weekday base for 100 km', () => {
    const res = calculateRoute(100, '', false, 'AM');
    expect(res.baseRate).toBeCloseTo(262.73, 2);
  });

  it('applies sunday or holiday base for 100 km', () => {
    const res = calculateRoute(100, '', true, 'AM');
    expect(res.baseRate).toBeCloseTo(394.10, 2);
  });

  it('applies +50% on sunday or holiday rates in AM and PM', () => {
    const amSunday = calculateRoute(100, '', true, 'AM');
    const pmSunday = calculateRoute(100, '', true, 'PM');

    expect(amSunday.baseRate).toBeCloseTo(262.73 * 1.5, 2);
    expect(pmSunday.baseRate).toBeCloseTo(207.10 * 1.5, 2);
  });

  it('applies the next bracket to decimal distances above a limit', () => {
    const res = calculateRoute(100.01, '', false, 'PM');
    expect(res.baseRate).toBeCloseTo(236.94, 2);
  });

  it('applies PM rates for sunday or holidays with +50%', () => {
    const res = calculateRoute(300, '', true, 'PM');
    expect(res.baseRate).toBeCloseTo(450.72, 2);
  });

  it('calculates bonus for address boundaries', () => {
    const a60 = calculateRoute(0, 60, false, 'AM');
    expect(a60.bonus).toBeCloseTo(60 * 0.37, 2);

    const a61 = calculateRoute(0, 61, false, 'AM');
    expect(a61.bonus).toBeCloseTo((60 * 0.37) + (1 * 2.0), 2);

    const a91 = calculateRoute(0, 91, false, 'AM');
    expect(a91.bonus).toBeCloseTo((60 * 0.37) + (30 * 2.0) + (1 * 1.04), 2);
  });

  it('rejects invalid route inputs before saving', () => {
    expect(validateRouteInput('', 10, '2026-09-18', false, 'AM')).toBe('Informe o KM total rodado.');
    expect(validateRouteInput(100, -1, '2026-09-18', false, 'AM')).toBe('Informe a quantidade de endereços válida.');
    expect(validateRouteInput(100, 10, '', false, 'AM')).toBe('Informe uma data válida.');
    expect(validateRouteInput(0, 0, '2026-09-18', false, 'AM')).toBe('Informe KM e/ou endereços antes de salvar.');
    expect(validateRouteInput(100, 10, '2026-09-18', false, 'AM')).toBeNull();
  });
});
