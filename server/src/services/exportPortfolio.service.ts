import PDFDocument from 'pdfkit';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';
import { Position } from '../models/Position';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { EmailService } from './email.service';

export class PortfolioExportService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  // Xuất danh mục đầu tư sang PDF
  async exportPortfolioPDF(
    userId: string, 
    outputPath?: string
  ): Promise<string> {
    try {
      // Lấy người dùng và vị thế
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      const positions = await Position.find({ 
        user: userId 
      }).populate('signal');

      // Tạo đường dẫn xuất mặc định
      const defaultPath = path.join(
        process.cwd(), 
        'exports', 
        `portfolio_${userId}_${Date.now()}.pdf`
      );
      const finalPath = outputPath || defaultPath;

      // Tạo thư mục nếu chưa tồn tại
      const exportDir = path.dirname(finalPath);
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Tạo PDF
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(finalPath);
      doc.pipe(writeStream);

      // Tiêu đề
      doc.fontSize(20)
         .text('Báo Cáo Danh Mục Đầu Tư', { align: 'center' })
         .moveDown();

      // Thông tin người dùng
      doc.fontSize(12)
         .text(`Người dùng: ${user.name}`)
         .text(`Email: ${user.email}`)
         .moveDown();

      // Bảng vị thế
      doc.fontSize(14).text('Chi Tiết Vị Thế', { underline: true });
      doc.moveDown();

      // Tiêu đề bảng
      doc.fontSize(10)
         .text('Mã', 50, doc.y, { width: 100, continued: true })
         .text('Loại', 150, doc.y, { width: 100, continued: true })
         .text('Số Lượng', 250, doc.y, { width: 100, continued: true })
         .text('Giá Vào', 350, doc.y, { width: 100, continued: true })
         .text('Trạng Thái', 450, doc.y);
      doc.moveDown();

      // Dữ liệu vị thế
      positions.forEach(pos => {
        doc.fontSize(10)
           .text(pos.symbol, 50, doc.y, { width: 100, continued: true })
           .text(pos.type, 150, doc.y, { width: 100, continued: true })
           .text(pos.amount.toString(), 250, doc.y, { width: 100, continued: true })
           .text(pos.entryPrice.toString(), 350, doc.y, { width: 100, continued: true })
           .text(pos.status, 450, doc.y);
        doc.moveDown();
      });

      // Tổng kết
      doc.fontSize(14)
         .text('Tổng Kết', { underline: true })
         .moveDown();

      const totalPositions = positions.length;
      const totalInvestment = positions.reduce(
        (total, pos) => total + (pos.amount * pos.entryPrice), 
        0
      );

      doc.fontSize(12)
         .text(`Tổng Số Vị Thế: ${totalPositions}`)
         .text(`Tổng Đầu Tư: $${totalInvestment.toFixed(2)}`);

      doc.end();

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          logger.info(`Xuất PDF danh mục thành công: ${finalPath}`);
          resolve(finalPath);
        });

        writeStream.on('error', (error) => {
          logger.error(`Lỗi xuất PDF: ${error}`);
          reject(error);
        });
      });

    } catch (error) {
      logger.error(`Lỗi xuất danh mục PDF: ${error}`);
      throw error;
    }
  }

  // Xuất danh mục đầu tư sang CSV
  async exportPortfolioCSV(
    userId: string, 
    outputPath?: string
  ): Promise<string> {
    try {
      // Lấy người dùng và vị thế
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      const positions = await Position.find({ 
        user: userId 
      }).populate('signal');

      // Tạo đường dẫn xuất mặc định
      const defaultPath = path.join(
        process.cwd(), 
        'exports', 
        `portfolio_${userId}_${Date.now()}.csv`
      );
      const finalPath = outputPath || defaultPath;

      // Tạo thư mục nếu chưa tồn tại
      const exportDir = path.dirname(finalPath);
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Tạo stream ghi CSV
      const writeStream = fs.createWriteStream(finalPath);
      const csvStream = csv.format({ headers: true });
      csvStream.pipe(writeStream);

      // Ghi header
      csvStream.write([
        'Mã', 
        'Loại', 
        'Số Lượng', 
        'Giá Vào', 
        'Điểm Dừng Lỗ', 
        'Điểm Chốt Lời', 
        'Trạng Thái'
      ]);

      // Ghi dữ liệu vị thế
      positions.forEach(pos => {
        csvStream.write([
          pos.symbol,
          pos.type,
          pos.amount,
          pos.entryPrice,
          pos.stopLoss,
          pos.takeProfit,
          pos.status
        ]);
      });

      csvStream.end();

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          logger.info(`Xuất CSV danh mục thành công: ${finalPath}`);
          resolve(finalPath);
        });

        writeStream.on('error', (error) => {
          logger.error(`Lỗi xuất CSV: ${error}`);
          reject(error);
        });
      });

    } catch (error) {
      logger.error(`Lỗi xuất danh mục CSV: ${error}`);
      throw error;
    }
  }

  // Gửi email kèm file xuất
  async emailExportedPortfolio(
    userId: string, 
    exportType: 'pdf' | 'csv' = 'pdf'
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      // Xuất file
      const exportPath = exportType === 'pdf' 
        ? await this.exportPortfolioPDF(userId)
        : await this.exportPortfolioCSV(userId);

      // Gửi email với file đính kèm
      const emailResult = await this.emailService.sendPortfolioExportEmail(
        user.email, 
        exportPath, 
        exportType
      );

      return emailResult;
    } catch (error) {
      logger.error(`Lỗi gửi email danh mục: ${error}`);
      return false;
    }
  }
} 