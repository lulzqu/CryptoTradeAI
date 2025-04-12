import axios from 'axios';
import { API_URL } from '../config/constants';

export interface Order {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stopLimit' | 'stopMarket';
  side: 'buy' | 'sell';
  price?: number;
  stopPrice?: number;
  quantity: number;
  status: 'open' | 'filled' | 'canceled' | 'rejected' | 'partial';
  filledQuantity?: number;
  filledPrice?: number;
  totalCost?: number;
  createdAt: string;
  updatedAt: string;
  exchange: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'spot' | 'margin' | 'futures';
  side: 'long' | 'short';
  entryPrice: number;
  markPrice: number;
  quantity: number;
  leverage?: number;
  liquidationPrice?: number;
  margin?: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  createdAt: string;
  updatedAt: string;
  exchange: string;
}

export interface MarketData {
  symbol: string;
  lastPrice: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  bidPrice: number;
  askPrice: number;
  timestamp: string;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][]; // [price, quantity]
  asks: [number, number][]; // [price, quantity]
  timestamp: string;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  totalCost: number;
  timestamp: string;
  orderId: string;
  fee?: number;
  feeCurrency?: string;
  exchange: string;
}

class TradingService {
  private baseUrl = `${API_URL}/trading`;

  // Orders
  async createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const response = await axios.post(`${this.baseUrl}/orders`, orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrders(params?: { symbol?: string; status?: string; limit?: number }): Promise<Order[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/orders`, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await axios.get(`${this.baseUrl}/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order:', error.response?.data || error.message);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error canceling order:', error.response?.data || error.message);
      throw error;
    }
  }

  // Positions
  async getPositions(params?: { symbol?: string; exchange?: string }): Promise<Position[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/positions`, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching positions:', error.response?.data || error.message);
      throw error;
    }
  }

  async closePosition(positionId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/positions/${positionId}/close`);
      return response.data;
    } catch (error: any) {
      console.error('Error closing position:', error.response?.data || error.message);
      throw error;
    }
  }

  async updatePosition(positionId: string, updates: { stopLoss?: number; takeProfit?: number }): Promise<Position> {
    try {
      const response = await axios.patch(`${this.baseUrl}/positions/${positionId}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('Error updating position:', error.response?.data || error.message);
      throw error;
    }
  }

  // Market Data
  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      const response = await axios.get(`${this.baseUrl}/market/${symbol}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching market data:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrderBook(symbol: string, limit?: number): Promise<OrderBook> {
    try {
      const response = await axios.get(`${this.baseUrl}/orderbook/${symbol}`, { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order book:', error.response?.data || error.message);
      throw error;
    }
  }

  async getRecentTrades(symbol: string, limit?: number): Promise<Trade[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/trades/${symbol}`, { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching recent trades:', error.response?.data || error.message);
      throw error;
    }
  }

  // Historical data
  async getHistoricalTrades(params: { 
    symbol: string; 
    startTime?: string; 
    endTime?: string; 
    limit?: number 
  }): Promise<Trade[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/history/trades`, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching historical trades:', error.response?.data || error.message);
      throw error;
    }
  }

  async getKlines(params: { 
    symbol: string; 
    interval: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w'; 
    startTime?: string; 
    endTime?: string; 
    limit?: number 
  }): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/klines`, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching klines:', error.response?.data || error.message);
      throw error;
    }
  }

  // Mock data for development without backend
  getMockOrders(): Order[] {
    return [
      {
        id: '1',
        symbol: 'BTC/USDT',
        type: 'limit',
        side: 'buy',
        price: 50000,
        quantity: 0.1,
        status: 'open',
        filledQuantity: 0,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        exchange: 'binance',
      },
      {
        id: '2',
        symbol: 'ETH/USDT',
        type: 'market',
        side: 'sell',
        quantity: 1.5,
        status: 'filled',
        filledQuantity: 1.5,
        filledPrice: 3000,
        totalCost: 4500,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86000000).toISOString(),
        exchange: 'binance',
      },
      {
        id: '3',
        symbol: 'SOL/USDT',
        type: 'stopLimit',
        side: 'sell',
        price: 95,
        stopPrice: 100,
        quantity: 10,
        status: 'open',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date().toISOString(),
        exchange: 'binance',
      },
    ];
  }

  getMockPositions(): Position[] {
    return [
      {
        id: '1',
        symbol: 'BTC/USDT',
        type: 'spot',
        side: 'long',
        entryPrice: 48000,
        markPrice: 50000,
        quantity: 0.5,
        unrealizedPnl: 1000,
        unrealizedPnlPercent: 4.17,
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        updatedAt: new Date().toISOString(),
        exchange: 'binance',
      },
      {
        id: '2',
        symbol: 'ETH/USDT',
        type: 'futures',
        side: 'short',
        entryPrice: 3200,
        markPrice: 3000,
        quantity: 5,
        leverage: 10,
        liquidationPrice: 3550,
        margin: 1600,
        unrealizedPnl: 1000,
        unrealizedPnlPercent: 6.25,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date().toISOString(),
        exchange: 'binance',
      },
      {
        id: '3',
        symbol: 'SOL/USDT',
        type: 'margin',
        side: 'long',
        entryPrice: 90,
        markPrice: 105,
        quantity: 20,
        leverage: 3,
        liquidationPrice: 70,
        margin: 600,
        unrealizedPnl: 300,
        unrealizedPnlPercent: 16.67,
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date().toISOString(),
        exchange: 'binance',
      },
    ];
  }

  getMockMarketData(symbol = 'BTC/USDT'): MarketData {
    const mockData: Record<string, MarketData> = {
      'BTC/USDT': {
        symbol: 'BTC/USDT',
        lastPrice: 50000,
        change24h: 1500,
        changePercent24h: 3.1,
        high24h: 51200,
        low24h: 48500,
        volume24h: 5000000000,
        bidPrice: 49995,
        askPrice: 50005,
        timestamp: new Date().toISOString(),
      },
      'ETH/USDT': {
        symbol: 'ETH/USDT',
        lastPrice: 3000,
        change24h: -100,
        changePercent24h: -3.23,
        high24h: 3150,
        low24h: 2950,
        volume24h: 2000000000,
        bidPrice: 2999,
        askPrice: 3001,
        timestamp: new Date().toISOString(),
      },
    };

    return mockData[symbol] || mockData['BTC/USDT'];
  }

  getMockOrderBook(symbol = 'BTC/USDT'): OrderBook {
    // Create mock order book data
    const bids: [number, number][] = [];
    const asks: [number, number][] = [];
    
    const basePrice = symbol === 'BTC/USDT' ? 50000 : 3000;
    
    // Generate 20 bids (lower than base price)
    for (let i = 0; i < 20; i++) {
      const price = basePrice - (i * 10) - Math.random() * 5;
      const quantity = 0.1 + Math.random() * 2;
      bids.push([price, quantity]);
    }
    
    // Generate 20 asks (higher than base price)
    for (let i = 0; i < 20; i++) {
      const price = basePrice + (i * 10) + Math.random() * 5;
      const quantity = 0.1 + Math.random() * 2;
      asks.push([price, quantity]);
    }
    
    return {
      symbol,
      bids,
      asks,
      timestamp: new Date().toISOString(),
    };
  }

  getMockTrades(symbol = 'BTC/USDT'): Trade[] {
    const basePrice = symbol === 'BTC/USDT' ? 50000 : 3000;
    const trades: Trade[] = [];
    
    // Generate 30 mock trades
    for (let i = 0; i < 30; i++) {
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const price = basePrice + (Math.random() * 200 - 100);
      const quantity = 0.01 + Math.random() * 0.5;
      
      trades.push({
        id: `mock-${i}`,
        symbol,
        side,
        price,
        quantity,
        totalCost: price * quantity,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        orderId: `order-${i}`,
        fee: price * quantity * 0.001,
        feeCurrency: symbol.split('/')[1],
        exchange: 'binance',
      });
    }
    
    return trades;
  }
}

export default new TradingService(); 