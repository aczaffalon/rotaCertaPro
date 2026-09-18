import React from 'react';
import { FileText, X, Settings, Shield } from 'lucide-react';
import { AppConfig } from '../types';
import { storageService } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onOpenPrivacy: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onOpenPrivacy,
}) => {
  const [formData, setFormData] = React.useState<AppConfig>(config);

  React.useEffect(() => {
    setFormData(config);
  }, [config, isOpen]);

  const handleChange = (field: keyof AppConfig, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'platformName' ? value : field === 'closureType' ? String(value) : Number(value),
    }));
  };

  const closureText = (() => {
    if (formData.closureType === 'daily') return 'Fechamento diário: considera o dia atual.';
    if (formData.closureType === 'biweekly') return 'Fechamento quinzenal: considera 14 dias em blocos consistentes.';
    if (formData.closureType === 'monthly') return 'Fechamento mensal: considera o mês civil atual.';
    const weekdayLabel = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][formData.firstDayOfWeek % 7];
    return `Fechamento semanal: a semana começa em ${weekdayLabel} e fecha no dia anterior ao início da próxima semana.`;
  })();

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleExportBackup = () => {
    const json = storageService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rota_certa_backup_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const ok = storageService.importBackup(text);
      if (ok) {
        const newConfig = storageService.getConfig();
        onSave(newConfig);
        alert('Backup importado com sucesso. Algumas alterações podem precisar ser recarregadas.');
      } else {
        alert('Falha ao importar backup. Verifique o arquivo e tente novamente.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="settings-modal-title" className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            <h2 id="settings-modal-title" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Configurações</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar configurações"
            className="min-h-11 min-w-11 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Informações Básicas</h3>
            
            <div className="space-y-2">
              <label htmlFor="platformName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nome da Empresa/Plataforma
              </label>
              <input
                type="text"
                id="platformName"
                value={formData.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-zinc-900 dark:text-zinc-100"
                placeholder="Ex: Uber, iFood, Loggi..."
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="closureType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tipo de fechamento</label>
                <select
                  id="closureType"
                  value={formData.closureType}
                  onChange={(e) => handleChange('closureType', e.target.value as AppConfig['closureType'])}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-zinc-900 dark:text-zinc-100"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quinzenal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="firstDayOfWeek" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Dia inicial da semana</label>
                <select
                  id="firstDayOfWeek"
                  value={formData.firstDayOfWeek}
                  onChange={(e) => handleChange('firstDayOfWeek', Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-zinc-900 dark:text-zinc-100"
                >
                  <option value={0}>Domingo</option>
                  <option value={1}>Segunda</option>
                  <option value={2}>Terça</option>
                  <option value={3}>Quarta</option>
                  <option value={4}>Quinta</option>
                  <option value={5}>Sexta</option>
                  <option value={6}>Sábado</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-100">
              <p className="font-semibold">Fechamento atual</p>
              <p className="mt-1">{closureText}</p>
            </div>
          </div>

          {/* Metas e Ganhos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Metas e Ganhos</h3>
            
            <div className="space-y-2">
              <label htmlFor="targetRevenue" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Meta de Faturamento (R$)
              </label>
              <input
                type="number"
                id="targetRevenue"
                value={formData.targetRevenue}
                onChange={(e) => handleChange('targetRevenue', e.target.value)}
                step="100"
                min="0"
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-zinc-900 dark:text-zinc-100"
                placeholder="Ex: 2000"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Meta diária ou no período selecionado</p>
            </div>
          </div>

          {/* Custos de Operação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Custos de Operação</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="costPerKm" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Custo por KM (R$)
                </label>
                <input
                  type="number"
                  id="costPerKm"
                  value={formData.costPerKm}
                  onChange={(e) => handleChange('costPerKm', e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-zinc-900 dark:text-zinc-100"
                  placeholder="Ex: 0.50"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Para calcular despesa com manutenção</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="vehicleConsumption" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Consumo Médio (KM/L)
                </label>
                <input
                  type="number"
                  id="vehicleConsumption"
                  value={formData.vehicleConsumption}
                  onChange={(e) => handleChange('vehicleConsumption', e.target.value)}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-zinc-900 dark:text-zinc-100"
                  placeholder="Ex: 12.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="fuelPrice" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Valor do Combustível (R$/L)
              </label>
              <input
                type="number"
                id="fuelPrice"
                value={formData.fuelPrice}
                onChange={(e) => handleChange('fuelPrice', e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors text-zinc-900 dark:text-zinc-100"
                placeholder="Ex: 5.50"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Usado para calcular despesa com combustível</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              💡 Essas configurações ajudam a calcular seus custos reais e metas de ganho. Os valores serão usados para gerar relatórios e analyses detalhadas.
            </p>
          </div>

          {/* Backup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Backup de Dados</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Exporte todo o histórico e configurações para um arquivo JSON. Você pode importar este arquivo em outro dispositivo para restaurar seus dados.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleExportBackup} className="min-h-12 flex-1 px-4 py-2 bg-green-600 text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400">Exportar Backup</button>
              <button onClick={handleImportClick} className="min-h-12 flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Importar Backup</button>
              <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} style={{ display: 'none' }} />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Privacidade</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Veja como o Rota Certa armazena dados localmente e trata backups manuais.</p>
              </div>
            </div>
            <button onClick={onOpenPrivacy} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
              <FileText className="h-4 w-4" />
              Ver política de privacidade
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="min-h-12 flex-1 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="min-h-12 flex-1 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
