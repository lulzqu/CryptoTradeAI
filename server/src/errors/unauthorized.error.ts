import { BaseError } from './base.error';

export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Không có quyền truy cập') {
    super(message, 401);
  }
} 