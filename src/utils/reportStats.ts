import { RouteHistory } from '../types';

export type ReportMetrics = {
  totalRevenue: number;
  routeCount: number;
  totalKm: number;
  totalAddresses: number;
  averagePerRoute: number;
  targetProgress: number | null;
  targetDifference: number | null;
};

export const calculateReportMetrics = (
  history: RouteHistory[],
  targetRevenue?: number
): ReportMetrics => {
  const totalRevenue = Number(
    history.reduce((total, item) => total + (Number(item.total) || 0), 0).toFixed(2)
  );
  const routeCount = history.length;
  const totalKm = Number(
    history.reduce((total, item) => total + (Number(item.km) || 0), 0).toFixed(2)
  );
  const totalAddresses = history.reduce(
    (total, item) => total + (Number(item.addresses) || 0),
    0
  );
  const averagePerRoute = routeCount > 0 ? Number((totalRevenue / routeCount).toFixed(2)) : 0;
  const safeTarget = Number(targetRevenue) || 0;

  return {
    totalRevenue,
    routeCount,
    totalKm,
    totalAddresses,
    averagePerRoute,
    targetProgress: safeTarget > 0 ? Number(((totalRevenue / safeTarget) * 100).toFixed(1)) : null,
    targetDifference: safeTarget > 0 ? Number((totalRevenue - safeTarget).toFixed(2)) : null,
  };
};

export const getReportBars = (history: RouteHistory[]) => {
  const totals = new Map<string, number>();

  history.forEach((item) => {
    totals.set(item.date, (totals.get(item.date) || 0) + (Number(item.total) || 0));
  });

  return Array.from(totals.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-7)
    .map(([date, total]) => ({ date, total: Number(total.toFixed(2)) }));
};
