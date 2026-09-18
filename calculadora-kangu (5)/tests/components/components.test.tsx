import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Dashboard } from '../../src/components/Dashboard';
import { PrivacyPolicyModal } from '../../src/components/PrivacyPolicyModal';

const dashboardStats = {
  totalRevenue: 500,
  totalExpense: 50,
  estimatedProfit: 450,
  totalKm: 120,
  totalDeliveries: 35,
  averageDailyRevenue: 500,
  metaProgress: 25,
  days: 2,
};

describe('componentes principais', () => {
  it('exibe os indicadores essenciais do Dashboard', () => {
    const html = renderToStaticMarkup(
      <Dashboard
        stats={dashboardStats}
        todayRevenue={250}
        savedRoutes={3}
        profit={450}
        isProfitable
        profitStatusColor="text-green-600"
        profitBgColor="bg-green-50"
        onNewRoute={vi.fn()}
      />
    );

    expect(html).toContain('Ganhos de hoje');
    expect(html).toContain('Rotas salvas');
    expect(html).toContain('KM rodados');
    expect(html).toContain('Entregas');
    expect(html).toContain('Nova rota');
  });

  it('exibe a política e o marcador de suporte quando aberta', () => {
    const html = renderToStaticMarkup(<PrivacyPolicyModal isOpen onClose={vi.fn()} />);

    expect(html).toContain('Política de Privacidade');
    expect(html).toContain('armazenados localmente');
    expect(html).toContain('aczaffalon@gmail.com');
  });

  it('oferece rótulo acessível para a ação primária em mobile', () => {
    const html = renderToStaticMarkup(
      <Dashboard
        stats={dashboardStats}
        todayRevenue={250}
        savedRoutes={3}
        profit={450}
        isProfitable
        profitStatusColor="text-green-600"
        profitBgColor="bg-green-50"
        onNewRoute={vi.fn()}
      />
    );

    expect(html).toContain('aria-label="Nova rota"');
  });
});
