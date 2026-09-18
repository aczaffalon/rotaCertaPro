import { describe, expect, it } from 'vitest';
import { calculateReportMetrics, getReportBars } from '../../src/utils/reportStats';

const history = [
  { date: '2026-09-07', total: 200.5, km: 80, addresses: 30 },
  { date: '2026-09-07', total: 100, km: 40, addresses: 15 },
  { date: '2026-09-08', total: 300, km: 120, addresses: 45 },
] as any;

describe('reportStats', () => {
  it('calcula os indicadores do período filtrado', () => {
    expect(calculateReportMetrics(history, 700)).toEqual({
      totalRevenue: 600.5,
      routeCount: 3,
      totalKm: 240,
      totalAddresses: 90,
      averagePerRoute: 200.17,
      targetProgress: 85.8,
      targetDifference: -99.5,
    });
  });

  it('não calcula comparação quando a meta não está configurada', () => {
    const metrics = calculateReportMetrics([], 0);

    expect(metrics.totalRevenue).toBe(0);
    expect(metrics.averagePerRoute).toBe(0);
    expect(metrics.targetProgress).toBeNull();
    expect(metrics.targetDifference).toBeNull();
  });

  it('agrupa ganhos por dia e mantém somente os últimos sete dias', () => {
    const bars = getReportBars(history);

    expect(bars).toEqual([
      { date: '2026-09-07', total: 300.5 },
      { date: '2026-09-08', total: 300 },
    ]);
  });
});
