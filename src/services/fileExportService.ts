import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

type SharedFileOptions = {
  fileName: string;
  base64Data: string;
  title?: string;
  text: string;
  dialogTitle: string;
};

const encodeTextAsBase64 = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const downloadInBrowser = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const shareBase64File = async ({
  fileName,
  base64Data,
  title = fileName,
  text,
  dialogTitle,
}: SharedFileOptions): Promise<void> => {
  if (!Filesystem || !Directory || !Share) {
    throw new Error('Arquivo não disponível para compartilhamento nativo.');
  }

  await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Cache,
  });

  const { uri } = await Filesystem.getUri({
    path: fileName,
    directory: Directory.Cache,
  });

  await Share.share({
    title,
    text,
    url: uri,
    dialogTitle,
  });
};

export const exportCsvFile = async (csvContent: string, fileName: string): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    downloadInBrowser(csvContent, fileName, 'text/csv;charset=utf-8');
    return;
  }

  await shareBase64File({
    fileName,
    base64Data: encodeTextAsBase64(csvContent),
    text: 'Arquivo CSV exportado pelo Rota Certa',
    dialogTitle: 'Salvar ou compartilhar CSV',
  });
};
