import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { logger } from '../utils/logger';

export interface CSVExportOptions {
  delimiter?: string;
  headers?: string[];
}

export class CSVExportUtility {
  // Tạo thư mục xuất nếu chưa tồn tại
  private static ensureExportDirectory(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  // Xuất danh mục đầu tư sang CSV
  static exportPortfolio(
    data: any[], 
    options: CSVExportOptions = {}
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
      const filename = `portfolio_${Date.now()}.csv`;
      const filePath = path.join(exportDir, filename);

      // Chuẩn bị headers
      const defaultHeaders = [
        'Mã', 'Loại', 'Số Lượng', 
        'Giá Vào', 'Giá Hiện Tại', 
        'Lợi Nhuận/Lỗ'
      ];
      const headers = options.headers || defaultHeaders;

      // Tạo stream ghi file
      const writeStream = fs.createWriteStream(filePath);
      const csvStream = csv.format({ 
        headers: true,
        delimiter: options.delimiter || ','
      });

      // Kết nối stream
      csvStream.pipe(writeStream);

      // Ghi headers
      csvStream.write(headers);

      // Ghi dữ liệu
      data.forEach(item => {
        csvStream.write([
          item.symbol,
          item.type,
          item.amount,
          item.entryPrice.toFixed(2),
          item.currentPrice.toFixed(2),
          item.profitLoss.toFixed(2)
        ]);
      });

      // Kết thúc stream
      csvStream.end();

      logger.info(`Xuất CSV thành công: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Lỗi xuất CSV: ${error}`);
      throw error;
    }
  }

  // Xuất báo cáo giao dịch
  static exportTradeReport(
    trades: any[], 
    options: CSVExportOptions = {}
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
      const filename = `trade_report_${Date.now()}.csv`;
      const filePath = path.join(exportDir, filename);

      // Chuẩn bị headers
      const defaultHeaders = [
        'Mã', 'Loại', 'Ngày', 
        'Giá', 'Số Lượng', 'Trạng Thái'
      ];
      const headers = options.headers || defaultHeaders;

      // Tạo stream ghi file
      const writeStream = fs.createWriteStream(filePath);
      const csvStream = csv.format({ 
        headers: true,
        delimiter: options.delimiter || ','
      });

      // Kết nối stream
      csvStream.pipe(writeStream);

      // Ghi headers
      csvStream.write(headers);

      // Ghi dữ liệu
      trades.forEach(trade => {
        csvStream.write([
          trade.symbol,
          trade.type,
          trade.date.toLocaleDateString(),
          trade.price.toFixed(2),
          trade.amount,
          trade.status
        ]);
      });

      // Kết thúc stream
      csvStream.end();

      logger.info(`Xuất CSV thành công: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Lỗi xuất CSV: ${error}`);
      throw error;
    }
  }

  // Chuyển đổi dữ liệu sang CSV
  static convertToCSV(
    data: any[], 
    options: CSVExportOptions = {}
  ): string {
    try {
      const csvStream = csv.format({ 
        headers: true,
        delimiter: options.delimiter || ','
      });

      const chunks: string[] = [];
      csvStream.on('data', (chunk) => chunks.push(chunk));

      // Ghi headers
      csvStream.write(options.headers || Object.keys(data[0]));

      // Ghi dữ liệu
      data.forEach(item => {
        csvStream.write(
          options.headers 
            ? options.headers.map(header => item[header]) 
            : Object.values(item)
        );
      });

      csvStream.end();

      return chunks.join('');
    } catch (error) {
      logger.error(`Lỗi chuyển đổi CSV: ${error}`);
      throw error;
    }
  }
} 