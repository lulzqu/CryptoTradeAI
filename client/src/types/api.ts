export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'arraybuffer' | 'text';
} 