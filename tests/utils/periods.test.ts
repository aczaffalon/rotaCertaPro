import { describe, it, expect, vi, afterEach } from 'vitest';
import { filterHistoryByPeriod } from '../../src/utils/calculations';

type H = { id: string; date: string };

const makeHistory = (dates: string[]) => dates.map((d, i) => ({ id: String(i + 1), date: d }));

describe('filterHistoryByPeriod', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('weekly respects firstDayOfWeek and includes start and end (week ends on Sunday when firstDayOfWeek=1)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));

    const now = new Date();
    const pad = (d: Date) => d.toISOString().split('T')[0];

    const nowMinus6 = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    const nowMinus7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const nowPlus1 = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const history = makeHistory([pad(nowMinus7), pad(nowMinus6), pad(now), pad(nowPlus1)]);

    const res = filterHistoryByPeriod(history as any, 'weekly', 1);
    const dates = res.map((r: any) => r.date);

    expect(dates).toContain(pad(now));
    expect(dates).toContain(pad(nowPlus1));
    expect(dates).not.toContain(pad(nowMinus6));
    expect(dates).not.toContain(pad(nowMinus7));
  });

  it('weekly includes Sunday as the last day of the Monday-Sunday period', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-18T12:00:00Z'));

    const history = makeHistory(['2026-01-12', '2026-01-18', '2026-01-19']);
    const res = filterHistoryByPeriod(history as any, 'weekly', 1);
    const dates = res.map((item: any) => item.date);

    expect(dates).toEqual(['2026-01-12', '2026-01-18']);
  });

  it('biweekly aligns windows from start of year (14-day blocks)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));

    // For 2026-01-20, dayOfYear = 20 -> biIndex = 1 -> biStartDay = 15 -> window 15..28
    const history = makeHistory(['2026-01-14', '2026-01-15', '2026-01-28', '2026-01-29']);

    const res = filterHistoryByPeriod(history as any, 'biweekly');
    const dates = res.map((r: any) => r.date);

    expect(dates).toContain('2026-01-15');
    expect(dates).toContain('2026-01-28');
    expect(dates).not.toContain('2026-01-14');
    expect(dates).not.toContain('2026-01-29');
  });

  it('monthly returns only items within the current month', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'));

    const history = makeHistory(['2026-02-28', '2026-03-01', '2026-03-31', '2026-04-01']);

    const res = filterHistoryByPeriod(history as any, 'monthly');
    const dates = res.map((r: any) => r.date);

    expect(dates).toContain('2026-03-01');
    expect(dates).toContain('2026-03-31');
    expect(dates).not.toContain('2026-02-28');
    expect(dates).not.toContain('2026-04-01');
  });

  it('month/year boundary: January should not include previous Decembers', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-05T12:00:00Z'));

    const history = makeHistory(['2025-12-31', '2026-01-01', '2026-01-31']);

    const res = filterHistoryByPeriod(history as any, 'monthly');
    const dates = res.map((r: any) => r.date);

    expect(dates).toContain('2026-01-01');
    expect(dates).toContain('2026-01-31');
    expect(dates).not.toContain('2025-12-31');
  });
});
