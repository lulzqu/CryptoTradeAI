import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/validation.error';
import { AnySchema } from 'yup';

// Middleware kiểm tra dữ liệu đầu vào
export const validateRequest = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Kiểm tra dữ liệu trong body
      if (req.body && Object.keys(req.body).length > 0) {
        await schema.validate(req.body, { abortEarly: false });
      }

      // Kiểm tra dữ liệu trong query
      if (req.query && Object.keys(req.query).length > 0) {
        await schema.validate(req.query, { abortEarly: false });
      }

      // Kiểm tra dữ liệu trong params
      if (req.params && Object.keys(req.params).length > 0) {
        await schema.validate(req.params, { abortEarly: false });
      }

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors
        });
      }

      next(error);
    }
  };
};

// Middleware kiểm tra dữ liệu file upload
export const validateFile = (options: {
  allowedMimeTypes?: string[];
  maxSize?: number;
  required?: boolean;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file && options.required) {
        throw new ValidationError('File là bắt buộc');
      }

      if (req.file) {
        // Kiểm tra kích thước file
        if (options.maxSize && req.file.size > options.maxSize) {
          throw new ValidationError(`File không được vượt quá ${options.maxSize} bytes`);
        }

        // Kiểm tra loại file
        if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(req.file.mimetype)) {
          throw new ValidationError(`Loại file không được hỗ trợ. Chỉ chấp nhận: ${options.allowedMimeTypes.join(', ')}`);
        }
      }

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }

      next(error);
    }
  };
};

// Middleware kiểm tra dữ liệu array
export const validateArray = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.body)) {
        throw new ValidationError('Dữ liệu phải là một mảng');
      }

      for (const item of req.body) {
        await schema.validate(item, { abortEarly: false });
      }

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors
        });
      }

      next(error);
    }
  };
}; 