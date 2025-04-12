import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';
import { User } from '../models/User';

interface JwtPayload {
  id: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(401, 'Không tìm thấy token xác thực');
    }

    // Verify token
    const decoded = jwt.verify(token, config.app.jwtSecret) as JwtPayload;

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError(401, 'Người dùng không tồn tại');
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Token không hợp lệ'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      next(new AppError(403, 'Không có quyền truy cập'));
    }
    next();
  };
}; 