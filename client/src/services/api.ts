import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Signal, CandlestickPattern, CandlePattern, Strategy, BacktestResult } from '../types';
import { ApiResponse, ApiError, ApiRequestConfig } from '../types/api';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Sử dụng biến môi trường từ process.env
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const WS_URL = process.env.VITE_WS_URL || 'ws://localhost:5000';

console.log('API_URL:', API_URL);
console.log('WS_URL:', WS_URL);
console.log('Environment variables:', process.env);

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status || 500,
      code: error.response?.data?.code,
      details: error.response?.data?.details
    };

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden
      window.location.href = '/forbidden';
    }

    return Promise.reject(apiError);
  }
);

// WebSocket connection
let ws: WebSocket | null = null;

export const connectWebSocket = () => {
  if (!ws) {
    ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      ws = null;
      // Try to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }
  return ws;
};

export const sendWebSocketMessage = (message: any) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected');
  }
};

export const closeWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

export const apiService = {
  get: async <T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.get<T>(url, config);
    return {
      data: response.data,
      status: response.status
    };
  },
  
  post: async <T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.post<T>(url, data, config);
    return {
      data: response.data,
      status: response.status
    };
  },
  
  put: async <T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.put<T>(url, data, config);
    return {
      data: response.data,
      status: response.status
    };
  },
  
  patch: async <T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.patch<T>(url, data, config);
    return {
      data: response.data,
      status: response.status
    };
  },
  
  delete: async <T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.delete<T>(url, config);
    return {
      data: response.data,
      status: response.status
    };
  }
};

// API services cho từng module
export const authApi = {
  login: (email: string, password: string) => {
    return apiService.post<{ token: string }>('/auth/login', { email, password });
  },
  
  register: (userData: any) => {
    return apiService.post<{ token: string }>('/auth/register', userData);
  },
  
  forgotPassword: (email: string) => {
    return apiService.post('/auth/forgot-password', { email });
  },
  
  resetPassword: (token: string, password: string) => {
    return apiService.post('/auth/reset-password', { token, password });
  },
  
  verifyEmail: (token: string) => {
    return apiService.get(`/auth/verify-email/${token}`);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

export const userApi = {
  getProfile: () => {
    return apiService.get('/user/me');
  },
  
  updateProfile: (userData: any) => {
    return apiService.put('/user/me', userData);
  },
  
  updatePassword: (currentPassword: string, newPassword: string) => {
    return apiService.put('/user/password', { currentPassword, newPassword });
  },
  
  updateSettings: (settings: any) => {
    return apiService.put('/user/settings', settings);
  }
};

export const marketApi = {
  getMarketData: () => {
    return apiService.get('/market/data');
  },
  
  getSymbols: () => {
    return apiService.get<string[]>('/market/symbols');
  },
  
  getTicker: (symbol?: string) => {
    return apiService.get('/market/ticker', { params: { symbol } });
  },
  
  getTicker24h: (symbol?: string) => {
    return apiService.get('/market/ticker24h', { params: { symbol } });
  },
  
  getKlines: (symbol: string, interval: string = '1h', limit: number = 500) => {
    return apiService.get('/market/klines', { 
      params: { symbol, interval, limit } 
    });
  },
  
  getOrderBook: (symbol: string, limit: number = 100) => {
    return apiService.get('/market/orderbook', { 
      params: { symbol, limit } 
    });
  },
  
  getRecentTrades: (symbol: string, limit: number = 50) => {
    return apiService.get('/market/trades', { 
      params: { symbol, limit } 
    });
  },
  
  getFavorites: () => {
    return apiService.get<string[]>('/market/favorites');
  },
};

export const portfolioApi = {
  // Vị thế giao dịch
  getPositions: () => {
    return apiService.get('/portfolio/positions');
  },
  
  getPosition: (id: string) => {
    return apiService.get(`/portfolio/positions/${id}`);
  },
  
  createPosition: (positionData: any) => {
    return apiService.post('/portfolio/positions', positionData);
  },
  
  updatePosition: (id: string, positionData: any) => {
    return apiService.put(`/portfolio/positions/${id}`, positionData);
  },
  
  closePosition: (id: string, closeData: any) => {
    return apiService.put(`/portfolio/positions/${id}/close`, closeData);
  },
  
  // Thống kê
  getStats: () => {
    return apiService.get('/portfolio/stats');
  },
  
  // Lịch sử giao dịch
  getHistory: (limit: number = 50, page: number = 1) => {
    return apiService.get('/portfolio/history', { 
      params: { limit, page } 
    });
  },
  
  // Export dữ liệu
  exportData: (format: 'csv' | 'pdf', dateRange?: any) => {
    return apiService.get('/portfolio/export', { 
      params: { format, ...dateRange },
      responseType: 'blob'
    });
  }
};

export const analysisApi = {
  getTechnicalIndicators: (symbol: string, timeframe: string = '1d') => {
    return apiService.get('/analysis/indicators', { 
      params: { symbol, timeframe } 
    });
  },
  
  getTrendAnalysis: (symbol: string) => {
    return apiService.get('/analysis/trend', { 
      params: { symbol } 
    });
  },
  
  getPredictions: (symbol: string) => {
    return apiService.get('/analysis/predictions', { 
      params: { symbol } 
    });
  },
  
  getPatterns: (symbol: string, timeframe: string = '1d') => {
    return apiService.get<CandlestickPattern[]>('/analysis/patterns', { 
      params: { symbol, timeframe } 
    });
  },
  
  getSignals: (limit: number = 20, page: number = 1) => {
    return apiService.get<Signal[]>('/analysis/signals', { 
      params: { limit, page } 
    });
  },
  
  getSignal: (id: string) => {
    return apiService.get<Signal>(`/analysis/signals/${id}`);
  },
  
  updateSignal: (id: string, data: Partial<Signal>) => {
    return apiService.put<Signal>(`/analysis/signals/${id}`, data);
  },
  
  subscribeSignal: (id: string, subscribed: boolean) => {
    return apiService.post(`/analysis/signals/${id}/subscribe`, { subscribed });
  },
  
  deleteSignal: (id: string) => {
    return apiService.delete(`/analysis/signals/${id}`);
  },
  
  createCustomSignal: (signalData: Partial<Signal>) => {
    return apiService.post<Signal>('/analysis/signals/custom', signalData);
  }
};

export const settingsApi = {
  getSettings: () => {
    return apiService.get('/settings');
  },
  
  updateSettings: (settings: any) => {
    return apiService.put('/settings', settings);
  },
  
  getNotificationSettings: () => {
    return apiService.get('/settings/notifications');
  },
  
  updateNotificationSettings: (settings: any) => {
    return apiService.put('/settings/notifications', settings);
  },
  
  getTradingSettings: () => {
    return apiService.get('/settings/trading');
  },
  
  updateTradingSettings: (settings: any) => {
    return apiService.put('/settings/trading', settings);
  }
};

export const downloadApi = {
  downloadSourceCode: async (): Promise<Blob> => {
    const response = await api.get('/download/source', { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/zip'
      }
    });
    return response.data;
  },

  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/download/report/${reportId}`, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    return response.data;
  },

  downloadData: async (dataType: string, params?: Record<string, any>): Promise<Blob> => {
    const response = await api.get(`/download/data/${dataType}`, { 
      responseType: 'blob',
      params,
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data;
  }
};

// Export tất cả các API service trong một object
const apiServices = {
  apiService,
  authApi,
  userApi,
  marketApi,
  portfolioApi,
  analysisApi,
  settingsApi,
  downloadApi
};

export default apiServices; 