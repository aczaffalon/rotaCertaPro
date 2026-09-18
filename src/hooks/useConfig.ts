import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { storageService } from '../services/storageService';

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig>(storageService.getDefaultConfig());

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const savedConfig = storageService.getConfig();
    setConfig(savedConfig);
  }, []);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    storageService.setConfig(updatedConfig);
  };

  const resetConfig = () => {
    const defaultConfig = storageService.getDefaultConfig();
    setConfig(defaultConfig);
    storageService.resetConfig();
  };

  return {
    config,
    updateConfig,
    resetConfig,
  };
};
