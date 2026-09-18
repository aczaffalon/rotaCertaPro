export type RouteHistory = {
  id: string;
  date: string;
  routeName: string;
  observations: string;
  isSunday: boolean;
  period?: 'AM' | 'PM';
  km: number | '';
  addresses: number | '';
  baseRate: number;
  bonus: number;
  total: number;
};

export type Theme = 'light' | 'dark' | 'system';

export type CalculationResult = {
  baseRate: number;
  bonus: number;
  total: number;
};

export type ClosureType = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export type AppConfig = {
  platformName: string;
  closureType: ClosureType;
  firstDayOfWeek: number;
  targetRevenue: number;
  costPerKm: number;
  vehicleConsumption: number;
  fuelPrice: number;
};

export type ConfigContextType = {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  resetConfig: () => void;
};
