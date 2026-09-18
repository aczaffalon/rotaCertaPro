import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capacitor } from '@capacitor/core';
import { RouteHistory } from '../types';
import { formatCurrency, formatDate, getDayType } from '../utils/calculations';
import { VEHICLE_PROFILE } from '../utils/constants';
import { shareBase64File } from './fileExportService';

const savePdf = async (doc: jsPDF, fileName: string): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    doc.save(fileName);
    return;
  }

  const dataUri = doc.output('datauristring');
  const base64Data = dataUri.split(',')[1];

  if (!base64Data) {
    throw new Error('Não foi possível preparar o PDF para armazenamento.');
  }

  await shareBase64File({
    fileName,
    base64Data,
    text: 'PDF exportado pelo Rota Certa',
    dialogTitle: 'Compartilhar PDF',
  });
};

export const pdfService = {
  exportHistoryToPDF: async (history: RouteHistory[]): Promise<void> => {
    if (history.length === 0) return;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Histórico de Rotas - ${VEHICLE_PROFILE}`, 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 30);

    const tableData = history.map(item => [
      formatDate(item.date),
      item.routeName,
      getDayType(item.isSunday),
      item.period || 'AM',
      `${item.km || 0} km`,
      item.addresses || 0,
      formatCurrency(item.baseRate),
      formatCurrency(item.bonus),
      formatCurrency(item.total)
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Data', 'Rota', 'Dia', 'Período', 'KM', 'Endereços', 'Base', 'Bônus', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [250, 204, 21], textColor: [0, 0, 0] },
      styles: { fontSize: 9 },
    });

    await savePdf(doc, `rota_certa_historico_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  exportRouteToPDF: async (item: RouteHistory): Promise<void> => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`Detalhes da Rota - ${VEHICLE_PROFILE}`, 14, 22);
    
    doc.setFontSize(12);
    
    doc.text(`Rota: ${item.routeName}`, 14, 40);
    doc.text(`Data: ${formatDate(item.date)}`, 14, 50);
    doc.text(`Dia: ${getDayType(item.isSunday)} • ${item.period || 'AM'}`, 14, 60);
    doc.text(`KM Total: ${item.km || 0} km`, 14, 70);
    doc.text(`Endereços: ${item.addresses || 0}`, 14, 80);
    
    doc.text(`Valor Base: ${formatCurrency(item.baseRate)}`, 14, 100);
    doc.text(`Bônus: ${formatCurrency(item.bonus)}`, 14, 110);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Bruto: ${formatCurrency(item.total)}`, 14, 130);
    
    if (item.observations) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Observações:', 14, 150);
      
      const splitObs = doc.splitTextToSize(item.observations, 180);
      doc.text(splitObs, 14, 160);
    }

    const safeRouteName = item.routeName.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'sem_nome';
    await savePdf(doc, `Rota_Certa_${safeRouteName}_${item.date}.pdf`);
  }
};
