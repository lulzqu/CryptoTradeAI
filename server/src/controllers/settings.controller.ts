import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import UserModel from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';

// Mở rộng Request interface để thêm user
declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

// @desc    Lấy cài đặt người dùng
// @route   GET /api/settings/user
// @access  Private
export const getUserSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findById(req.user?.id).select(
    'name email profileImage preferences apiKeys notificationSettings securitySettings'
  );
  
  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng'));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Cập nhật cài đặt người dùng
// @route   PUT /api/settings/user
// @access  Private
export const updateUserSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { 
    name, 
    email, 
    profileImage, 
    preferences 
  } = req.body;
  
  const user = await UserModel.findByIdAndUpdate(
    req.user?.id, 
    { 
      name, 
      email, 
      profileImage, 
      preferences 
    }, 
    { 
      new: true, 
      runValidators: true 
    }
  );
  
  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng'));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Lấy API keys
// @route   GET /api/settings/api-keys
// @access  Private
export const getApiKeys = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findById(req.user?.id).select('apiKeys');
  
  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng'));
  }
  
  // Trả về cấu trúc API keys không có giá trị thực
  const redactedApiKeys = user.apiKeys.map(key => ({
    exchange: key.exchange,
    apiKey: key.apiKey ? '********' : '',
    secretKey: key.secretKey ? '********' : ''
  }));
  
  res.status(200).json({
    success: true,
    data: redactedApiKeys
  });
});

// @desc    Cập nhật API keys
// @route   PUT /api/settings/api-keys
// @access  Private
export const updateApiKeys = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { 
    exchange, 
    apiKey, 
    apiSecret 
  } = req.body;
  
  if (!exchange || !apiKey || !apiSecret) {
    return next(new AppError(400, 'Vui lòng cung cấp exchange, API key và Secret key'));
  }
  
  // Tìm user và kiểm tra xem đã có API key cho sàn này chưa
  const user = await UserModel.findById(req.user?.id);
  
  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng'));
  }
  
  // Kiểm tra xem apiKeys có phải là mảng không
  if (!Array.isArray(user.apiKeys)) {
    user.apiKeys = [];
  }
  
  // Tìm xem đã có API key cho sàn này chưa
  const existingKeyIndex = user.apiKeys.findIndex(key => key.exchange === exchange);
  
  if (existingKeyIndex !== -1) {
    // Cập nhật API key hiện có
    user.apiKeys[existingKeyIndex].apiKey = apiKey;
    user.apiKeys[existingKeyIndex].secretKey = apiSecret;
  } else {
    // Thêm API key mới
    user.apiKeys.push({
      exchange,
      apiKey,
      secretKey: apiSecret
    });
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user.apiKeys.map(key => ({
      exchange: key.exchange,
      apiKey: key.apiKey ? '********' : '',
      secretKey: key.secretKey ? '********' : ''
    }))
  });
});

// @desc    Lấy cài đặt thông báo
// @route   GET /api/settings/notifications
// @access  Private
export const getNotificationSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findById(req.user?.id).select('settings.notifications settings.emailAlerts');
  
  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng'));
  }
  
  res.status(200).json({
    success: true,
    data: {
      notifications: user.settings.notifications,
      emailAlerts: user.settings.emailAlerts
    }
  });
});

// @desc    Cập nhật cài đặt thông báo
// @route   PUT /api/settings/notifications
// @access  Private
export const updateNotificationSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { 
    email, 
    sms, 
    push, 
    tradingSignals, 
    accountActivity 
  } = req.body;
  
  const user = await UserModel.findByIdAndUpdate(
    req.user?.id,
    { 
      $set: { 
        'notificationSettings.email': email,
        'notificationSettings.sms': sms,
        'notificationSettings.push': push,
        'notificationSettings.tradingSignals': tradingSignals,
        'notificationSettings.accountActivity': accountActivity
      } 
    },
    { 
      new: true, 
      runValidators: true 
    }
  );
  
  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng'));
  }
  
  res.status(200).json({
    success: true,
    data: {
      notifications: user.settings.notifications,
      emailAlerts: user.settings.emailAlerts
    }
  });
});

// @desc    Cập nhật cài đặt bảo mật
// @route   PUT /api/settings/security
// @access  Private
export const updateSecuritySettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { 
    twoFactorEnabled, 
    loginNotifications
  } = req.body;
  
  const user = await UserModel.findByIdAndUpdate(
    req.user?.id,
    { 
      $set: { 
        'securitySettings.twoFactorEnabled': twoFactorEnabled,
        'securitySettings.loginNotifications': loginNotifications
      } 
    },
    { 
      new: true, 
      runValidators: true 
    }
  );
  
  if (!user) {
    return next(new AppError(404, 'Không tìm thấy người dùng'));
  }
  
  res.status(200).json({
    success: true,
    data: user.securitySettings
  });
}); 