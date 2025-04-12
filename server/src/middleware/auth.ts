import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Middleware xác thực người dùng
 * Kiểm tra token JWT trong header Authorization
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Lấy token từ header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Cần đăng nhập để truy cập' });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken;
    
    // Gán thông tin user vào request
    (req as any).userId = decoded.userId;
    
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * Phải sử dụng sau middleware authenticate
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Giả sử có một User model và role được lưu trong cơ sở dữ liệu
  // Đoạn code dưới đây cần được thay thế bằng logic thực tế
  
  // const userId = (req as any).userId;
  // User.findById(userId).then(user => {
  //   if (user && user.role === 'admin') {
  //     next();
  //   } else {
  //     res.status(403).json({ message: 'Không có quyền truy cập' });
  //   }
  // }).catch(err => {
  //   res.status(500).json({ message: 'Lỗi server' });
  // });
  
  // Tạm thời bỏ qua kiểm tra admin
  next();
}; 