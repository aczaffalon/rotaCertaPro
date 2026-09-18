import React from 'react';
import {
  Route,
  Calendar,
  MapPin,
  Navigation,
  FileText,
  DollarSign,
  Save,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculations';

interface CalculatorProps {
  routeDate: string;
  onDateChange: (date: string) => void;
  routeName: string;
  onRouteNameChange: (name: string) => void;
  dayType: 'weekday' | 'sunday';
  onDayTypeChange: (type: 'weekday' | 'sunday') => void;
  period: 'AM' | 'PM';
  onPeriodChange: (p: 'AM' | 'PM') => void;
  km: number | '';
  onKmChange: (km: number | '') => void;
  addresses: number | '';
  onAddressesChange: (addresses: number | '') => void;
  observations: string;
  onObservationsChange: (obs: string) => void;
  calculation: CalculationResult;
  onSave: () => void;
  saveError?: string | null;
  saveSuccess?: string | null;
}

export const Calculator: React.FC<CalculatorProps> = ({
  routeDate,
  onDateChange,
  routeName,
  onRouteNameChange,
  dayType,
  onDayTypeChange,
  period,
  onPeriodChange,
  km,
  onKmChange,
  addresses,
  onAddressesChange,
  observations,
  onObservationsChange,
  calculation,
  onSave,
  saveError,
  saveSuccess,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-6 sm:p-8 space-y-8">
        {/* Input Section */}
        <div className="space-y-6">
          {(saveError || saveSuccess) && (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                saveError
                  ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300'
              }`}
              role={saveError ? 'alert' : 'status'}
            >
              {saveError || saveSuccess}
            </div>
          )}

          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Route className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
            Dados da Rota
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="routeDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Data da Rota
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="date"
                  id="routeDate"
                  value={routeDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="routeName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nome da Rota
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Navigation className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  id="routeName"
                  value={routeName}
                  onChange={(e) => onRouteNameChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors text-zinc-900 dark:text-zinc-100"
                  placeholder="Ex: Rota Sul 01"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Status do dia</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                dayType === 'sunday'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
              }`}>
                {dayType === 'sunday' ? 'Domingo ou feriado (+50%)' : 'Segunda a sábado'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Período</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{period}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <fieldset className="space-y-2">
              <legend className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <Calendar className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                Dia da Semana
              </legend>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Dia da Semana">
                {[
                  { value: 'weekday' as const, label: 'Seg a sáb' },
                  { value: 'sunday' as const, label: 'Domingo', detail: '+50%' },
                ].map((option) => {
                  const isSelected = dayType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onDayTypeChange(option.value)}
                      className={`min-h-12 rounded-xl border px-2 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-yellow-400 dark:bg-yellow-400 dark:text-zinc-950'
                          : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500'
                      }`}
                    >
                      {option.label}
                      {option.detail && <span className="ml-1 text-xs opacity-70">{option.detail}</span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Período da rota</legend>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Período da rota">
                {[
                  { value: 'AM' as const, label: 'AM', detail: 'até 13h' },
                  { value: 'PM' as const, label: 'PM', detail: 'após 13h' },
                ].map((option) => {
                  const isSelected = period === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onPeriodChange(option.value)}
                      className={`min-h-12 rounded-xl border px-2 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        isSelected
                          ? 'border-yellow-500 bg-yellow-400 text-zinc-950'
                          : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500'
                      }`}
                    >
                      {option.label}
                      <span className="ml-1 text-xs opacity-70">{option.detail}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="space-y-2">
            <label htmlFor="km" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              KM Total Rodado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Route className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              </div>
              <input
                type="number"
                id="km"
                min="0"
                value={km}
                onChange={(e) => onKmChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors text-zinc-900 dark:text-zinc-100"
                placeholder="Ex: 120"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="addresses" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Endereços Visitados
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              </div>
              <input
                type="number"
                id="addresses"
                min="0"
                value={addresses}
                onChange={(e) => onAddressesChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors text-zinc-900 dark:text-zinc-100"
                placeholder="Ex: 65"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="observations" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Observações
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              </div>
              <textarea
                id="observations"
                rows={3}
                value={observations}
                onChange={(e) => onObservationsChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors resize-none text-zinc-900 dark:text-zinc-100"
                placeholder="Anotações adicionais sobre a rota..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

      {/* Results Section */}
      <div className="p-6 sm:p-8 pt-6 sm:pt-6 space-y-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
          Resumo de Ganhos
        </h2>

        <div className="space-y-4 rounded-2xl border border-yellow-500 bg-yellow-400 p-5 text-zinc-950 shadow-lg shadow-yellow-400/20 sm:p-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Valor Base (KM)</span>
            <span className="font-semibold">{formatCurrency(calculation.baseRate)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Bônus por Endereços</span>
            <span className="font-semibold">{formatCurrency(calculation.bonus)}</span>
          </div>
          
          <div className="my-4 h-px w-full bg-zinc-950/15" />
          
          <div className="flex justify-between items-center">
            <span className="text-base font-bold">Valor Bruto Total</span>
            <span className="text-3xl font-black tracking-tight">{formatCurrency(calculation.total)}</span>
          </div>
          
          <button
            onClick={onSave}
            disabled={calculation.total === 0}
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 font-bold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 focus:ring-offset-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Salvar Cálculo
          </button>
        </div>
      </div>
    </div>
  );
};
