import nodemailer from 'nodemailer';
import { config } from '../config';
import { Signal } from '../types/analysis';
import { Trade } from '../types/trading';

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.app.url}/verify-email?token=${token}`;
    
    await this.transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Xác thực email - CryptoTradeAI',
      html: `
        <h1>Xác thực email của bạn</h1>
        <p>Vui lòng nhấp vào liên kết bên dưới để xác thực email của bạn:</p>
        <a href="${verificationUrl}">Xác thực email</a>
        <p>Liên kết này sẽ hết hạn trong 24 giờ.</p>
      `
    });
  }

  public async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${config.app.url}/reset-password?token=${token}`;
    
    await this.transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Đặt lại mật khẩu - CryptoTradeAI',
      html: `
        <h1>Đặt lại mật khẩu</h1>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết bên dưới:</p>
        <a href="${resetUrl}">Đặt lại mật khẩu</a>
        <p>Liên kết này sẽ hết hạn trong 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `
    });
  }

  public async sendSignalNotification(email: string, signal: Signal): Promise<void> {
    await this.transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: `Tín hiệu giao dịch mới - ${signal.symbol}`,
      html: `
        <h1>Tín hiệu giao dịch mới</h1>
        <p><strong>Cặp tiền:</strong> ${signal.symbol}</p>
        <p><strong>Loại:</strong> ${signal.type}</p>
        <p><strong>Giá vào lệnh:</strong> ${signal.entryPrice}</p>
        <p><strong>Stop Loss:</strong> ${signal.stopLoss}</p>
        <p><strong>Take Profit:</strong> ${signal.takeProfit}</p>
        <p><strong>Độ tin cậy:</strong> ${signal.confidence}%</p>
        <p><strong>Thời gian:</strong> ${signal.timestamp}</p>
      `
    });
  }

  public async sendTradeNotification(email: string, trade: Trade): Promise<void> {
    await this.transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: `Giao dịch đã thực hiện - ${trade.symbol}`,
      html: `
        <h1>Giao dịch đã thực hiện</h1>
        <p><strong>Cặp tiền:</strong> ${trade.symbol}</p>
        <p><strong>Loại:</strong> ${trade.type}</p>
        <p><strong>Số lượng:</strong> ${trade.quantity}</p>
        <p><strong>Giá:</strong> ${trade.price}</p>
        <p><strong>Phí giao dịch:</strong> ${trade.fee} ${trade.feeAsset}</p>
        <p><strong>Thời gian:</strong> ${trade.timestamp}</p>
      `
    });
  }

  public async sendSystemNotification(email: string, title: string, message: string): Promise<void> {
    await this.transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: title,
      html: `
        <h1>${title}</h1>
        <p>${message}</p>
      `
    });
  }
} 