import axios from 'axios';
import { API_URL } from '../config/constants';

export interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  strategy: string;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  risk?: number;
  timeframe: string;
  status: 'pending' | 'triggered' | 'completed' | 'canceled' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic: boolean;
  exchange: string;
  leverage?: number;
  entryType: 'market' | 'limit';
  tags?: string[];
  performance?: {
    entryTime?: string;
    exitTime?: string;
    entryPrice: number;
    exitPrice?: number;
    profit?: number;
    profitPercent?: number;
    success?: boolean;
  };
}

export interface SignalFilter {
  symbol?: string;
  type?: 'buy' | 'sell';
  status?: string;
  strategy?: string;
  timeframe?: string;
  createdBy?: string;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  exchange?: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'technical' | 'fundamental' | 'sentiment' | 'mixed';
  timeframes: string[];
  assets: string[];
  signals: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  isPublic: boolean;
  rules?: string;
  indicators?: string[];
}

class SignalService {
  private baseUrl = `${API_URL}/signals`;

  // Signals CRUD operations
  async createSignal(signalData: Omit<Signal, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Signal> {
    try {
      const response = await axios.post(this.baseUrl, signalData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating signal:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSignals(filters?: SignalFilter): Promise<Signal[]> {
    try {
      const response = await axios.get(this.baseUrl, { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching signals:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSignal(signalId: string): Promise<Signal> {
    try {
      const response = await axios.get(`${this.baseUrl}/${signalId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching signal:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateSignal(signalId: string, updates: Partial<Signal>): Promise<Signal> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${signalId}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('Error updating signal:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteSignal(signalId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/${signalId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting signal:', error.response?.data || error.message);
      throw error;
    }
  }

  // Signal Actions
  async triggerSignal(signalId: string): Promise<Signal> {
    try {
      const response = await axios.post(`${this.baseUrl}/${signalId}/trigger`);
      return response.data;
    } catch (error: any) {
      console.error('Error triggering signal:', error.response?.data || error.message);
      throw error;
    }
  }

  async completeSignal(signalId: string, performance: Signal['performance']): Promise<Signal> {
    try {
      const response = await axios.post(`${this.baseUrl}/${signalId}/complete`, { performance });
      return response.data;
    } catch (error: any) {
      console.error('Error completing signal:', error.response?.data || error.message);
      throw error;
    }
  }

  async cancelSignal(signalId: string, reason?: string): Promise<Signal> {
    try {
      const response = await axios.post(`${this.baseUrl}/${signalId}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      console.error('Error canceling signal:', error.response?.data || error.message);
      throw error;
    }
  }

  // Strategies
  async getStrategies(): Promise<Strategy[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/strategies`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching strategies:', error.response?.data || error.message);
      throw error;
    }
  }

  async getStrategy(strategyId: string): Promise<Strategy> {
    try {
      const response = await axios.get(`${this.baseUrl}/strategies/${strategyId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching strategy:', error.response?.data || error.message);
      throw error;
    }
  }

  async createStrategy(strategyData: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'signals' | 'successRate'>): Promise<Strategy> {
    try {
      const response = await axios.post(`${this.baseUrl}/strategies`, strategyData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating strategy:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateStrategy(strategyId: string, updates: Partial<Strategy>): Promise<Strategy> {
    try {
      const response = await axios.patch(`${this.baseUrl}/strategies/${strategyId}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('Error updating strategy:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteStrategy(strategyId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/strategies/${strategyId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting strategy:', error.response?.data || error.message);
      throw error;
    }
  }

  // Signal generation
  async generateSignals(params: { strategy: string; symbols?: string[]; timeframe?: string }): Promise<Signal[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/generate`, params);
      return response.data;
    } catch (error: any) {
      console.error('Error generating signals:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSignalStatistics(filters?: SignalFilter): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/statistics`, { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching signal statistics:', error.response?.data || error.message);
      throw error;
    }
  }

  // Mock data for development
  getMockSignals(): Signal[] {
    return [
      {
        id: '1',
        symbol: 'BTC/USDT',
        type: 'buy',
        strategy: 'MA Crossover',
        entryPrice: 50000,
        stopLoss: 48500,
        takeProfit: 53000,
        timeframe: '1h',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        isPublic: true,
        exchange: 'binance',
        entryType: 'limit',
        tags: ['trend', 'breakout'],
      },
      {
        id: '2',
        symbol: 'ETH/USDT',
        type: 'sell',
        strategy: 'RSI Divergence',
        entryPrice: 3000,
        stopLoss: 3150,
        takeProfit: 2700,
        risk: 2,
        timeframe: '4h',
        status: 'triggered',
        notes: 'Bearish divergence confirmed on 4h RSI',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
        createdBy: 'user123',
        isPublic: false,
        exchange: 'binance',
        leverage: 2,
        entryType: 'market',
        tags: ['reversal', 'overbought'],
        performance: {
          entryTime: new Date(Date.now() - 43200000).toISOString(),
          entryPrice: 3010,
        },
      },
      {
        id: '3',
        symbol: 'SOL/USDT',
        type: 'buy',
        strategy: 'Support Bounce',
        entryPrice: 100,
        stopLoss: 95,
        takeProfit: 115,
        risk: 1,
        timeframe: '1d',
        status: 'completed',
        notes: 'Strong support level at $100',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        createdBy: 'system',
        isPublic: true,
        exchange: 'binance',
        entryType: 'limit',
        tags: ['support', 'bounce'],
        performance: {
          entryTime: new Date(Date.now() - 250000000).toISOString(),
          exitTime: new Date(Date.now() - 172800000).toISOString(),
          entryPrice: 101,
          exitPrice: 114,
          profit: 13,
          profitPercent: 12.87,
          success: true,
        },
      },
      {
        id: '4',
        symbol: 'DOGE/USDT',
        type: 'buy',
        strategy: 'Breakout',
        entryPrice: 0.15,
        stopLoss: 0.13,
        takeProfit: 0.2,
        risk: 1.5,
        timeframe: '30m',
        status: 'failed',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        createdBy: 'user456',
        isPublic: true,
        exchange: 'binance',
        entryType: 'market',
        tags: ['breakout', 'momentum'],
        performance: {
          entryTime: new Date(Date.now() - 170000000).toISOString(),
          exitTime: new Date(Date.now() - 86400000).toISOString(),
          entryPrice: 0.15,
          exitPrice: 0.13,
          profit: -0.02,
          profitPercent: -13.33,
          success: false,
        },
      },
      {
        id: '5',
        symbol: 'ADA/USDT',
        type: 'sell',
        strategy: 'Resistance Rejection',
        entryPrice: 0.5,
        stopLoss: 0.55,
        takeProfit: 0.4,
        timeframe: '4h',
        status: 'canceled',
        notes: 'Market conditions changed',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
        createdBy: 'user789',
        isPublic: false,
        exchange: 'okx',
        entryType: 'limit',
        tags: ['resistance', 'rejection'],
      },
    ];
  }

  getMockStrategies(): Strategy[] {
    return [
      {
        id: '1',
        name: 'MA Crossover',
        description: 'Moving average crossover strategy for trend following',
        type: 'technical',
        timeframes: ['1h', '4h', '1d'],
        assets: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
        signals: 125,
        successRate: 65.8,
        createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
        updatedAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        author: 'system',
        isPublic: true,
        indicators: ['SMA', 'EMA', 'Volume'],
        rules: 'Buy when 50 EMA crosses above 200 SMA with increased volume',
      },
      {
        id: '2',
        name: 'RSI Divergence',
        description: 'Identifies price and RSI divergences for reversals',
        type: 'technical',
        timeframes: ['4h', '1d'],
        assets: ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'SOL/USDT'],
        signals: 78,
        successRate: 72.1,
        createdAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
        updatedAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
        author: 'user123',
        isPublic: true,
        indicators: ['RSI', 'Price action'],
        rules: 'Sell when price makes higher high but RSI makes lower high',
      },
      {
        id: '3',
        name: 'Support Bounce',
        description: 'Identifies bounces from key support levels',
        type: 'technical',
        timeframes: ['1d', '1w'],
        assets: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT'],
        signals: 42,
        successRate: 60.3,
        createdAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
        updatedAt: new Date(Date.now() - 4320000000).toISOString(), // 50 days ago
        author: 'system',
        isPublic: true,
        indicators: ['Support/Resistance', 'Volume', 'Stochastic'],
        rules: 'Buy when price touches key support level with oversold stochastic and increased volume',
      },
      {
        id: '4',
        name: 'News Sentiment',
        description: 'Trade based on market sentiment from news and social media',
        type: 'sentiment',
        timeframes: ['1d'],
        assets: ['BTC/USDT', 'ETH/USDT'],
        signals: 35,
        successRate: 54.2,
        createdAt: new Date(Date.now() - 10368000000).toISOString(), // 120 days ago
        updatedAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
        author: 'user456',
        isPublic: false,
        rules: 'Buy when sentiment score exceeds 75, sell when below 30',
      },
      {
        id: '5',
        name: 'Breakout',
        description: 'Identifies breakouts from key price levels or patterns',
        type: 'technical',
        timeframes: ['30m', '1h', '4h'],
        assets: ['BTC/USDT', 'ETH/USDT', 'DOGE/USDT', 'LTC/USDT'],
        signals: 156,
        successRate: 58.9,
        createdAt: new Date(Date.now() - 15552000000).toISOString(), // 180 days ago
        updatedAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
        author: 'system',
        isPublic: true,
        indicators: ['Bollinger Bands', 'ATR', 'Volume'],
        rules: 'Buy when price breaks above upper Bollinger Band with 2x average volume',
      },
    ];
  }

  getMockSignalStatistics() {
    return {
      totalSignals: 436,
      successfulSignals: 262,
      failedSignals: 129,
      pendingSignals: 34,
      canceledSignals: 11,
      successRate: 67.01,
      averageProfit: 8.45,
      averageLoss: -5.32,
      profitFactor: 2.12,
      expectancy: 3.63,
      bestPerformance: {
        symbol: 'SOL/USDT',
        profit: 35.8,
        date: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
      },
      worstPerformance: {
        symbol: 'DOGE/USDT',
        profit: -18.5,
        date: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
      },
      symbolStats: [
        { symbol: 'BTC/USDT', signals: 120, successRate: 70.8 },
        { symbol: 'ETH/USDT', signals: 98, successRate: 68.4 },
        { symbol: 'SOL/USDT', signals: 76, successRate: 72.3 },
        { symbol: 'ADA/USDT', signals: 53, successRate: 62.2 },
        { symbol: 'DOGE/USDT', signals: 42, successRate: 50.0 },
      ],
      timeframeStats: [
        { timeframe: '30m', signals: 45, successRate: 51.1 },
        { timeframe: '1h', signals: 87, successRate: 60.9 },
        { timeframe: '4h', signals: 156, successRate: 69.2 },
        { timeframe: '1d', signals: 128, successRate: 74.2 },
        { timeframe: '1w', signals: 20, successRate: 65.0 },
      ],
      strategyStats: [
        { strategy: 'MA Crossover', signals: 125, successRate: 65.8 },
        { strategy: 'RSI Divergence', signals: 78, successRate: 72.1 },
        { strategy: 'Support Bounce', signals: 42, successRate: 60.3 },
        { strategy: 'News Sentiment', signals: 35, successRate: 54.2 },
        { strategy: 'Breakout', signals: 156, successRate: 58.9 },
      ],
    };
  }
}

export default new SignalService(); 