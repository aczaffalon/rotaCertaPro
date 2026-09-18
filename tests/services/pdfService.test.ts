import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pdfService } from '../../src/services/pdfService';

const capacitorMocks = vi.hoisted(() => ({
  isNativePlatform: vi.fn(() => false),
}));

const fileSystemMocks = vi.hoisted(() => ({
  writeFile: vi.fn(),
  getUri: vi.fn(async () => ({ uri: 'content://rota-certa/document.pdf' })),
}));

const shareMocks = vi.hoisted(() => ({
  share: vi.fn(),
}));

const documentMocks = vi.hoisted(() => ({
  save: vi.fn(),
  output: vi.fn(() => 'data:application/pdf;base64,JVBERi0='),
  setFontSize: vi.fn(),
  text: vi.fn(),
  setFont: vi.fn(),
  splitTextToSize: vi.fn(() => []),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: capacitorMocks,
}));

vi.mock('@capacitor/filesystem', () => ({
  Directory: { Cache: 'CACHE' },
  Filesystem: fileSystemMocks,
}));

vi.mock('@capacitor/share', () => ({
  Share: shareMocks,
}));

vi.mock('jspdf', () => ({
  default: vi.fn(() => documentMocks),
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

const route = {
  id: 'route-1',
  date: '2026-09-08',
  routeName: 'Centro Norte',
  observations: '',
  isSunday: false,
  period: 'AM' as const,
  km: 100,
  addresses: 60,
  baseRate: 262.73,
  bonus: 0,
  total: 262.73,
};

describe('pdfService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-08T12:00:00Z'));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    capacitorMocks.isNativePlatform.mockReturnValue(false);
  });

  it('mantém o download do navegador fora do ambiente nativo', async () => {
    await pdfService.exportRouteToPDF(route);

    expect(documentMocks.save).toHaveBeenCalledWith('Rota_Certa_Centro_Norte_2026-09-08.pdf');
    expect(fileSystemMocks.writeFile).not.toHaveBeenCalled();
    expect(shareMocks.share).not.toHaveBeenCalled();
  });

  it('salva o PDF e abre o compartilhamento no ambiente nativo', async () => {
    capacitorMocks.isNativePlatform.mockReturnValue(true);

    await pdfService.exportHistoryToPDF([route]);

    expect(documentMocks.save).not.toHaveBeenCalled();
    expect(fileSystemMocks.writeFile).toHaveBeenCalledWith({
      path: 'rota_certa_historico_2026-09-08.pdf',
      data: 'JVBERi0=',
      directory: 'CACHE',
    });
    expect(fileSystemMocks.getUri).toHaveBeenCalledWith({
      path: 'rota_certa_historico_2026-09-08.pdf',
      directory: 'CACHE',
    });
    expect(shareMocks.share).toHaveBeenCalledWith({
      title: 'rota_certa_historico_2026-09-08.pdf',
      text: 'PDF exportado pelo Rota Certa',
      url: 'content://rota-certa/document.pdf',
      dialogTitle: 'Compartilhar PDF',
    });
  });
});
