import { BaseError } from './base.error';

export class BadRequestError extends BaseError {
  constructor(message: string = 'Yêu cầu không hợp lệ') {
    super(message, 400);
  }
} 