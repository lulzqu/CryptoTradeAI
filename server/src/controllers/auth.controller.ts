import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { EmailService } from '../services/email';
import { config } from '../config';

// @desc    Đăng ký người dùng
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Kiểm tra xem email đã tồn tại chưa
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError(400, 'Email đã được sử dụng'));
  }

  // Tạo token xác thực email
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Tạo người dùng mới
  const user = await User.create({
    name,
    email,
    password,
    verificationToken
  });

  // Gửi email xác thực
  const emailService = EmailService.getInstance();
  await emailService.sendVerificationEmail(email, verificationToken);

  // Trả về token
  sendTokenResponse(user, 201, res);
});

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Kiểm tra email và password có tồn tại
  if (!email || !password) {
    return next(new AppError(400, 'Vui lòng nhập email và mật khẩu'));
  }

  // Kiểm tra người dùng
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError(401, 'Thông tin đăng nhập không hợp lệ'));
  }

  // Kiểm tra mật khẩu
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError(401, 'Thông tin đăng nhập không hợp lệ'));
  }

  // Trả về token
  sendTokenResponse(user, 200, res);
});

// @desc    Đăng xuất người dùng / xóa cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Quên mật khẩu
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng với email này'));
  }

  // Tạo reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Gửi email
  try {
    const emailService = EmailService.getInstance();
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Email đã được gửi'
    });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError(500, 'Không thể gửi email. Vui lòng thử lại sau'));
  }
});

// @desc    Đặt lại mật khẩu
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Lấy token từ URL
  const resetToken = req.params.resetToken;

  // Mã hóa token để tìm kiếm trong DB
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError(400, 'Token không hợp lệ hoặc đã hết hạn'));
  }

  // Đặt mật khẩu mới
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Trả về token
  sendTokenResponse(user, 200, res);
});

// @desc    Cập nhật mật khẩu
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id).select('+password');

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new AppError(401, 'Mật khẩu hiện tại không đúng'));
  }

  // Cập nhật mật khẩu
  user.password = req.body.newPassword;
  await user.save();

  // Trả về token
  sendTokenResponse(user, 200, res);
});

// @desc    Xác thực email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return next(new AppError(400, 'Token không hợp lệ'));
  }

  // Đánh dấu email đã được xác thực
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  // Trả về token
  sendTokenResponse(user, 200, res);
});

// Hàm hỗ trợ tạo token và trả về response
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Tạo token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + parseInt(config.app.jwtExpiresIn) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.app.env === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
}; 