import { Request, Response, NextFunction } from 'express';

// Async handler wrapper to avoid try-catch in each controller
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}; 