import { Exchange, ExchangeFeatures, ExchangeCredentials } from '../types/exchange';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { apiService } from './api';

export interface Exchange {
  id: string;
  name: string;
  type: 'spot' | 'futures' | 'margin';
  url: string;
  logoUrl: string;
  supportedAssets: string[];
  tradingFees: {
    maker: number;
    taker: number;
  };
  withdrawalFees: Record<string, number>;
  depositMethods: string[];
  withdrawalMethods: string[];
  isActive: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  exchangeId: string;
  name: string;
  key: string; // Encrypted
  secret: string; // Encrypted
  passphrase?: string; // Encrypted, if required
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date;
}

export interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
  btcValue: number;
  usdValue: number;
}

export interface ExchangeAccount {
  exchangeId: string;
  apiKeyId: string;
  balances: Balance[];
  totalBtcValue: number;
  totalUsdValue: number;
  timestamp: Date;
}

export interface Market {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  priceDecimalPlaces: number;
  quantityDecimalPlaces: number;
  minOrderSize: number;
  maxOrderSize: number;
  minOrderValue: number;
  status: 'active' | 'inactive' | 'delisted';
  tags: string[];
}

export interface ExchangeSyncStatus {
  exchangeId: string;
  apiKeyId: string;
  lastSyncTime: Date;
  status: 'success' | 'failed' | 'in_progress';
  errorMessage?: string;
}

class ExchangeService {
  // Exchanges
  async getExchanges(): Promise<ApiResponse<Exchange[]>> {
    return apiService.get<Exchange[]>('/exchanges');
  }

  async getExchange(id: string): Promise<ApiResponse<Exchange>> {
    return apiService.get<Exchange>(`/exchanges/${id}`);
  }

  async connectExchange(credentials: ExchangeCredentials): Promise<ApiResponse<Exchange>> {
    return apiService.post<Exchange>('/exchanges/connect', credentials);
  }

