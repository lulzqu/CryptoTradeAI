import { BaseError } from './base.error';

export class InternalServerError extends BaseError {
  constructor(message: string = 'Lỗi máy chủ nội bộ') {
    super(message, 500);
  }
} 