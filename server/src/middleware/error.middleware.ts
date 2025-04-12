import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/validation.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request.error';
import { InternalServerError } from '../errors/internal-server.error';

// Middleware xử lý lỗi
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  // Xử lý lỗi validation
  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: 'Dữ liệu không hợp lệ',
      errors: error.errors
    });
  }

  // Xử lý lỗi không tìm thấy
  if (error instanceof NotFoundError) {
    return res.status(404).json({
      status: 'error',
      message: error.message || 'Không tìm thấy tài nguyên'
    });
  }

  // Xử lý lỗi không được phép
  if (error instanceof UnauthorizedError) {
    return res.status(401).json({
      status: 'error',
      message: error.message || 'Không được phép truy cập'
    });
  }

  // Xử lý lỗi bị từ chối
  if (error instanceof ForbiddenError) {
    return res.status(403).json({
      status: 'error',
      message: error.message || 'Bị từ chối truy cập'
    });
  }

  // Xử lý lỗi xung đột
  if (error instanceof ConflictError) {
    return res.status(409).json({
      status: 'error',
      message: error.message || 'Xung đột dữ liệu'
    });
  }

  // Xử lý lỗi yêu cầu không hợp lệ
  if (error instanceof BadRequestError) {
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Yêu cầu không hợp lệ'
    });
  }

  // Xử lý lỗi server
  if (error instanceof InternalServerError) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi máy chủ nội bộ'
    });
  }

  // Xử lý lỗi không xác định
  return res.status(500).json({
    status: 'error',
    message: 'Đã xảy ra lỗi không xác định'
  });
};

// Middleware xử lý lỗi 404
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Không tìm thấy đường dẫn'
  });
};

// Middleware xử lý lỗi async/await
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 