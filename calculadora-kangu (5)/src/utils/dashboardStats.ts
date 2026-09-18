import { RouteHistory } from '../types';

export type DashboardStats = {
  totalRevenue: number;
  totalExpense: number;
  estimatedProfit: number;
  totalKm: number;
  totalDeliveries: number;
  averageDailyRevenue: number;
  metaProgress: number;
  days: number;
};

export const calculateDashboardStats = (
  history: RouteHistory[],
  costPerKm: number,
  targetRevenue: number,
  fuelPrice: number,
  vehicleConsumption: number
): DashboardStats => {
  if (history.length === 0) {
    return {
      totalRevenue: 0,
      totalExpense: 0,
      estimatedProfit: 0,
      totalKm: 0,
      totalDeliveries: 0,
      averageDailyRevenue: 0,
      metaProgress: 0,
      days: 0,
    };
  }

  // Total de faturamento
  const totalRevenue = Number(
    history.reduce((acc, item) => acc + (Number(item.total) || 0), 0).toFixed(2)
  );

  // Total de KM
  const totalKm = Number(
    history.reduce((acc, item) => acc + (Number(item.km) || 0), 0).toFixed(2)
  );

  // Total de entregas
  const totalDeliveries = history.reduce((acc, item) => acc + (Number(item.addresses) || 0), 0);

  // Despesa com combustível (segura)
  const safeVehicleConsumption = Number(vehicleConsumption) || 0;
  const safeFuelPrice = Number(fuelPrice) || 0;
  const fuelExpense = safeVehicleConsumption > 0 ? Number(((totalKm / safeVehicleConsumption) * safeFuelPrice).toFixed(2)) : 0;

  // Despesa com manutenção por KM
  const safeCostPerKm = Number(costPerKm) || 0;
  const maintenanceExpense = Number((totalKm * safeCostPerKm).toFixed(2));

  // Total de despesas
  const totalExpense = Number((fuelExpense + maintenanceExpense).toFixed(2));

  // Lucro estimado
  const estimatedProfit = Number((totalRevenue - totalExpense).toFixed(2));

  // Número único de dias com registros
  const uniqueDays = new Set(history.map(item => item.date)).size;

  // Média diária
  const averageDailyRevenue = uniqueDays > 0 ? Number((totalRevenue / uniqueDays).toFixed(2)) : 0;

  // Progresso da meta
  const safeTarget = Number(targetRevenue) || 0;
  const metaProgress = safeTarget > 0 ? Math.min(Number(((totalRevenue / safeTarget) * 100).toFixed(2)), 100) : 0;

  return {
    totalRevenue,
    totalExpense,
    estimatedProfit,
    totalKm,
    totalDeliveries,
    averageDailyRevenue,
    metaProgress,
    days: uniqueDays,
  };
};

export const getProfitStatusColor = (profit: number) => {
  if (profit >= 0) return 'text-green-600 dark:text-green-400';
  return 'text-red-600 dark:text-red-400';
};

export const getProfitBgColor = (profit: number) => {
  if (profit >= 0) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
};
