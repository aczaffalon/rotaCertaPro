export type RateBracket = {
  maxKm?: number;
  amWeekday: number;
  amSunday: number;
  pmWeekday: number;
  pmSunday: number;
};

export const EFFECTIVE_DATE = '2026-05-28';
export const VEHICLE_PROFILE = 'UTILITÁRIOS';

export const BASE_RATE_BRACKETS: RateBracket[] = [
  { maxKm: 100, amWeekday: 262.73, pmWeekday: 207.10, amSunday: 394.10, pmSunday: 310.65 },
  { maxKm: 150, amWeekday: 300.94, pmWeekday: 236.94, amSunday: 451.41, pmSunday: 355.41 },
  { maxKm: 200, amWeekday: 343.29, pmWeekday: 270.64, amSunday: 514.94, pmSunday: 405.96 },
  { maxKm: 300, amWeekday: 381.39, pmWeekday: 300.48, amSunday: 572.09, pmSunday: 450.72 },
  { amWeekday: 423.85, pmWeekday: 334.18, amSunday: 635.78, pmSunday: 501.27 },
];

export const BONUS_TIERS = {
  tier1Count: 60,
  tier1Rate: 0.37,
  tier2Count: 30, // from 61 to 90
  tier2Rate: 2.0,
  tier3Rate: 1.04,
};

export default {
  EFFECTIVE_DATE,
  VEHICLE_PROFILE,
  BASE_RATE_BRACKETS,
  BONUS_TIERS,
};
