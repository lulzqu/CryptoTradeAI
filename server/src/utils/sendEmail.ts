import nodemailer from 'nodemailer';
import { EMAIL_SERVICE, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM } from '../config';

/**
 * Interface cho tham số gửi email
 */
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

/**
 * Gửi email sử dụng nodemailer
 * @param {EmailOptions} options - Các tùy chọn email
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Tạo transport với các cấu hình đã định nghĩa
  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD
    }
  });

  // Cấu hình email
  const mailOptions = {
    from: EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  // Gửi email
  await transporter.sendMail(mailOptions);
};

/**
 * Gửi email xác thực tài khoản
 * @param email - Email của người dùng
 * @param token - Token xác thực
 * @param username - Tên người dùng
 */
export const sendVerificationEmail = async (
  email: string,
  token: string,
  username: string
): Promise<void> => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const message = `
    Xin chào ${username},
    
    Cảm ơn bạn đã đăng ký tài khoản CryptoTradeAI. Vui lòng xác nhận địa chỉ email của bạn bằng cách nhấp vào liên kết dưới đây:
    
    ${verificationUrl}
    
    Liên kết này sẽ hết hạn sau 24 giờ.
    
    Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.
    
    Trân trọng,
    Đội ngũ CryptoTradeAI
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">CryptoTradeAI</h1>
      </div>
      <p>Xin chào <strong>${username}</strong>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản CryptoTradeAI. Vui lòng xác nhận địa chỉ email của bạn bằng cách nhấp vào liên kết dưới đây:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Xác nhận email</a>
      </div>
      <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ CryptoTradeAI</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
        <p>© ${new Date().getFullYear()} CryptoTradeAI. Tất cả các quyền được bảo lưu.</p>
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Xác nhận đăng ký tài khoản CryptoTradeAI',
    message,
    html
  });
};

/**
 * Gửi email đặt lại mật khẩu
 * @param email - Email của người dùng
 * @param token - Token đặt lại mật khẩu
 * @param username - Tên người dùng
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  username: string
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const message = `
    Xin chào ${username},
    
    Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản CryptoTradeAI của mình. Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:
    
    ${resetUrl}
    
    Liên kết này sẽ hết hạn sau 10 phút.
    
    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và đảm bảo rằng bạn vẫn có thể đăng nhập vào tài khoản của mình.
    
    Trân trọng,
    Đội ngũ CryptoTradeAI
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">CryptoTradeAI</h1>
      </div>
      <p>Xin chào <strong>${username}</strong>,</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản CryptoTradeAI của mình. Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
      </div>
      <p>Liên kết này sẽ hết hạn sau 10 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và đảm bảo rằng bạn vẫn có thể đăng nhập vào tài khoản của mình.</p>
      <p>Trân trọng,<br/>Đội ngũ CryptoTradeAI</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
        <p>© ${new Date().getFullYear()} CryptoTradeAI. Tất cả các quyền được bảo lưu.</p>
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Đặt lại mật khẩu CryptoTradeAI',
    message,
    html
  });
};

/**
 * Gửi email thông báo tín hiệu giao dịch
 * @param email - Email của người dùng
 * @param signal - Thông tin tín hiệu
 * @param username - Tên người dùng
 */
export const sendSignalAlert = async (
  email: string,
  signal: any,
  username: string
): Promise<void> => {
  const signalUrl = `${process.env.CLIENT_URL}/signals/${signal.id}`;

  const sentimentColor = signal.sentiment === 'BULLISH' ? '#4CAF50' : '#F44336';
  const sentimentText = signal.sentiment === 'BULLISH' ? 'Tăng giá' : 'Giảm giá';

  const message = `
    Xin chào ${username},
    
    Chúng tôi vừa phát hiện một tín hiệu giao dịch mới cho ${signal.symbol}:
    
    Loại: ${signal.type}
    Khung thời gian: ${signal.timeframe}
    Xu hướng: ${sentimentText}
    Giá khuyến nghị: ${signal.entryPrice}
    Độ tin cậy: ${signal.confidence}%
    
    Để xem chi tiết đầy đủ, vui lòng truy cập: ${signalUrl}
    
    Trân trọng,
    Đội ngũ CryptoTradeAI
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">CryptoTradeAI</h1>
      </div>
      <p>Xin chào <strong>${username}</strong>,</p>
      <p>Chúng tôi vừa phát hiện một tín hiệu giao dịch mới cho <strong>${signal.symbol}</strong>:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Loại:</strong> ${signal.type}</p>
        <p><strong>Khung thời gian:</strong> ${signal.timeframe}</p>
        <p><strong>Xu hướng:</strong> <span style="color: ${sentimentColor};">${sentimentText}</span></p>
        <p><strong>Giá khuyến nghị:</strong> ${signal.entryPrice}</p>
        <p><strong>Độ tin cậy:</strong> ${signal.confidence}%</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${signalUrl}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Xem chi tiết tín hiệu</a>
      </div>
      
      <p>Trân trọng,<br/>Đội ngũ CryptoTradeAI</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
        <p>© ${new Date().getFullYear()} CryptoTradeAI. Tất cả các quyền được bảo lưu.</p>
        <p>Nếu bạn không muốn nhận các thông báo này, vui lòng cập nhật <a href="${process.env.CLIENT_URL}/settings/notifications">thiết lập thông báo</a> của bạn.</p>
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: `Tín hiệu giao dịch mới: ${signal.type} ${signal.symbol}`,
    message,
    html
  });
}; 