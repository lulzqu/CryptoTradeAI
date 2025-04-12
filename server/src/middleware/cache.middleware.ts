import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { config } from '../config';

// Tạo Redis client
const redisClient = createClient({
  url: config.redis.url,
  password: config.redis.password
});

// Kết nối Redis
redisClient.connect().catch(console.error);

// Middleware cache response
export const cacheResponse = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Chỉ cache GET request
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      // Kiểm tra cache
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // Lưu response vào cache
      const originalJson = res.json;
      res.json = function (body) {
        redisClient.setEx(key, duration, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Middleware clear cache
export const clearCache = (pattern: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      next();
    } catch (error) {
      console.error('Clear cache error:', error);
      next();
    }
  };
};

// Middleware cache data
export const cacheData = async (key: string, data: any, duration: number) => {
  try {
    await redisClient.setEx(key, duration, JSON.stringify(data));
  } catch (error) {
    console.error('Cache data error:', error);
  }
};

// Middleware get cached data
export const getCachedData = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Get cached data error:', error);
    return null;
  }
}; 