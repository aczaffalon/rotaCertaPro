import { CalculationResult, RouteHistory } from '../types';
import { BASE_RATE_BRACKETS, BONUS_TIERS } from './constants';

export const validateRouteInput = (
  km: number | '',
  addresses: number | '',
  routeDate: string,
  isSunday: boolean,
  period: 'AM' | 'PM' = 'AM'
): string | null => {
  if (!routeDate || Number.isNaN(new Date(routeDate).getTime())) {
    return 'Informe uma data válida.';
  }

  const hasKm = km !== '' && Number.isFinite(Number(km)) && Number(km) >= 0 && Number(km) > 0;
  const hasAddresses = addresses !== '' && Number.isFinite(Number(addresses)) && Number(addresses) >= 0 && Number(addresses) > 0;

  if (!hasKm && !hasAddresses) {
    return 'Informe KM e/ou endereços antes de salvar.';
  }

  if (km !== '' && (!Number.isFinite(Number(km)) || Number(km) < 0)) {
    return 'Informe o KM total rodado.';
  }

  if (km === '' || Number(km) <= 0) {
    return 'Informe o KM total rodado.';
  }

  if (addresses !== '' && (!Number.isFinite(Number(addresses)) || Number(addresses) < 0)) {
    return 'Informe a quantidade de endereços válida.';
  }

  if (addresses !== '' && Number(addresses) > 0 && !Number.isInteger(Number(addresses))) {
    return 'Informe a quantidade de endereços em número inteiro.';
  }

  if (isSunday && period === 'AM') {
    return null;
  }

  return null;
};

export const calculateRoute = (
  km: number | '',
  addresses: number | '',
  isSunday: boolean,
  period: 'AM' | 'PM' = 'AM'
): CalculationResult => {
  const numKm = Number(km);
  const numAddresses = Number(addresses);
  let baseRate = 0;

  if (km !== '' && Number.isFinite(numKm) && numKm >= 0) {
    for (const bracket of BASE_RATE_BRACKETS) {
      const maxOk = bracket.maxKm === undefined ? true : numKm <= bracket.maxKm;
      if (maxOk) {
        const weekdayRate = period === 'AM' ? bracket.amWeekday : bracket.pmWeekday;
        baseRate = weekdayRate * (isSunday ? 1.5 : 1);
        break;
      }
    }
  }

  let bonus = 0;
  if (addresses !== '' && Number.isFinite(numAddresses) && numAddresses > 0) {
    const n = Math.floor(numAddresses);
    const { tier1Count, tier1Rate, tier2Count, tier2Rate, tier3Rate } = BONUS_TIERS;
    if (n <= tier1Count) {
      bonus = n * tier1Rate;
    } else if (n <= tier1Count + tier2Count) {
      bonus = (tier1Count * tier1Rate) + ((n - tier1Count) * tier2Rate);
    } else {
      bonus = (tier1Count * tier1Rate) + (tier2Count * tier2Rate) + ((n - tier1Count - tier2Count) * tier3Rate);
    }
  }

  const total = Number((baseRate + bonus).toFixed(2));

  return {
    baseRate,
    bonus,
    total
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  // Parse as local date (YYYY-MM-DD) to avoid timezone shifts
  const [y, m, d] = dateString.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('pt-BR', options);
};

export const getDayType = (isSunday: boolean): string => {
  return isSunday ? 'Domingo ou feriado' : 'Segunda a sábado';
};

export const getDateTimeString = (): string => {
  const today = new Date();
  const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
  return localDate.toISOString().split('T')[0];
};

export const getIsSundayFromDate = (dateString: string): boolean => {
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.getDay() === 0;
};

export const filterHistory = (
  history: RouteHistory[],
  searchQuery: string
) => {
  if (!searchQuery.trim()) return history;
  const query = searchQuery.toLowerCase();
  return history.filter(item => 
    item.routeName.toLowerCase().includes(query) ||
    item.date.includes(query) ||
    (item.observations && item.observations.toLowerCase().includes(query))
  );
};

export type PeriodType = 'daily' | 'weekly' | 'biweekly' | 'monthly';

const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
};

export const filterHistoryByPeriod = (
  history: RouteHistory[],
  period: PeriodType,
  firstDayOfWeek: number = 1
) => {
  const now = new Date();

  let start: Date;
  let end: Date;

  if (period === 'daily') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  } else if (period === 'weekly') {
    const weekday = now.getDay();
    const diff = (weekday - firstDayOfWeek + 7) % 7;
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
  } else if (period === 'biweekly') {
    // Align biweekly windows consistently from the start of the year (every 14 days)
    const dayOfYear = getDayOfYear(now);
    const biIndex = Math.floor((dayOfYear - 1) / 14);
    const biStartDay = biIndex * 14 + 1;
    start = new Date(now.getFullYear(), 0, biStartDay);
    end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000 - 1);
  } else {
    // monthly
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    end = new Date(end.getTime() - 1);
  }

  return history.filter(item => {
    const [y, m, d] = item.date.split('-').map(Number);
    const itemDate = new Date(y, m - 1, d);
    return itemDate >= start && itemDate <= end;
  });
};


