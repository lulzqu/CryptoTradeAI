import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { config } from '../config';

// Middleware nén response
export const compressResponse = () => {
  return compression({
    // Chỉ nén khi kích thước response lớn hơn 1KB
    threshold: 1024,
    // Mức độ nén (0-9)
    level: 6,
    // Bộ lọc các loại response cần nén
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false;
      }

      return compression.filter(req, res);
    }
  });
};

// Middleware kiểm tra và xử lý nén
export const handleCompression = (req: Request, res: Response, next: NextFunction) => {
  // Kiểm tra client có hỗ trợ nén không
  const acceptEncoding = req.headers['accept-encoding'];
  if (!acceptEncoding) {
    return next();
  }

  // Kiểm tra loại nén được hỗ trợ
  if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
  } else if (acceptEncoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
  } else if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
  }

  next();
}; 