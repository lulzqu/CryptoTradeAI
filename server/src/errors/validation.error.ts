import { BaseError } from './base.error';

export class ValidationError extends BaseError {
  constructor(message: string = 'Dữ liệu đầu vào không hợp lệ', errors?: string[]) {
    super(message, 400, errors);
  }
} 