  async disconnectExchange(id: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`/exchanges/${id}/disconnect`);
  }

  async updateExchange(id: string, data: Partial<Exchange>): Promise<ApiResponse<Exchange>> {
    return apiService.put<Exchange>(`/exchanges/${id}`, data);
  }

  async deleteExchange(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/exchanges/${id}`);
  }

  // Exchange Features
  async getExchangeFeatures(exchangeId: string): Promise<ApiResponse<ExchangeFeatures>> {
    return apiService.get<ExchangeFeatures>(`/exchanges/${exchangeId}/features`);
  }

  async getSupportedMarkets(exchangeId: string): Promise<ApiResponse<string[]>> {
    return apiService.get<string[]>(`/exchanges/${exchangeId}/markets`);
  }

  async getTradingPairs(exchangeId: string): Promise<ApiResponse<string[]>> {
    return apiService.get<string[]>(`/exchanges/${exchangeId}/pairs`);
  }

  async getAccountInfo(exchangeId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/exchanges/${exchangeId}/account`);
  }

  async getBalance(exchangeId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/exchanges/${exchangeId}/balance`);
  }

  async getOpenOrders(exchangeId: string): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`/exchanges/${exchangeId}/orders/open`);
  }

  async getClosedOrders(exchangeId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<any>>> {
    return apiService.get<PaginatedResponse<any>>(`/exchanges/${exchangeId}/orders/closed`, {
      params: { page, limit }
    });
  }

  async getOrder(exchangeId: string, orderId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/exchanges/${exchangeId}/orders/${orderId}`);
  }

  async createOrder(exchangeId: string, orderData: any): Promise<ApiResponse<any>> {
    return apiService.post<any>(`/exchanges/${exchangeId}/orders`, orderData);
  }

  async cancelOrder(exchangeId: string, orderId: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`/exchanges/${exchangeId}/orders/${orderId}/cancel`);
  }

  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    try {
      const response = await apiService.get<ApiKey[]>('/exchanges/api-keys');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addApiKey(data: {
    exchangeId: string;
    name: string;
    key: string;
    secret: string;
    passphrase?: string;
    permissions: string[];
  }): Promise<ApiKey> {
    try {
      const response = await apiService.post<ApiKey>('/exchanges/api-keys', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateApiKey(apiKeyId: string, updates: {
    name?: string;
    key?: string;
    secret?: string;
    passphrase?: string;
    permissions?: string[];
    isActive?: boolean;
  }): Promise<ApiKey> {
    try {
      const response = await apiService.put<ApiKey>(`/exchanges/api-keys/${apiKeyId}`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteApiKey(apiKeyId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.delete<void>(`/exchanges/api-keys/${apiKeyId}`);
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyApiKey(data: {
    exchangeId: string;
    key: string;
    secret: string;
    passphrase?: string;
  }): Promise<{ valid: boolean; permissions?: string[]; error?: string }> {
    try {
      const response = await apiService.post<{ valid: boolean; permissions?: string[]; error?: string }>('/exchanges/api-keys/verify', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Balances
  async getBalances(exchangeId?: string, apiKeyId?: string): Promise<ExchangeAccount[]> {
    try {
      let url = '/exchanges/balances';
      
      if (exchangeId) {
        url += `?exchangeId=${exchangeId}`;
        if (apiKeyId) {
          url += `&apiKeyId=${apiKeyId}`;
        }
      } else if (apiKeyId) {
        url += `?apiKeyId=${apiKeyId}`;
      }
      
      const response = await apiService.get<ExchangeAccount[]>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async syncBalances(apiKeyId: string): Promise<ExchangeAccount> {
    try {
      const response = await apiService.post<ExchangeAccount>('/exchanges/balances/sync', { apiKeyId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Markets & Symbols
  async getMarkets(exchangeId: string): Promise<Market[]> {
    try {
      const response = await apiService.get<Market[]>(`/exchanges/${exchangeId}/markets`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSymbols(exchangeId: string): Promise<string[]> {
    try {
      const response = await apiService.get<string[]>(`/exchanges/${exchangeId}/symbols`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSyncStatus(): Promise<ExchangeSyncStatus[]> {
    try {
      const response = await apiService.get<ExchangeSyncStatus[]>('/exchanges/sync-status');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mock data for development
  getMockExchanges(): Exchange[] {
    return [
      {
        id: '1',
        name: 'Binance',
        type: 'spot',
        url: 'https://binance.com',
        logoUrl: '/images/exchanges/binance.png',
        supportedAssets: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOT', 'AVAX'],
        tradingFees: {
          maker: 0.075,
          taker: 0.075
        },
        withdrawalFees: {
          'BTC': 0.0005,
          'ETH': 0.005,
          'BNB': 0.01
        },
        depositMethods: ['Crypto', 'Bank Transfer', 'Credit Card'],
        withdrawalMethods: ['Crypto', 'Bank Transfer'],
        isActive: true,
        features: ['Spot Trading', 'Futures Trading', 'Margin Trading', 'Staking'],
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2022-01-01T00:00:00.000Z')
      },
      {
        id: '2',
        name: 'Coinbase',
        type: 'spot',
        url: 'https://coinbase.com',
        logoUrl: '/images/exchanges/coinbase.png',
        supportedAssets: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX'],
        tradingFees: {
          maker: 0.5,
          taker: 0.5
        },
        withdrawalFees: {
          'BTC': 0.0001,
          'ETH': 0.003
        },
        depositMethods: ['Crypto', 'Bank Transfer', 'Credit Card', 'PayPal'],
        withdrawalMethods: ['Crypto', 'Bank Transfer', 'PayPal'],
        isActive: true,
        features: ['Spot Trading', 'Staking'],
        createdAt: new Date('2021-01-02T00:00:00.000Z'),
        updatedAt: new Date('2022-01-02T00:00:00.000Z')
      },
      {
        id: '3',
        name: 'Bybit',
        type: 'futures',
        url: 'https://bybit.com',
        logoUrl: '/images/exchanges/bybit.png',
        supportedAssets: ['BTC', 'ETH', 'SOL', 'ADA'],
        tradingFees: {
          maker: 0.01,
          taker: 0.06
        },
        withdrawalFees: {
          'BTC': 0.0003,
          'ETH': 0.004
        },
        depositMethods: ['Crypto'],
        withdrawalMethods: ['Crypto'],
        isActive: true,
        features: ['Futures Trading', 'Options Trading', 'Copy Trading'],
        createdAt: new Date('2021-01-03T00:00:00.000Z'),
        updatedAt: new Date('2022-01-03T00:00:00.000Z')
      }
    ];
  }

  getMockApiKeys(): ApiKey[] {
    return [
      {
        id: '1',
        userId: 'user123',
        exchangeId: '1',
        name: 'Binance Main',
        key: '****************************************',
        secret: '****************************************',
        permissions: ['read', 'spot'],
        isActive: true,
        createdAt: new Date('2022-06-01T00:00:00.000Z'),
        updatedAt: new Date('2022-06-01T00:00:00.000Z'),
        lastUsed: new Date('2023-05-01T12:30:45.000Z')
      },
      {
        id: '2',
        userId: 'user123',
        exchangeId: '2',
        name: 'Coinbase Trading',
        key: '****************************************',
        secret: '****************************************',
        permissions: ['read', 'spot', 'margin'],
        isActive: true,
        createdAt: new Date('2022-08-15T00:00:00.000Z'),
        updatedAt: new Date('2022-08-15T00:00:00.000Z'),
        lastUsed: new Date('2023-05-10T09:15:30.000Z')
      }
    ];
  }

  getMockBalances(): ExchangeAccount[] {
    return [
      {
        exchangeId: '1',
        apiKeyId: '1',
        balances: [
          {
            asset: 'BTC',
            free: 0.5,
            locked: 0.1,
            total: 0.6,
            btcValue: 0.6,
            usdValue: 18000
          },
          {
            asset: 'ETH',
            free: 5,
            locked: 0,
            total: 5,
            btcValue: 0.3,
            usdValue: 9000
          },
          {
            asset: 'USDT',
            free: 10000,
            locked: 2000,
            total: 12000,
            btcValue: 0.4,
            usdValue: 12000
          }
        ],
        totalBtcValue: 1.3,
        totalUsdValue: 39000,
        timestamp: new Date('2023-05-15T08:30:00.000Z')
      },
      {
        exchangeId: '2',
        apiKeyId: '2',
        balances: [
          {
            asset: 'BTC',
            free: 0.2,
            locked: 0,
            total: 0.2,
            btcValue: 0.2,
            usdValue: 6000
          },
          {
            asset: 'SOL',
            free: 100,
            locked: 0,
            total: 100,
            btcValue: 0.1,
            usdValue: 3000
          },
          {
            asset: 'USD',
            free: 5000,
            locked: 0,
            total: 5000,
            btcValue: 0.17,
            usdValue: 5000
          }
        ],
        totalBtcValue: 0.47,
        totalUsdValue: 14000,
        timestamp: new Date('2023-05-15T08:35:00.000Z')
      }
    ];
  }

  getMockMarkets(exchangeId: string): Market[] {
    if (exchangeId === '1') { // Binance
      return [
        {
          symbol: 'BTC/USDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          priceDecimalPlaces: 2,
          quantityDecimalPlaces: 6,
          minOrderSize: 0.0001,
          maxOrderSize: 100,
          minOrderValue: 10,
          status: 'active',
          tags: ['popular', 'crypto']
        },
        {
          symbol: 'ETH/USDT',
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          priceDecimalPlaces: 2,
          quantityDecimalPlaces: 5,
          minOrderSize: 0.001,
          maxOrderSize: 1000,
          minOrderValue: 10,
          status: 'active',
          tags: ['popular', 'crypto']
        },
        {
          symbol: 'SOL/USDT',
          baseAsset: 'SOL',
          quoteAsset: 'USDT',
          priceDecimalPlaces: 3,
          quantityDecimalPlaces: 2,
          minOrderSize: 0.01,
          maxOrderSize: 10000,
          minOrderValue: 10,
          status: 'active',
          tags: ['crypto']
        }
      ];
    } else if (exchangeId === '2') { // Coinbase
      return [
        {
          symbol: 'BTC/USD',
          baseAsset: 'BTC',
          quoteAsset: 'USD',
          priceDecimalPlaces: 2,
          quantityDecimalPlaces: 8,
          minOrderSize: 0.0001,
          maxOrderSize: 50,
          minOrderValue: 1,
          status: 'active',
          tags: ['popular', 'crypto']
        },
        {
          symbol: 'ETH/USD',
          baseAsset: 'ETH',
          quoteAsset: 'USD',
          priceDecimalPlaces: 2,
          quantityDecimalPlaces: 6,
          minOrderSize: 0.001,
          maxOrderSize: 500,
          minOrderValue: 1,
          status: 'active',
          tags: ['popular', 'crypto']
        }
      ];
    } else if (exchangeId === '3') { // Bybit
      return [
        {
          symbol: 'BTCUSDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          priceDecimalPlaces: 1,
          quantityDecimalPlaces: 3,
          minOrderSize: 0.001,
          maxOrderSize: 200,
          minOrderValue: 10,
          status: 'active',
          tags: ['futures', 'popular']
        },
        {
          symbol: 'ETHUSDT',
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          priceDecimalPlaces: 2,
          quantityDecimalPlaces: 2,
          minOrderSize: 0.01,
          maxOrderSize: 2000,
          minOrderValue: 10,
          status: 'active',
          tags: ['futures', 'popular']
        }
      ];
    }
    
    return [];
  }

  private handleError(error: any): Error {
    console.error('Exchange service error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return new Error(error.response.data.message || 'Error from server');
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error(error.message || 'Unknown error occurred');
    }
  }
}

export const exchangeService = new ExchangeService(); 