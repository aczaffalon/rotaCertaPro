import { RouteHistory, Theme, AppConfig } from '../types';

const DEFAULT_CONFIG: AppConfig = {
  platformName: 'Minha Plataforma',
  closureType: 'weekly',
  firstDayOfWeek: 1,
  targetRevenue: 0,
  costPerKm: 0,
  vehicleConsumption: 0,
  fuelPrice: 0,
  vehicleName: '',
  vehicleType: 'motorcycle',
  fuelType: 'Gasolina',
  vehicleOdometer: 0,
};

const STORAGE_KEYS = {
  theme: 'rota_certa_theme',
  history: 'rota_certa_history',
  config: 'rota_certa_config',
};

const LEGACY_STORAGE_KEYS = {
  theme: 'kangu_theme',
  history: 'kangu_history',
  config: 'kangu_config',
};

const normalizeClosureType = (value: unknown): AppConfig['closureType'] => {
  return value === 'daily' || value === 'weekly' || value === 'biweekly' || value === 'monthly'
    ? value
    : 'weekly';
};

const normalizeFirstDayOfWeek = (value: unknown): number => {
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized >= 0 && normalized <= 6 ? normalized : 1;
};

const normalizeHistory = (value: unknown): RouteHistory[] => {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is RouteHistory => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<RouteHistory>;
    return typeof candidate.id === 'string' && typeof candidate.date === 'string';
  });
};

const getStoredValue = (key: keyof typeof STORAGE_KEYS): string | null => {
  const currentValue = localStorage.getItem(STORAGE_KEYS[key]);
  if (currentValue !== null) return currentValue;

  const legacyValue = localStorage.getItem(LEGACY_STORAGE_KEYS[key]);
  if (legacyValue !== null) {
    localStorage.setItem(STORAGE_KEYS[key], legacyValue);
    localStorage.removeItem(LEGACY_STORAGE_KEYS[key]);
  }
  return legacyValue;
};

export const storageService = {
  // Tema
  getTheme: (): Theme | null => {
    const saved = getStoredValue('theme') as Theme | null;
    return saved || null;
  },

  setTheme: (theme: Theme): void => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  },

  // Histórico
  getHistory: (): RouteHistory[] => {
    const saved = getStoredValue('history');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse history', e);
      return [];
    }
  },

  setHistory: (history: RouteHistory[]): void => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  },

  clearHistory: (): void => {
    localStorage.removeItem(STORAGE_KEYS.history);
  },

  // Configurações
  getConfig: (): AppConfig => {
    const saved = getStoredValue('config');
    if (!saved) return DEFAULT_CONFIG;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        closureType: normalizeClosureType(parsed?.closureType),
        firstDayOfWeek: normalizeFirstDayOfWeek(parsed?.firstDayOfWeek),
      };
    } catch (e) {
      console.error('Failed to parse config', e);
      return DEFAULT_CONFIG;
    }
  },

  setConfig: (config: AppConfig): void => {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify({
      ...config,
      closureType: normalizeClosureType(config?.closureType),
      firstDayOfWeek: normalizeFirstDayOfWeek(config?.firstDayOfWeek),
    }));
  },

  resetConfig: (): void => {
    localStorage.removeItem(STORAGE_KEYS.config);
  },

  getDefaultConfig: (): AppConfig => DEFAULT_CONFIG,
  // Backup / Import
  exportBackup: (): string => {
    const history = (() => {
      const saved = getStoredValue('history');
      if (!saved) return [];
      try {
        return normalizeHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history for backup', e);
        return [];
      }
    })();

    const config = (() => {
      const saved = getStoredValue('config');
      if (!saved) return DEFAULT_CONFIG;
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          closureType: normalizeClosureType(parsed?.closureType),
          firstDayOfWeek: normalizeFirstDayOfWeek(parsed?.firstDayOfWeek),
        };
      } catch (e) {
        console.error('Failed to parse config for backup', e);
        return DEFAULT_CONFIG;
      }
    })();

    const backup = {
      version: 1,
      generatedAt: new Date().toISOString(),
      history,
      config,
    };

    return JSON.stringify(backup, null, 2);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;

      const rawHistory = 'history' in parsed ? parsed.history : 'data' in parsed && parsed.data && typeof parsed.data === 'object' ? (parsed.data as any).history : undefined;
      const rawConfig = 'config' in parsed ? parsed.config : 'data' in parsed && parsed.data && typeof parsed.data === 'object' ? (parsed.data as any).config : undefined;

      if (rawHistory !== undefined && !Array.isArray(rawHistory)) return false;
      if (rawConfig !== undefined && (rawConfig === null || typeof rawConfig !== 'object')) return false;

      const history = normalizeHistory(rawHistory ?? []);
      const configSource = rawConfig ?? {};

      const safeConfig = {
        ...DEFAULT_CONFIG,
        ...configSource,
        closureType: normalizeClosureType(configSource?.closureType),
        firstDayOfWeek: normalizeFirstDayOfWeek(configSource?.firstDayOfWeek),
      };

      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
      localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(safeConfig));

      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  },
};
