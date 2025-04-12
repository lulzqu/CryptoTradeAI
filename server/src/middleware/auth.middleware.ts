import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { asyncHandler } from './errorHandler';
import { AppError } from './errorHandler';

// Mở rộng Request interface để thêm user
declare module 'express' {
  interface Request {
    user?: IUser;
  }
}

interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

// Middleware xác thực người dùng
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No authentication token, access denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware phân quyền
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Kiểm tra xem người dùng đã được xác thực chưa
    if (!req.user) {
      return next(new AppError('Vui lòng đăng nhập', 401));
    }

    // Kiểm tra quyền
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền truy cập', 403));
    }

    next();
  };
};

// Middleware kiểm tra token làm mới
export const checkRefreshToken = asyncHandler(async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const refreshToken = req.body.refreshToken || 
    req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError('Refresh token không hợp lệ', 401));
  }

  try {
    // Giải mã refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret'
    ) as { id: string };

    // Tìm người dùng
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('Người dùng không tồn tại', 401));
    }

    // Kiểm tra refresh token có hợp lệ không
    if (user.get('refreshToken') !== refreshToken) {
      return next(new AppError('Refresh token không hợp lệ', 401));
    }

    // Tạo token mới
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Cập nhật refresh token
    user.set('refreshToken', newRefreshToken);
    await user.save();

    // Trả về token mới
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    return next(new AppError('Refresh token không hợp lệ', 401));
  }
});

// Middleware kiểm tra trạng thái 2FA
export const checkTwoFactorAuth = asyncHandler(async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Kiểm tra xem người dùng đã được xác thực 2FA chưa
  if (req.user && req.user.get('securitySettings.twoFactorAuth')) {
    // Kiểm tra session 2FA
    if (!req.session || !req.session.isTwoFactorVerified) {
      return next(new AppError('Yêu cầu xác thực hai yếu tố', 403));
    }
  }

  next();
}); 