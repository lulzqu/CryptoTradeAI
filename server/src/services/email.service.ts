import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

// Interface cho cấu hình email
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Interface cho email
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    try {
      // Cấu hình transporter từ biến môi trường
      const emailConfig: EmailConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || ''
        }
      };

      this.transporter = nodemailer.createTransport(emailConfig);
    } catch (error) {
      logger.error(`Lỗi khởi tạo email transporter: ${error}`);
      throw error;
    }
  }

  // Gửi email đơn giản
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const defaultOptions = {
        from: process.env.EMAIL_FROM || 'CryptoTradeAI <noreply@cryptotradeai.com>'
      };

      const mailOptions = { ...defaultOptions, ...options };

      const info = await this.transporter.sendMail(mailOptions);
      
      logger.info(`Email đã được gửi: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi gửi email: ${error}`);
      return false;
    }
  }

  // Gửi email xác thực
  async sendVerificationEmail(
    to: string, 
    verificationCode: string
  ): Promise<boolean> {
    const subject = 'Xác Thực Tài Khoản CryptoTradeAI';
    const html = `
      <h1>Xác Thực Tài Khoản</h1>
      <p>Mã xác thực của bạn là: <strong>${verificationCode}</strong></p>
      <p>Mã này sẽ hết hạn trong 15 phút.</p>
    `;

    return this.sendEmail({ to, subject, html });
  }

  // Gửi email thông báo tín hiệu
  async sendSignalNotificationEmail(
    to: string, 
    signalDetails: {
      symbol: string;
      type: string;
      price: number;
    }
  ): Promise<boolean> {
    const subject = 'Tín Hiệu Giao Dịch Mới - CryptoTradeAI';
    const html = `
      <h1>Tín Hiệu Giao Dịch Mới</h1>
      <table>
        <tr>
          <td><strong>Cặp Giao Dịch:</strong></td>
          <td>${signalDetails.symbol}</td>
        </tr>
        <tr>
          <td><strong>Loại:</strong></td>
          <td>${signalDetails.type}</td>
        </tr>
        <tr>
          <td><strong>Giá:</strong></td>
          <td>$${signalDetails.price.toFixed(2)}</td>
        </tr>
      </table>
    `;

    return this.sendEmail({ to, subject, html });
  }

  // Gửi email xuất danh mục
  async sendPortfolioExportEmail(
    to: string, 
    exportPath: string,
    exportType: 'pdf' | 'csv'
  ): Promise<boolean> {
    const subject = 'Báo Cáo Danh Mục Đầu Tư - CryptoTradeAI';
    const html = `
      <h1>Báo Cáo Danh Mục Đầu Tư</h1>
      <p>Báo cáo danh mục đầu tư của bạn đã được xuất thành công.</p>
    `;

    return this.sendEmail({
      to, 
      subject, 
      html,
      attachments: [{
        filename: `portfolio.${exportType}`,
        path: exportPath
      }]
    });
  }

  // Gửi email thông báo giao dịch tự động
  async sendAutoTradingNotificationEmail(
    to: string, 
    tradeDetails: {
      symbol: string;
      type: string;
      amount: number;
      price: number;
    }
  ): Promise<boolean> {
    const subject = 'Thông Báo Giao Dịch Tự Động - CryptoTradeAI';
    const html = `
      <h1>Giao Dịch Tự Động</h1>
      <table>
        <tr>
          <td><strong>Cặp Giao Dịch:</strong></td>
          <td>${tradeDetails.symbol}</td>
        </tr>
        <tr>
          <td><strong>Loại:</strong></td>
          <td>${tradeDetails.type}</td>
        </tr>
        <tr>
          <td><strong>Số Lượng:</strong></td>
          <td>${tradeDetails.amount}</td>
        </tr>
        <tr>
          <td><strong>Giá:</strong></td>
          <td>$${tradeDetails.price.toFixed(2)}</td>
        </tr>
      </table>
    `;

    return this.sendEmail({ to, subject, html });
  }
} 