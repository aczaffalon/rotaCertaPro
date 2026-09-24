import React, { useState, useMemo, useEffect } from 'react';
import { Calculator as CalculatorIcon, Sun, Moon, Monitor, Settings, Home, History as HistoryIcon, Car } from 'lucide-react';
import { Calculator } from './components/Calculator';
import { HistoryView } from './components/HistoryView';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './components/Dashboard';
import { ReportModal } from './components/ReportModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { VehicleView } from './components/VehicleView';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { useConfig } from './hooks/useConfig';
import { calculateRoute, formatCurrency, formatDate, getDayType, getDateTimeString, getIsSundayFromDate, filterHistoryByPeriod, validateRouteInput } from './utils/calculations';
import { calculateDashboardStats, getProfitStatusColor, getProfitBgColor } from './utils/dashboardStats';
import { ClosureType, RouteHistory } from './types';
import { exportCsvFile } from './services/fileExportService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'history' | 'vehicle'>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<ClosureType>('weekly');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [routeDate, setRouteDate] = useState(getDateTimeString());
  const [routeName, setRouteName] = useState('');
  const [observations, setObservations] = useState('');
  const [isSunday, setIsSunday] = useState(() => new Date().getDay() === 0);
  const [km, setKm] = useState<number | ''>('');
  const [addresses, setAddresses] = useState<number | ''>('');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const { theme, handleThemeChange } = useTheme();
  const { history, saveToHistory, deleteFromHistory, clearAllHistory } = useHistory();
  const { config, updateConfig } = useConfig();

  useEffect(() => {
    if (saveError || saveSuccess) {
      setSaveError(null);
      setSaveSuccess(null);
    }
  }, [routeDate, routeName, observations, km, addresses, isSunday, period]);

  const loadPdfService = async () => {
    const { pdfService } = await import('./services/pdfService');
    return pdfService;
  };

  const todayHistory = useMemo(() => {
    return filterHistoryByPeriod(history, 'daily');
  }, [history]);

  const todayRevenue = useMemo(() => {
    return todayHistory.reduce((total, item) => total + item.total, 0);
  }, [todayHistory]);

  const reportHistory = useMemo(() => {
    return filterHistoryByPeriod(history, reportPeriod, config.firstDayOfWeek);
  }, [history, reportPeriod, config.firstDayOfWeek]);

  const calculation = useMemo(() => {
    return calculateRoute(km, addresses, isSunday, period);
  }, [km, addresses, isSunday, period]);

  const dashboardStats = useMemo(() => {
    return calculateDashboardStats(
      history,
      config.costPerKm,
      config.targetRevenue,
      config.fuelPrice,
      config.vehicleConsumption
    );
  }, [history, config.costPerKm, config.targetRevenue, config.fuelPrice, config.vehicleConsumption]);

  const profit = dashboardStats.estimatedProfit;
  const isProfitable = profit >= 0;
  const profitStatusColor = getProfitStatusColor(profit);
  const profitBgColor = getProfitBgColor(profit);

  const handleDateChange = (date: string) => {
    setRouteDate(date);
    if (date) {
      setIsSunday(getIsSundayFromDate(date));
    }
  };

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSaveRoute = () => {
    const validationError = validateRouteInput(km, addresses, routeDate, isSunday, period);
    if (validationError) {
      setSaveError(validationError);
      setSaveSuccess(null);
      return;
    }

    const saved = saveToHistory(
      routeDate,
      routeName,
      observations,
      km,
      addresses,
      calculation,
      period
    );

    if (saved) {
      setSaveError(null);
      setSaveSuccess('Rota salva com sucesso!');
      setRouteName('');
      setObservations('');
      setKm('');
      setAddresses('');
      setRouteDate(getDateTimeString());
      setIsSunday(new Date().getDay() === 0);
    }
  };

  const handleLoadRoute = (entry: RouteHistory) => {
    setRouteDate(entry.date);
    setRouteName(entry.routeName === 'Rota sem nome' ? '' : entry.routeName);
    setObservations(entry.observations);
    setIsSunday(entry.isSunday);
    setKm(entry.km);
    setAddresses(entry.addresses);
    setPeriod(entry.period || 'AM');
    
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareRoute = async (item: RouteHistory) => {
    const formattedDate = formatDate(item.date);
    const dayType = getDayType(item.isSunday);
    
    const text = `*Detalhes da Rota Certa*\n\n` +
      `📍 *Rota:* ${item.routeName}\n` +
      `📅 *Data:* ${formattedDate}\n` +
      `🗓️ *Dia:* ${dayType}\n` +
      `🛣️ *KM Total:* ${item.km || 0} km\n` +
      `🏠 *Endereços:* ${item.addresses || 0}\n` +
      `💰 *Valor Base:* ${formatCurrency(item.baseRate)}\n` +
      `🎁 *Bônus:* ${formatCurrency(item.bonus)}\n` +
      `💵 *Total Bruto:* ${formatCurrency(item.total)}\n` +
      (item.observations ? `\n📝 *Observações:* ${item.observations}` : '');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rota Certa - ${item.routeName}`,
          text: text,
        });
      } catch (error) {
        console.error('Error sharing route:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Detalhes da rota copiados para a área de transferência!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Não foi possível copiar os detalhes da rota.');
      }
    }
  };

  const exportToCSV = async (records = history, filePrefix = 'rota_certa_historico') => {
    if (records.length === 0) return;

    const headers = ['Data', 'Rota', 'Dia', 'Período', 'KM', 'Endereços', 'Valor Base', 'Bônus', 'Total Bruto', 'Observações'];
    const csvContent = [
      headers.join(','),
      ...records.map(item => [
        item.date,
        `"${item.routeName}"`,
        item.isSunday ? 'Domingo' : 'Seg-Sáb',
        item.period || 'AM',
        item.km,
        item.addresses,
        item.baseRate.toFixed(2),
        item.bonus.toFixed(2),
        item.total.toFixed(2),
        `"${item.observations.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    await exportCsvFile(csvContent, `${filePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateReport = (period: ClosureType) => {
    setReportPeriod(period);
    setIsReportOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8 pb-32 font-sans transition-colors duration-200 sm:px-6 sm:pb-10 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative text-center space-y-2">
          <div className="absolute right-0 top-0 flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => handleThemeChange('light')}
              aria-label="Ativar tema claro"
              className={`min-h-11 min-w-11 p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              title="Tema Claro"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              aria-label="Usar tema do sistema"
              className={`min-h-11 min-w-11 p-1.5 rounded-md transition-colors ${theme === 'system' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              title="Tema do Sistema"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              aria-label="Ativar tema escuro"
              className={`min-h-11 min-w-11 p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              title="Tema Escuro"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-yellow-400 rounded-2xl shadow-sm mb-2">
            <CalculatorIcon className="w-8 h-8 text-zinc-900" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Rota Certa</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Utilitários - AM e PM</p>
        </div>

        {activeTab === 'dashboard' ? (
          <Dashboard
            stats={dashboardStats}
            todayRevenue={todayRevenue}
            savedRoutes={history.length}
            profit={profit}
            isProfitable={isProfitable}
            profitStatusColor={profitStatusColor}
            profitBgColor={profitBgColor}
            onNewRoute={() => setActiveTab('calculator')}
          />
        ) : activeTab === 'calculator' ? (
          <Calculator
            routeDate={routeDate}
            onDateChange={handleDateChange}
            routeName={routeName}
            onRouteNameChange={setRouteName}
            dayType={isSunday ? 'sunday' : 'weekday'}
            onDayTypeChange={(type) => setIsSunday(type === 'sunday')}
            km={km}
            onKmChange={setKm}
            addresses={addresses}
            onAddressesChange={setAddresses}
            observations={observations}
            onObservationsChange={setObservations}
            calculation={calculation}
            period={period}
            onPeriodChange={setPeriod}
            onSave={handleSaveRoute}
            saveError={saveError}
            saveSuccess={saveSuccess}
          />
        ) : activeTab === 'vehicle' ? (
          <VehicleView config={config} onSave={updateConfig} />
        ) : (
          <HistoryView
            history={history}
            onDelete={deleteFromHistory}
            onLoadRoute={handleLoadRoute}
            onShare={shareRoute}
            onExportRoutePDF={async (item) => {
              const pdfService = await loadPdfService();
              await pdfService.exportRouteToPDF(item);
            }}
            onClearAll={clearAllHistory}
            onExportCSV={exportToCSV}
            onExportPDF={async () => {
              const pdfService = await loadPdfService();
              await pdfService.exportHistoryToPDF(history);
            }}
            onGenerateReport={generateReport}
          />
        )}

        <nav
          aria-label="Navegação principal"
          className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-xl shadow-zinc-900/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95"
        >
          <div className="grid grid-cols-5 gap-1">
            {[
              { id: 'dashboard' as const, label: 'Início', icon: Home },
              { id: 'calculator' as const, label: 'Calcular', icon: CalculatorIcon },
              { id: 'history' as const, label: 'Histórico', icon: HistoryIcon },
              { id: 'vehicle' as const, label: 'Veículo', icon: Car },
              { id: 'settings' as const, label: 'Configurações', icon: Settings },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = id === 'settings' ? isSettingsOpen : activeTab === id;

              return (
                <button
                  key={id}
                  onClick={() => {
                    if (id === 'settings') {
                      setIsSettingsOpen(true);
                    } else {
                      setActiveTab(id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  aria-label={id === 'settings' ? 'Abrir configurações' : `Abrir ${label}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition-colors sm:text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                    isActive
                      ? 'bg-yellow-400 text-zinc-950'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={updateConfig}
        onOpenPrivacy={() => {
          setIsSettingsOpen(false);
          setIsPrivacyOpen(true);
        }}
      />

      <ReportModal
        isOpen={isReportOpen}
        period={reportPeriod}
        history={reportHistory}
        targetRevenue={config.targetRevenue}
        onClose={() => setIsReportOpen(false)}
        onExportPDF={async () => {
          const pdfService = await loadPdfService();
          await pdfService.exportHistoryToPDF(reportHistory);
        }}
        onExportCSV={() => exportToCSV(reportHistory, `rota_certa_relatorio_${reportPeriod}`)}
      />

      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}
