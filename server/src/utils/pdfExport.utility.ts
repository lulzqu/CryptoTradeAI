import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

export interface PDFExportOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
}

export class PDFExportUtility {
  // Tạo thư mục xuất nếu chưa tồn tại
  private static ensureExportDirectory(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  // Xuất danh mục đầu tư sang PDF
  static exportPortfolio(
    data: any[], 
    options?: PDFExportOptions
  ): string {
    try {
      // Tạo thư mục xuất
      const exportDir = path.join(
        process.cwd(), 
        'exports', 
        'portfolio'
      );
      this.ensureExportDirectory(exportDir);

      // Tạo tên file
      const filename = `portfolio_${Date.now()}.pdf`;
      const filePath = path.join(exportDir, filename);

      // Tạo PDF
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Tiêu đề
      doc.fontSize(20)
         .text(options?.title || 'Báo Cáo Danh Mục Đầu Tư', { 
           align: 'center' 
         });

      // Thông tin metadata
      doc.info.Title = options?.title || 'Báo Cáo Danh Mục Đầu Tư';
      doc.info.Author = options?.author || 'CryptoTradeAI';
      doc.info.Subject = options?.subject || 'Báo Cáo Đầu Tư';
      doc.info.Keywords = options?.keywords?.join(', ') || '';

      // Bảng dữ liệu
      const tableTop = 100;
      const headers = [
        'Mã', 'Loại', 'Số Lượng', 
        'Giá Vào', 'Giá Hiện Tại', 
        'Lợi Nhuận/Lỗ'
      ];

      // Vẽ header
      doc.fontSize(12)
         .font('Helvetica-Bold');
      headers.forEach((header, i) => {
        doc.text(header, 50 + i * 90, tableTop);
      });

      // Vẽ dữ liệu
      doc.font('Helvetica');
      data.forEach((item, rowIndex) => {
        const y = tableTop + 20 + rowIndex * 20;
        doc.text(item.symbol, 50, y)
           .text(item.type, 140, y)
           .text(item.amount.toString(), 230, y)
           .text(`$${item.entryPrice.toFixed(2)}`, 320, y)
           .text(`$${item.currentPrice.toFixed(2)}`, 410, y)
           .text(`$${item.profitLoss.toFixed(2)}`, 500, y);
      });

      // Tổng kết
      const totalProfit = data.reduce(
        (sum, item) => sum + item.profitLoss, 
        0
      );
      doc.fontSize(14)
         .text(`Tổng Lợi Nhuận/Lỗ: $${totalProfit.toFixed(2)}`, 
           50, 
           tableTop + 20 * (data.length + 2)
         );

      // Kết thúc và đóng file
      doc.end();

      logger.info(`Xuất PDF thành công: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Lỗi xuất PDF: ${error}`);
      throw error;
    }
  }

  // Xuất báo cáo giao dịch
  static exportTradeReport(
    trades: any[], 
    options?: PDFExportOptions
  ): string {
    try {
      // Tạo thư mục xuất
      const exportDir = path.join(
        process.cwd(), 
        'exports', 
        'trades'
      );
      this.ensureExportDirectory(exportDir);

      // Tạo tên file
      const filename = `trade_report_${Date.now()}.pdf`;
      const filePath = path.join(exportDir, filename);

      // Tạo PDF
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Tiêu đề
      doc.fontSize(20)
         .text(options?.title || 'Báo Cáo Giao Dịch', { 
           align: 'center' 
         });

      // Thông tin metadata
      doc.info.Title = options?.title || 'Báo Cáo Giao Dịch';
      doc.info.Author = options?.author || 'CryptoTradeAI';
      doc.info.Subject = options?.subject || 'Chi Tiết Giao Dịch';
      doc.info.Keywords = options?.keywords?.join(', ') || '';

      // Bảng dữ liệu
      const tableTop = 100;
      const headers = [
        'Mã', 'Loại', 'Ngày', 
        'Giá', 'Số Lượng', 'Trạng Thái'
      ];

      // Vẽ header
      doc.fontSize(12)
         .font('Helvetica-Bold');
      headers.forEach((header, i) => {
        doc.text(header, 50 + i * 90, tableTop);
      });

      // Vẽ dữ liệu
      doc.font('Helvetica');
      trades.forEach((trade, rowIndex) => {
        const y = tableTop + 20 + rowIndex * 20;
        doc.text(trade.symbol, 50, y)
           .text(trade.type, 140, y)
           .text(trade.date.toLocaleDateString(), 230, y)
           .text(`$${trade.price.toFixed(2)}`, 320, y)
           .text(trade.amount.toString(), 410, y)
           .text(trade.status, 500, y);
      });

      // Tổng kết
      const totalTrades = trades.length;
      const successfulTrades = trades.filter(
        t => t.status === 'SUCCESSFUL'
      ).length;
      
      doc.fontSize(14)
         .text(`Tổng Số Giao Dịch: ${totalTrades}`, 
           50, 
           tableTop + 20 * (trades.length + 2)
         )
         .text(`Giao Dịch Thành Công: ${successfulTrades}`, 
           50, 
           tableTop + 20 * (trades.length + 3)
         );

      // Kết thúc và đóng file
      doc.end();

      logger.info(`Xuất PDF thành công: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Lỗi xuất PDF: ${error}`);
      throw error;
    }
  }
} 