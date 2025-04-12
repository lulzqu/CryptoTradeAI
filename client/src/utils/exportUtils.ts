import { Signal } from '../types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportSignalsToExcel = (signals: Signal[], filename: string = 'signals.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(signals.map(signal => ({
    'ID': signal.id,
    'Symbol': signal.symbol,
    'Type': signal.type,
    'Sentiment': signal.sentiment,
    'Entry Price': signal.entryPrice,
    'Stop Loss': signal.stopLoss,
    'Take Profit': signal.takeProfit,
    'Confidence': signal.confidence,
    'Timestamp': new Date(signal.timestamp).toLocaleString(),
    'Status': signal.status,
    'Analysis': signal.analysis
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Signals');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, filename);
};

export const exportSignalsToCSV = (signals: Signal[], filename: string = 'signals.csv') => {
  const headers = ['ID', 'Symbol', 'Type', 'Sentiment', 'Entry Price', 'Stop Loss', 'Take Profit', 'Confidence', 'Timestamp', 'Status', 'Analysis'];
  const csvContent = [
    headers.join(','),
    ...signals.map(signal => [
      signal.id,
      signal.symbol,
      signal.type,
      signal.sentiment,
      signal.entryPrice,
      signal.stopLoss,
      signal.takeProfit,
      signal.confidence,
      new Date(signal.timestamp).toLocaleString(),
      signal.status,
      signal.analysis
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

export const exportSignalsToPDF = async (signals: Signal[], filename: string = 'signals.pdf') => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  let y = 20;
  signals.forEach((signal, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(`Signal #${index + 1}`, 20, y);
    y += 10;
    doc.text(`Symbol: ${signal.symbol}`, 20, y);
    y += 10;
    doc.text(`Type: ${signal.type}`, 20, y);
    y += 10;
    doc.text(`Sentiment: ${signal.sentiment}`, 20, y);
    y += 10;
    doc.text(`Entry Price: ${signal.entryPrice}`, 20, y);
    y += 10;
    doc.text(`Stop Loss: ${signal.stopLoss}`, 20, y);
    y += 10;
    doc.text(`Take Profit: ${signal.takeProfit}`, 20, y);
    y += 10;
    doc.text(`Confidence: ${signal.confidence}%`, 20, y);
    y += 10;
    doc.text(`Timestamp: ${new Date(signal.timestamp).toLocaleString()}`, 20, y);
    y += 10;
    doc.text(`Status: ${signal.status}`, 20, y);
    y += 10;
    doc.text(`Analysis: ${signal.analysis}`, 20, y);
    y += 20;
  });
  
  doc.save(filename);
}; 