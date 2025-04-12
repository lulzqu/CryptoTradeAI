import { BaseError } from './base.error';

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Bị từ chối truy cập') {
    super(message, 403);
  }
} 