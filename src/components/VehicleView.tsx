import React, { useEffect, useMemo, useState } from 'react';
import { Car, Fuel, Gauge, Save } from 'lucide-react';
import { AppConfig } from '../types';
import { formatCurrency } from '../utils/calculations';

interface VehicleViewProps {
  config: AppConfig;
  onSave: (config: Partial<AppConfig>) => void;
}

const vehicleTypes = [
  { value: 'motorcycle', label: 'Moto' },
  { value: 'car', label: 'Carro' },
  { value: 'van', label: 'Van' },
  { value: 'other', label: 'Outro' },
] as const;

export const VehicleView: React.FC<VehicleViewProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState({ vehicleName: config.vehicleName, vehicleType: config.vehicleType, fuelType: config.fuelType, vehicleOdometer: config.vehicleOdometer, vehicleConsumption: config.vehicleConsumption, fuelPrice: config.fuelPrice });
  const [saved, setSaved] = useState(false);
  useEffect(() => setFormData({ vehicleName: config.vehicleName, vehicleType: config.vehicleType, fuelType: config.fuelType, vehicleOdometer: config.vehicleOdometer, vehicleConsumption: config.vehicleConsumption, fuelPrice: config.fuelPrice }), [config]);
  const fuelCostPerKm = useMemo(() => formData.vehicleConsumption > 0 ? formData.fuelPrice / formData.vehicleConsumption : 0, [formData.fuelPrice, formData.vehicleConsumption]);
  const updateNumber = (field: 'vehicleOdometer' | 'vehicleConsumption' | 'fuelPrice', value: string) => { setSaved(false); setFormData(current => ({ ...current, [field]: Math.max(0, Number(value) || 0) })); };
  const handleSave = () => { onSave(formData); setSaved(true); };

  return <section aria-labelledby="vehicle-title" className="space-y-6">
    <div className="rounded-3xl bg-zinc-900 p-6 text-white shadow-sm dark:bg-zinc-800"><div className="flex items-start gap-4"><div className="rounded-2xl bg-yellow-400 p-3 text-zinc-950"><Car className="h-7 w-7" /></div><div><h2 id="vehicle-title" className="text-xl font-bold">Meu Veículo</h2><p className="mt-1 text-sm text-zinc-300">Cadastre os dados básicos para acompanhar o custo da operação.</p></div></div></div>
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"><div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Identificação<input value={formData.vehicleName} onChange={event => { setSaved(false); setFormData(current => ({ ...current, vehicleName: event.target.value })); }} placeholder="Ex.: Honda CG 160" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" /></label>
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Tipo<select value={formData.vehicleType} onChange={event => { setSaved(false); setFormData(current => ({ ...current, vehicleType: event.target.value as AppConfig['vehicleType'] })); }} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">{vehicleTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Combustível<input value={formData.fuelType} onChange={event => { setSaved(false); setFormData(current => ({ ...current, fuelType: event.target.value })); }} placeholder="Ex.: Gasolina" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" /></label>
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Hodômetro atual (km)<input type="number" min="0" value={formData.vehicleOdometer} onChange={event => updateNumber('vehicleOdometer', event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"><span className="flex items-center gap-2"><Gauge className="h-4 w-4" />Consumo médio (km/l)</span><input type="number" min="0" step="0.1" value={formData.vehicleConsumption} onChange={event => updateNumber('vehicleConsumption', event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" /></label>
        <label className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"><span className="flex items-center gap-2"><Fuel className="h-4 w-4" />Preço do combustível (R$/l)</span><input type="number" min="0" step="0.01" value={formData.fuelPrice} onChange={event => updateNumber('fuelPrice', event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" /></label>
      </div>
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/30"><p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Custo estimado de combustível</p><p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(fuelCostPerKm)} <span className="text-sm font-medium text-zinc-500">por km</span></p></div>
      <button onClick={handleSave} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 dark:bg-zinc-100 dark:text-zinc-900"><Save className="h-5 w-5" /> {saved ? 'Dados salvos' : 'Salvar veículo'}</button>
    </div></div>
  </section>;
};
