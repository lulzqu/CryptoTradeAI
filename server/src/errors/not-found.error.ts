import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(message: string = 'Không tìm thấy tài nguyên') {
    super(message, 404);
  }
} 