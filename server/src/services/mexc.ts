import axios from 'axios';
import { Trade, Order, Balance } from '../types/trading';
import { config } from '../config';

export class MEXCService {
  private static instance: MEXCService;
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  private constructor() {
    this.apiKey = config.mexc.apiKey;
    this.apiSecret = config.mexc.apiSecret;
    this.baseUrl = 'https://api.mexc.com/api/v3';
  }

  public static getInstance(): MEXCService {
    if (!MEXCService.instance) {
      MEXCService.instance = new MEXCService();
    }
    return MEXCService.instance;
  }

  private async signRequest(params: any): Promise<string> {
    // TODO: Implement signing logic
    return '';
  }

  public async getMarketData(symbol: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/ticker/24hr`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get market data: ${error.message}`);
    }
  }

  public async getOrderBook(symbol: string, limit: number = 100): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/depth`, {
        params: { symbol, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get order book: ${error.message}`);
    }
  }

  public async getRecentTrades(symbol: string, limit: number = 500): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/trades`, {
        params: { symbol, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get recent trades: ${error.message}`);
    }
  }

  public async getAccountInfo(): Promise<Balance[]> {
    try {
      const timestamp = Date.now();
      const params = { timestamp };
      const signature = await this.signRequest(params);

      const response = await axios.get(`${this.baseUrl}/account`, {
        headers: {
          'X-MEXC-APIKEY': this.apiKey,
          'X-MEXC-SIGNATURE': signature
        },
        params
      });

      return response.data.balances.map((balance: any) => ({
        asset: balance.asset,
        free: parseFloat(balance.free),
        locked: parseFloat(balance.locked),
        total: parseFloat(balance.free) + parseFloat(balance.locked)
      }));
    } catch (error) {
      throw new Error(`Failed to get account info: ${error.message}`);
    }
  }

  public async createOrder(order: Order): Promise<Order> {
    try {
      const timestamp = Date.now();
      const params = {
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        stopPrice: order.stopPrice,
        timestamp
      };
      const signature = await this.signRequest(params);

      const response = await axios.post(`${this.baseUrl}/order`, params, {
        headers: {
          'X-MEXC-APIKEY': this.apiKey,
          'X-MEXC-SIGNATURE': signature
        }
      });

      return {
        ...order,
        id: response.data.orderId,
        status: response.data.status,
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  public async cancelOrder(orderId: string, symbol: string): Promise<void> {
    try {
      const timestamp = Date.now();
      const params = { orderId, symbol, timestamp };
      const signature = await this.signRequest(params);

      await axios.delete(`${this.baseUrl}/order`, {
        headers: {
          'X-MEXC-APIKEY': this.apiKey,
          'X-MEXC-SIGNATURE': signature
        },
        params
      });
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  public async getOrderStatus(orderId: string, symbol: string): Promise<Order> {
    try {
      const timestamp = Date.now();
      const params = { orderId, symbol, timestamp };
      const signature = await this.signRequest(params);

      const response = await axios.get(`${this.baseUrl}/order`, {
        headers: {
          'X-MEXC-APIKEY': this.apiKey,
          'X-MEXC-SIGNATURE': signature
        },
        params
      });

      return {
        id: response.data.orderId,
        userId: '', // TODO: Get from database
        symbol: response.data.symbol,
        type: response.data.type,
        side: response.data.side,
        quantity: parseFloat(response.data.origQty),
        price: parseFloat(response.data.price),
        status: response.data.status,
        timestamp: new Date(response.data.time)
      };
    } catch (error) {
      throw new Error(`Failed to get order status: ${error.message}`);
    }
  }
} 