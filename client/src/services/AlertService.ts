import axios from 'axios';
import { API_URL } from '../config/constants';

export interface Alert {
  _id?: string;
  user: string;
  name: string;
  type: 'price' | 'indicator' | 'risk' | 'system' | 'custom';
  symbol: string;
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals' | 'custom';
  value: number;
  indicator?: string;
  indicatorParams?: Record<string, any>;
  status: 'active' | 'triggered' | 'disabled' | 'expired';
  frequency: 'once' | 'always';
  triggerCount: number;
  lastTriggered?: Date;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notificationChannels: ('app' | 'email' | 'sms' | 'webhook')[];
  webhookUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AlertQueryParams {
  status?: string;
  type?: string;
  symbol?: string;
  page?: number;
  limit?: number;
}

class AlertService {
  private baseUrl = `${API_URL}/v1/alerts`;

  /**
   * Lấy danh sách alerts
   */
  async getAlerts(params?: AlertQueryParams): Promise<Alert[]> {
    try {
      const response = await axios.get(this.baseUrl, { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy chi tiết alert theo ID
   */
  async getAlertById(alertId: string): Promise<Alert> {
    try {
      const response = await axios.get(`${this.baseUrl}/${alertId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tạo alert mới
   */
  async createAlert(alertData: Omit<Alert, '_id' | 'createdAt' | 'updatedAt' | 'triggerCount' | 'lastTriggered'>): Promise<Alert> {
    try {
      const response = await axios.post(this.baseUrl, alertData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cập nhật alert
   */
  async updateAlert(alertId: string, alertData: Partial<Alert>): Promise<Alert> {
    try {
      const response = await axios.put(`${this.baseUrl}/${alertId}`, alertData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Xóa alert
   */
  async deleteAlert(alertId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/${alertId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Kích hoạt alert thủ công
   */
  async triggerAlert(alertId: string): Promise<Alert> {
    try {
      const response = await axios.post(`${this.baseUrl}/${alertId}/trigger`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tạo mẫu dữ liệu giả cho phát triển
   */
  getMockAlerts(): Alert[] {
    return [
      {
        _id: 'alert1',
        user: 'user123',
        name: 'BTC Price Alert',
        type: 'price',
        symbol: 'BTC/USDT',
        condition: 'above',
        value: 50000,
        status: 'active',
        frequency: 'once',
        triggerCount: 0,
        message: 'BTC has risen above $50,000',
        priority: 'medium',
        notificationChannels: ['app', 'email'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'alert2',
        user: 'user123',
        name: 'ETH RSI Alert',
        type: 'indicator',
        symbol: 'ETH/USDT',
        condition: 'below',
        value: 30,
        indicator: 'RSI',
        indicatorParams: { period: 14 },
        status: 'active',
        frequency: 'always',
        triggerCount: 2,
        lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        message: 'ETH RSI is below 30 - potential buy opportunity',
        priority: 'high',
        notificationChannels: ['app', 'email', 'sms'],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'alert3',
        user: 'user123',
        name: 'Portfolio Drawdown Alert',
        type: 'risk',
        symbol: 'PORTFOLIO',
        condition: 'below',
        value: -15,
        status: 'triggered',
        frequency: 'once',
        triggerCount: 1,
        lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        message: 'Portfolio drawdown has exceeded 15%',
        priority: 'critical',
        notificationChannels: ['app', 'email', 'sms'],
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'alert4',
        user: 'user123',
        name: 'SOL MACD Crossover',
        type: 'indicator',
        symbol: 'SOL/USDT',
        condition: 'crosses_above',
        value: 0,
        indicator: 'MACD',
        indicatorParams: { fast: 12, slow: 26, signal: 9 },
        status: 'active',
        frequency: 'always',
        triggerCount: 0,
        message: 'SOL MACD line crossed above signal line',
        priority: 'medium',
        notificationChannels: ['app'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'alert5',
        user: 'user123',
        name: 'Funding Rate Alert',
        type: 'custom',
        symbol: 'BTC/USDT',
        condition: 'above',
        value: 0.1,
        status: 'disabled',
        frequency: 'always',
        triggerCount: 3,
        lastTriggered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        message: 'BTC funding rate is above 0.1%',
        priority: 'low',
        notificationChannels: ['app'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  /**
   * Xử lý lỗi
   */
  private handleError(error: any): Error {
    console.error('Alert service error:', error);
    
    if (error.response) {
      return new Error(error.response.data.message || 'Error from server');
    } else if (error.request) {
      return new Error('No response received from server');
    } else {
      return new Error(error.message || 'Unknown error occurred');
    }
  }
}

export default new AlertService(); 