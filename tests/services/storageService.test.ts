import { beforeEach, describe, expect, it } from 'vitest';
import { storageService } from '../../src/services/storageService';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  clear() {
    this.values.clear();
  }
}

describe('storageService backup', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: new MemoryStorage(),
      configurable: true,
    });
  });

  it('exporta histórico e configurações locais em JSON', () => {
    const history = [{ id: 'route-1', date: '2026-09-08', total: 250 }];
    const config = { ...storageService.getDefaultConfig(), targetRevenue: 1000 };

    storageService.setHistory(history as any);
    storageService.setConfig(config);

    const backup = JSON.parse(storageService.exportBackup());

    expect(backup.history).toEqual(history);
    expect(backup.config.targetRevenue).toBe(1000);
    expect(backup.version).toBe(1);
  });

  it('importa um backup válido e restaura os dados locais', () => {
    const history = [{ id: 'route-2', date: '2026-09-07', total: 180 }];
    const config = { ...storageService.getDefaultConfig(), fuelPrice: 5.99 };

    expect(storageService.importBackup(JSON.stringify({ history, config }))).toBe(true);
    expect(storageService.getHistory()).toEqual(history);
    expect(storageService.getConfig().fuelPrice).toBe(5.99);
  });

  it('preserva o tipo de fechamento e início da semana ao importar backup', () => {
    const history = [{ id: 'route-3', date: '2026-09-06', total: 300 }];
    const config = {
      ...storageService.getDefaultConfig(),
      closureType: 'biweekly' as const,
      firstDayOfWeek: 2,
      targetRevenue: 1500,
    };

    expect(storageService.importBackup(JSON.stringify({ version: 1, history, config }))).toBe(true);
    expect(storageService.getConfig().closureType).toBe('biweekly');
    expect(storageService.getConfig().firstDayOfWeek).toBe(2);
    expect(storageService.getConfig().targetRevenue).toBe(1500);
  });

  it('migrates legacy backup data without dropping valid configuration', () => {
    const legacyBackup = JSON.stringify({
      history: [{ id: 'route-legacy', date: '2026-09-05', total: 400 }],
      config: { closureType: 'monthly', firstDayOfWeek: 0, targetRevenue: 2200 },
    });

    expect(storageService.importBackup(legacyBackup)).toBe(true);
    expect(storageService.getConfig().closureType).toBe('monthly');
    expect(storageService.getConfig().firstDayOfWeek).toBe(0);
    expect(storageService.getHistory()).toHaveLength(1);
  });

  it('recusa backup inválido sem alterar o armazenamento', () => {
    storageService.setHistory([{ id: 'existing' }] as any);

    expect(storageService.importBackup('{"history": "inválido"}')).toBe(false);
    expect(storageService.getHistory()).toEqual([{ id: 'existing' }]);
  });
});
