import { useState, useEffect } from 'react';
import { RouteHistory } from '../types';
import { storageService } from '../services/storageService';
import { CalculationResult } from '../types';
import { getDateTimeString, getIsSundayFromDate } from '../utils/calculations';

export const useHistory = () => {
  const [history, setHistory] = useState<RouteHistory[]>([]);

  // Carregar histórico do localStorage na inicialização
  useEffect(() => {
    const savedHistory = storageService.getHistory();
    setHistory(savedHistory);
  }, []);

  const saveToHistory = (
    routeDate: string,
    routeName: string,
    observations: string,
    km: number | '',
    addresses: number | '',
    calculation: CalculationResult,
    period: 'AM' | 'PM' = 'AM'
  ) => {
    // Basic validations to avoid corrupt or empty entries
    if (!routeDate || Number.isNaN(new Date(routeDate).getTime())) {
      alert('Data da rota inválida. Verifique e tente novamente.');
      return;
    }

    if (!Number.isFinite(Number(calculation.total)) || calculation.total <= 0) return;

    const safeKm = Number.isFinite(Number(km)) && Number(km) >= 0 ? Number(km) : 0;
    const safeAddresses = Number.isFinite(Number(addresses)) && Number(addresses) >= 0 ? Math.floor(Number(addresses)) : 0;

    const safeRouteName = routeName.trim() || 'Rota sem nome';

    const newEntry: RouteHistory = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      date: routeDate,
      routeName: safeRouteName,
      observations: observations || '',
      isSunday: getIsSundayFromDate(routeDate),
      period,
      km: safeKm,
      addresses: safeAddresses,
      baseRate: calculation.baseRate,
      bonus: calculation.bonus,
      total: calculation.total,
    };

    const updatedHistory = [newEntry, ...history].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setHistory(updatedHistory);
    storageService.setHistory(updatedHistory);

    return newEntry;
  };

  const deleteFromHistory = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cálculo do histórico?')) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      storageService.setHistory(updatedHistory);
      return true;
    }
    return false;
  };

  const clearAllHistory = () => {
    if (history.length === 0) return false;
    
    if (window.confirm('⚠️ ATENÇÃO: Tem certeza que deseja apagar TODO o histórico de rotas? Esta ação não pode ser desfeita.')) {
      setHistory([]);
      storageService.clearHistory();
      return true;
    }
    return false;
  };

  return {
    history,
    setHistory,
    saveToHistory,
    deleteFromHistory,
    clearAllHistory
  };
};
