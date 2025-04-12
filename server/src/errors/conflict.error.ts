import { BaseError } from './base.error';

export class ConflictError extends BaseError {
  constructor(message: string = 'Xung đột dữ liệu') {
    super(message, 409);
  }
} 