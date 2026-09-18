import { afterEach, describe, expect, it, vi } from 'vitest';
import { exportCsvFile } from '../../src/services/fileExportService';

const capacitorMocks = vi.hoisted(() => ({
  isNativePlatform: vi.fn(() => true),
}));

const fileSystemMocks = vi.hoisted(() => ({
  writeFile: vi.fn(),
  getUri: vi.fn(async () => ({ uri: 'content://rota-certa/historico.csv' })),
}));

const shareMocks = vi.hoisted(() => ({
  share: vi.fn(),
}));

vi.mock('@capacitor/core', () => ({ Capacitor: capacitorMocks }));
vi.mock('@capacitor/filesystem', () => ({
  Directory: { Cache: 'CACHE' },
  Filesystem: fileSystemMocks,
}));
vi.mock('@capacitor/share', () => ({ Share: shareMocks }));

describe('fileExportService', () => {
  afterEach(() => {
    vi.clearAllMocks();
    capacitorMocks.isNativePlatform.mockReturnValue(true);
  });

  it('salva e compartilha CSV no ambiente nativo', async () => {
    await exportCsvFile('Data,Rota\n2026-09-08,Centro', 'historico.csv');

    expect(fileSystemMocks.writeFile).toHaveBeenCalledWith({
      path: 'historico.csv',
      data: 'RGF0YSxSb3RhCjIwMjYtMDktMDgsQ2VudHJv',
      directory: 'CACHE',
    });
    expect(shareMocks.share).toHaveBeenCalledWith({
      title: 'historico.csv',
      text: 'Arquivo CSV exportado pelo Rota Certa',
      url: 'content://rota-certa/historico.csv',
      dialogTitle: 'Salvar ou compartilhar CSV',
    });
  });
});
