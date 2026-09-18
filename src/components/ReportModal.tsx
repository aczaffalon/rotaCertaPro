import React, { useMemo } from 'react';
import { BarChart3, CalendarDays, Download, FileSpreadsheet, FileText, MapPin, Route, X } from 'lucide-react';
import { ClosureType, RouteHistory } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { calculateReportMetrics, getReportBars } from '../utils/reportStats';

type ReportPeriod = ClosureType;

interface ReportModalProps {
  isOpen: boolean;
  period: ReportPeriod;
  history: RouteHistory[];
  targetRevenue: number;
  onClose: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

const periodTitles: Record<ReportPeriod, string> = {
  daily: 'Resumo diário',
  weekly: 'Resumo semanal',
  biweekly: 'Resumo quinzenal',
  monthly: 'Resumo mensal',
};

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  period,
  history,
  targetRevenue,
  onClose,
  onExportPDF,
  onExportCSV,
}) => {
  const metrics = useMemo(() => calculateReportMetrics(history, targetRevenue), [history, targetRevenue]);
  const bars = useMemo(() => getReportBars(history), [history]);
  const maxBar = Math.max(...bars.map((bar) => bar.total), 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="report-modal-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-zinc-50 shadow-2xl dark:bg-zinc-950 sm:rounded-3xl">
        <header className="flex items-start justify-between border-b border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-yellow-600 dark:text-yellow-400">
              <BarChart3 className="h-4 w-4" />
              Relatório Rota Certa
            </div>
            <h2 id="report-modal-title" className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{periodTitles[period]}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <CalendarDays className="h-4 w-4" />
              {period === 'daily' && 'Dia atual'}
              {period === 'weekly' && 'Semana atual'}
              {period === 'biweekly' && 'Quinzena atual'}
              {period === 'monthly' && 'Mês atual'}
              {' · '}{history.length ? `${history.length} registro${history.length === 1 ? '' : 's'}` : 'nenhum registro'}
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar relatório" className="min-h-11 min-w-11 rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Total bruto', value: formatCurrency(metrics.totalRevenue), icon: FileText, highlight: true },
              { label: 'Rotas', value: String(metrics.routeCount), icon: Route },
              { label: 'KM rodados', value: `${Math.round(metrics.totalKm)} km`, icon: Route },
              { label: 'Endereços', value: String(metrics.totalAddresses), icon: MapPin },
            ].map(({ label, value, icon: Icon, highlight }) => (
              <article key={label} className={`rounded-2xl border p-4 ${highlight ? 'border-yellow-400 bg-yellow-400 text-zinc-950' : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}`}>
                <Icon className={`h-5 w-5 ${highlight ? 'text-zinc-950' : 'text-yellow-500'}`} />
                <p className={`mt-4 text-xs font-bold uppercase tracking-wide ${highlight ? 'text-zinc-800' : 'text-zinc-500 dark:text-zinc-400'}`}>{label}</p>
                <p className="mt-1 break-words text-xl font-bold sm:text-2xl">{value}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Valor médio por rota</p>
              <p className="mt-2 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{formatCurrency(metrics.averagePerRoute)}</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Considerando {metrics.routeCount} rota{metrics.routeCount === 1 ? '' : 's'} no período</p>
            </section>
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Comparação com a meta</p>
              {metrics.targetProgress === null ? (
                <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">Configure uma meta para acompanhar o progresso.</p>
              ) : (
                <>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">{metrics.targetProgress}%</p>
                    <p className={`text-sm font-semibold ${metrics.targetDifference! >= 0 ? 'text-green-600' : 'text-red-500'}`}>{metrics.targetDifference! >= 0 ? '+' : ''}{formatCurrency(metrics.targetDifference!)}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-yellow-400" style={{ width: `${Math.min(metrics.targetProgress, 100)}%` }} /></div>
                </>
              )}
            </section>
          </div>

          <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-zinc-950 dark:text-zinc-50">Ganhos por dia</h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Últimos dias com registro no período</p>
              </div>
              <BarChart3 className="h-5 w-5 text-yellow-500" />
            </div>
            {bars.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">Nenhuma rota encontrada neste período.</p>
            ) : (
              <div className="mt-6 flex h-36 items-end gap-2 sm:gap-4" role="img" aria-label="Gráfico de ganhos por dia">
                {bars.map((bar) => (
                  <div key={bar.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <span className="max-w-full truncate text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">{formatCurrency(bar.total)}</span>
                    <div className="flex h-24 w-full items-end rounded-lg bg-zinc-100 px-1 dark:bg-zinc-800">
                      <div className="w-full rounded-md bg-yellow-400 transition-all" style={{ height: `${Math.max((bar.total / maxBar) * 100, 8)}%` }} title={formatCurrency(bar.total)} />
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{formatDate(bar.date, { day: '2-digit', month: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:justify-end sm:p-6">
          <button onClick={onExportCSV} disabled={history.length === 0} aria-label="Exportar relatório em CSV" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-2.5 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
            <FileSpreadsheet className="h-4 w-4 text-green-600" /> Exportar CSV
          </button>
          <button onClick={onExportPDF} disabled={history.length === 0} aria-label="Exportar relatório em PDF" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-yellow-400 dark:text-zinc-950 dark:hover:bg-yellow-300">
            <Download className="h-4 w-4" /> Exportar PDF
          </button>
        </footer>
      </div>
    </div>
  );
};
