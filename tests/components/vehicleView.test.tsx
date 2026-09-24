import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { VehicleView } from '../../src/components/VehicleView';
import { storageService } from '../../src/services/storageService';

describe('VehicleView', () => {
  it('exibe os dados do veículo e o custo estimado por quilômetro', () => {
    const config = {
      ...storageService.getDefaultConfig(),
      vehicleName: 'Honda CG 160',
      vehicleConsumption: 30,
      fuelPrice: 6,
    };

    const html = renderToStaticMarkup(<VehicleView config={config} onSave={vi.fn()} />);

    expect(html).toContain('Meu Veículo');
    expect(html).toContain('Honda CG 160');
    expect(html).toContain('R$ 0,20');
  });
});
