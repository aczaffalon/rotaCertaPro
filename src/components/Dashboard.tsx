import React from 'react';
import {
  ArrowRight,
  Fuel,
  Navigation,
  Package,
  Plus,
  Route,
  Target,
  TrendingUp,
} from 'lucide-react';
import { DashboardStats } from '../utils/dashboardStats';
import { formatCurrency } from '../utils/calculations';

interface DashboardProps {
  stats: DashboardStats;
  todayRevenue: number;
  savedRoutes: number;
  profit: number;
  isProfitable: boolean;
  profitStatusColor: string;
  profitBgColor: string;
  onNewRoute: () => void;
}

const statCardStyles = [
  'bg-yellow-400 text-zinc-950 border-yellow-400',
  'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800',
  'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800',
  'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800',
];

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  todayRevenue,
  savedRoutes,
  profit,
  isProfitable,
  profitStatusColor,
  profitBgColor,
  onNewRoute,
}) => {
  const cards = [
    {
      label: 'Ganhos de hoje',
      value: formatCurrency(todayRevenue),
      detail: 'Rotas concluídas hoje',
      icon: TrendingUp,
    },
    {
      label: 'Rotas salvas',
      value: String(savedRoutes),
      detail: 'Registros no histórico',
      icon: Route,
    },
    {
      label: 'KM rodados',
      value: `${Math.round(stats.totalKm)} km`,
      detail: 'No histórico completo',
      icon: Navigation,
    },
    {
      label: 'Entregas',
      value: String(stats.totalDeliveries),
      detail: 'Endereços registrados',
      icon: Package,
    },
  ];

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] bg-zinc-900 p-6 text-white shadow-xl shadow-zinc-900/10 sm:p-8">
        <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-yellow-400/20" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-950">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              Painel de bordo
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pronto para a próxima rota?</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-300">
              Registre seus quilômetros e entregas para acompanhar seus ganhos com clareza.
            </p>
          </div>
          <button
            onClick={onNewRoute}
            aria-label="Nova rota"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-zinc-950 shadow-lg shadow-yellow-400/20 transition-transform hover:-translate-y-0.5 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Nova rota
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        {cards.map(({ label, value, detail, icon: Icon }, index) => (
          <article
            key={label}
            className={`min-h-36 rounded-2xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 sm:p-5 ${statCardStyles[index]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className={`text-xs font-bold uppercase tracking-wide ${index === 0 ? 'text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {label}
              </p>
              <Icon className={`h-5 w-5 shrink-0 ${index === 0 ? 'text-zinc-900' : 'text-yellow-500'}`} />
            </div>
            <p className="mt-5 break-words text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
            <p className={`mt-1 text-xs ${index === 0 ? 'text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-2xl border-2 p-5 ${profitBgColor}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Lucro estimado</p>
              <p className={`mt-2 text-2xl font-bold ${profitStatusColor}`}>{formatCurrency(Math.max(0, profit))}</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{isProfitable ? 'Resultado positivo' : 'Revise seus custos'}</p>
            </div>
            <TrendingUp className={`h-6 w-6 ${profitStatusColor}`} />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Meta de faturamento</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{Math.round(stats.metaProgress)}%</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${Math.min(stats.metaProgress, 100)}%` }} />
              </div>
            </div>
            <Target className="h-6 w-6 shrink-0 text-yellow-500" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Fuel className="h-5 w-5 text-yellow-500" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Despesas</p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(stats.totalExpense)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <TrendingUp className="h-5 w-5 text-yellow-500" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Faturamento</p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-1">
          <Navigation className="h-5 w-5 text-yellow-500" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Média diária</p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(stats.averageDailyRevenue)}</p>
        </div>
      </section>
    </div>
  );
};
