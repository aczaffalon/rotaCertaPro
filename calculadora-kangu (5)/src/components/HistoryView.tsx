import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  FileDown,
  Trash2,
  History,
  Search,
  Share2,
  ArrowRight,
  ChevronDown,
  Route,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { ClosureType, RouteHistory } from '../types';
import { formatCurrency, formatDate, getDayType, filterHistory } from '../utils/calculations';

interface HistoryViewProps {
  history: RouteHistory[];
  onDelete: (id: string) => void;
  onLoadRoute: (item: RouteHistory) => void;
  onShare: (item: RouteHistory) => void;
  onExportRoutePDF: (item: RouteHistory) => void;
  onClearAll: () => void;
  onExportCSV: () => Promise<void>;
  onExportPDF: () => Promise<void>;
  onGenerateReport: (period: ClosureType) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onDelete,
  onLoadRoute,
  onShare,
  onExportRoutePDF,
  onClearAll,
  onExportCSV,
  onExportPDF,
  onGenerateReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);
  const [exportMessage, setExportMessage] = useState('');

  const displayedHistory = useMemo(() => {
    return filterHistory(history, searchQuery);
  }, [history, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleExport = async (format: 'csv' | 'pdf', action: () => Promise<void>) => {
    setExporting(format);
    setExportMessage('');

    try {
      await action();
      setExportMessage(
        format === 'csv'
          ? 'CSV pronto. Escolha onde salvar ou compartilhar.'
          : 'PDF pronto. Escolha onde salvar ou compartilhar.'
      );
    } catch (error) {
      console.error(`Falha ao exportar ${format.toUpperCase()}:`, error);
      setExportMessage('Não foi possível exportar o arquivo. Verifique o acesso ao compartilhamento e tente novamente.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onGenerateReport('daily')}
          aria-label="Gerar relatório diário"
          className="flex min-h-12 items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 px-4 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Diário
        </button>
        <button
          onClick={() => onGenerateReport('weekly')}
          aria-label="Gerar relatório semanal"
          className="flex min-h-12 items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 px-4 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Semanal
        </button>
        <button
          onClick={() => onGenerateReport('biweekly')}
          aria-label="Gerar relatório quinzenal"
          className="flex min-h-12 items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 px-4 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Quinzenal
        </button>
        <button
          onClick={() => onGenerateReport('monthly')}
          aria-label="Gerar relatório mensal"
          className="flex min-h-12 items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 px-4 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Mensal
        </button>
        <button
          onClick={() => void handleExport('csv', onExportCSV)}
          disabled={history.length === 0 || exporting !== null}
          aria-label="Exportar histórico em CSV"
          className="flex min-h-12 items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 px-4 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          {exporting === 'csv' ? 'Exportando...' : 'Exportar CSV'}
        </button>
        <button
          onClick={() => void handleExport('pdf', onExportPDF)}
          disabled={history.length === 0 || exporting !== null}
          aria-label="Exportar histórico em PDF"
          className="flex min-h-12 items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 px-4 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <FileDown className="w-5 h-5 text-red-500" />
          {exporting === 'pdf' ? 'Exportando...' : 'Exportar PDF'}
        </button>
        <button
          onClick={onClearAll}
          disabled={history.length === 0}
          aria-label="Limpar todo o histórico"
          className="flex min-h-12 items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 py-3 px-4 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:border-zinc-200 dark:disabled:border-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 disabled:hover:bg-white dark:disabled:hover:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <Trash2 className="w-5 h-5" />
          Limpar Tudo
        </button>
      </div>

      {exportMessage && (
        <p
          role="status"
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {exportMessage}
        </p>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <History className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              Histórico de Cálculos
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{history.length} rotas salvas</span>
          </div>
          
          {history.length > 0 && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar no histórico"
                placeholder="Buscar por nome da rota, data ou observações..."
                className="block min-h-12 w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors text-zinc-900 dark:text-zinc-100"
              />
            </div>
          )}
          
          {history.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              <History className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
              <p>Nenhum cálculo salvo ainda.</p>
            </div>
          ) : displayedHistory.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              <Search className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
              <p>Nenhum resultado encontrado para "{searchQuery}".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedHistory.map((item) => {
                const isExpanded = expandedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  >
                    {/* Header / Summary */}
                    <div
                      className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center cursor-pointer"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isExpanded
                              ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                              : 'bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shadow-sm border border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {item.routeName}
                            </span>
                            <span className="text-xs font-medium px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md">
                              {formatDate(item.date)}
                            </span>
                            <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md">
                              {item.period || 'AM'}
                            </span>
                          </div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                            {formatCurrency(item.total)}
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex items-center justify-end w-full sm:w-auto gap-2 flex-wrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onExportRoutePDF(item)}
                          aria-label={`Exportar PDF da rota ${item.routeName}`}
                          className="flex min-h-11 items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          title="Exportar PDF"
                        >
                          <FileDown className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                        <button
                          onClick={() => onShare(item)}
                          aria-label={`Compartilhar rota ${item.routeName}`}
                          className="flex min-h-11 items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          title="Compartilhar"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Compartilhar</span>
                        </button>
                        <button
                          onClick={() => onLoadRoute(item)}
                          aria-label={`Carregar rota ${item.routeName}`}
                          className="flex min-h-11 items-center gap-1.5 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-xl transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                          title="Carregar dados"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span className="hidden sm:inline">Carregar</span>
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          aria-label={`Excluir rota ${item.routeName}`}
                          className="flex min-h-11 items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Excluir</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 mt-4">
                          <div className="space-y-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <Route className="w-3.5 h-3.5" /> KM Total
                            </span>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.km || 0} km</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> Endereços
                            </span>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.addresses || 0}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> Dia
                            </span>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{getDayType(item.isSunday)} • {item.period || 'AM'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" /> Valor Base
                            </span>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">
                              {formatCurrency(item.baseRate)}
                            </p>
                          </div>
                        </div>

                        {item.observations && (
                          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 mt-2">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-1">
                              <FileText className="w-3.5 h-3.5" /> Observações
                            </span>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.observations}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
