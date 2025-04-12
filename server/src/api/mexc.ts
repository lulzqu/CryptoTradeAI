import axios from 'axios';
import crypto from 'crypto';
import querystring from 'querystring';
import { MEXC_API_KEY, MEXC_API_SECRET, MEXC_BASE_URL } from '../config';

/**
 * Class quản lý kết nối và giao tiếp với MEXC API
 */
export class MexcApi {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(
    apiKey = MEXC_API_KEY,
    apiSecret = MEXC_API_SECRET,
    baseUrl = MEXC_BASE_URL
  ) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl;
  }

  /**
   * Tạo chữ ký cho các request yêu cầu xác thực
   * @param params - Các tham số của request
   * @param method - Phương thức HTTP
   * @returns Chữ ký
   */
  private generateSignature(
    params: Record<string, any>,
    method: string,
    timestamp: number
  ): string {
    const queryString =
      method === 'GET'
        ? querystring.stringify(params)
        : JSON.stringify(params);

    const signString = `${timestamp}${this.apiKey}${queryString}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(signString)
      .digest('hex');
  }

  /**
   * Gửi request công khai (không yêu cầu xác thực)
   * @param endpoint - Endpoint API
   * @param params - Các tham số của request
   * @returns Kết quả từ API
   */
  public async sendPublicRequest(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `MEXC API Error: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
      }
      throw error;
    }
  }

  /**
   * Gửi request yêu cầu xác thực
   * @param endpoint - Endpoint API
   * @param params - Các tham số của request
   * @param method - Phương thức HTTP
   * @returns Kết quả từ API
   */
  public async sendSignedRequest(
    endpoint: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' | 'DELETE' = 'GET'
  ): Promise<any> {
    try {
      const timestamp = Date.now();
      const signature = this.generateSignature(params, method, timestamp);

      const headers = {
        'Content-Type': 'application/json',
        'ApiKey': this.apiKey,
        'Request-Time': timestamp.toString(),
        'Signature': signature,
      };

      let response;
      const url = `${this.baseUrl}${endpoint}`;

      if (method === 'GET') {
        response = await axios.get(url, {
          params,
          headers,
        });
      } else if (method === 'POST') {
        response = await axios.post(url, params, { headers });
      } else if (method === 'DELETE') {
        response = await axios.delete(url, {
          data: params,
          headers,
        });
      }

      return response?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `MEXC API Error: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
      }
      throw error;
    }
  }

  /**
   * Lấy thông tin tài khoản
   */
  public async getAccountInfo(): Promise<any> {
    return this.sendSignedRequest('/api/v3/account', {});
  }

  /**
   * Lấy thông tin về ví
   */
  public async getWalletBalance(): Promise<any> {
    return this.sendSignedRequest('/api/v3/capital/config/getall', {});
  }

  /**
   * Lấy danh sách các cặp giao dịch
   */
  public async getExchangeInfo(): Promise<any> {
    return this.sendPublicRequest('/api/v3/exchangeInfo');
  }

  /**
   * Lấy thông tin về một cặp giao dịch cụ thể
   * @param symbol - Cặp giao dịch
   */
  public async getSymbolInfo(symbol: string): Promise<any> {
    const exchangeInfo = await this.getExchangeInfo();
    return exchangeInfo.symbols.find(
      (s: any) => s.symbol === symbol.toUpperCase()
    );
  }

  /**
   * Lấy dữ liệu thị trường cho một cặp giao dịch
   * @param symbol - Cặp giao dịch
   */
  public async getTickerPrice(symbol?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (symbol) {
      params.symbol = symbol.toUpperCase();
    }
    return this.sendPublicRequest('/api/v3/ticker/price', params);
  }

  /**
   * Lấy dữ liệu 24h cho một cặp giao dịch
   * @param symbol - Cặp giao dịch
   */
  public async getTicker24hr(symbol?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (symbol) {
      params.symbol = symbol.toUpperCase();
    }
    return this.sendPublicRequest('/api/v3/ticker/24hr', params);
  }

  /**
   * Lấy dữ liệu sổ lệnh
   * @param symbol - Cặp giao dịch
   * @param limit - Số lượng lệnh
   */
  public async getOrderBook(symbol: string, limit = 100): Promise<any> {
    return this.sendPublicRequest('/api/v3/depth', {
      symbol: symbol.toUpperCase(),
      limit,
    });
  }

  /**
   * Lấy dữ liệu nến (OHLCV)
   * @param symbol - Cặp giao dịch
   * @param interval - Khoảng thời gian
   * @param limit - Số lượng nến
   * @param startTime - Thời gian bắt đầu
   * @param endTime - Thời gian kết thúc
   */
  public async getKlines(
    symbol: string,
    interval = '1h',
    limit = 500,
    startTime?: number,
    endTime?: number
  ): Promise<any> {
    const params: Record<string, any> = {
      symbol: symbol.toUpperCase(),
      interval,
      limit,
    };

    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;

    return this.sendPublicRequest('/api/v3/klines', params);
  }

  /**
   * Lấy thông tin giao dịch gần đây
   * @param symbol - Cặp giao dịch
   * @param limit - Số lượng giao dịch
   */
  public async getTrades(symbol: string, limit = 500): Promise<any> {
    return this.sendPublicRequest('/api/v3/trades', {
      symbol: symbol.toUpperCase(),
      limit,
    });
  }

  /**
   * Tạo lệnh mới
   * @param symbol - Cặp giao dịch
   * @param side - Bên (BUY/SELL)
   * @param type - Loại lệnh
   * @param quantity - Số lượng
   * @param price - Giá (chỉ cần cho limit orders)
   * @param options - Các tùy chọn khác
   */
  public async createOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'LIMIT' | 'MARKET',
    quantity: number,
    price?: number,
    options: Record<string, any> = {}
  ): Promise<any> {
    const params: Record<string, any> = {
      symbol: symbol.toUpperCase(),
      side,
      type,
      quantity,
      ...options,
    };

    if (type === 'LIMIT' && price) {
      params.price = price;
      params.timeInForce = params.timeInForce || 'GTC';
    }

    return this.sendSignedRequest('/api/v3/order', params, 'POST');
  }

  /**
   * Kiểm tra trạng thái lệnh
   * @param symbol - Cặp giao dịch
   * @param orderId - ID lệnh
   */
  public async getOrder(symbol: string, orderId: number): Promise<any> {
    return this.sendSignedRequest('/api/v3/order', {
      symbol: symbol.toUpperCase(),
      orderId,
    });
  }

  /**
   * Hủy lệnh
   * @param symbol - Cặp giao dịch
   * @param orderId - ID lệnh
   */
  public async cancelOrder(symbol: string, orderId: number): Promise<any> {
    return this.sendSignedRequest(
      '/api/v3/order',
      {
        symbol: symbol.toUpperCase(),
        orderId,
      },
      'DELETE'
    );
  }

  /**
   * Lấy danh sách lệnh đang mở
   * @param symbol - Cặp giao dịch
   */
  public async getOpenOrders(symbol?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (symbol) {
      params.symbol = symbol.toUpperCase();
    }
    return this.sendSignedRequest('/api/v3/openOrders', params);
  }

  /**
   * Lấy lịch sử giao dịch
   * @param symbol - Cặp giao dịch
   * @param limit - Số lượng giao dịch
   */
  public async getMyTrades(symbol: string, limit = 500): Promise<any> {
    return this.sendSignedRequest('/api/v3/myTrades', {
      symbol: symbol.toUpperCase(),
      limit,
    });
  }

  /**
   * Tạo lệnh futures
   * @param symbol - Cặp giao dịch
   * @param side - Bên (BUY/SELL)
   * @param quantity - Số lượng
   * @param leverage - Đòn bẩy
   * @param price - Giá (chỉ cần cho limit orders)
   * @param stopPrice - Giá stop (chỉ cần cho stop orders)
   * @param options - Các tùy chọn khác
   */
  public async createFuturesOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    positionSide: 'LONG' | 'SHORT' | 'BOTH',
    quantity: number,
    leverage: number,
    price?: number,
    stopPrice?: number,
    options: Record<string, any> = {}
  ): Promise<any> {
    // Trước tiên, thiết lập đòn bẩy
    await this.setLeverage(symbol, leverage);

    const params: Record<string, any> = {
      symbol: symbol.toUpperCase(),
      side,
      positionSide,
      quantity,
      ...options,
    };

    if (price) {
      params.price = price;
      params.type = 'LIMIT';
      params.timeInForce = params.timeInForce || 'GTC';
    } else {
      params.type = 'MARKET';
    }

    if (stopPrice) {
      params.stopPrice = stopPrice;
      params.type = params.price ? 'STOP' : 'STOP_MARKET';
    }

    return this.sendSignedRequest('/fapi/v1/order', params, 'POST');
  }

  /**
   * Thiết lập đòn bẩy
   * @param symbol - Cặp giao dịch
   * @param leverage - Đòn bẩy
   */
  public async setLeverage(symbol: string, leverage: number): Promise<any> {
    return this.sendSignedRequest(
      '/fapi/v1/leverage',
      {
        symbol: symbol.toUpperCase(),
        leverage,
      },
      'POST'
    );
  }

  /**
   * Lấy thông tin vị thế futures
   * @param symbol - Cặp giao dịch
   */
  public async getFuturesPositionInfo(symbol?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (symbol) {
      params.symbol = symbol.toUpperCase();
    }
    return this.sendSignedRequest('/fapi/v2/positionRisk', params);
  }

  /**
   * Lấy funding rate hiện tại
   * @param symbol - Cặp giao dịch
   */
  public async getFundingRate(symbol?: string): Promise<any> {
    const params: Record<string, any> = {};
    if (symbol) {
      params.symbol = symbol.toUpperCase();
    }
    return this.sendPublicRequest('/fapi/v1/premiumIndex', params);
  }

  /**
   * Lấy lịch sử funding rate
   * @param symbol - Cặp giao dịch
   * @param limit - Số lượng kết quả
   * @param startTime - Thời gian bắt đầu
   * @param endTime - Thời gian kết thúc
   */
  public async getFundingRateHistory(
    symbol?: string,
    limit = 100,
    startTime?: number,
    endTime?: number
  ): Promise<any> {
    const params: Record<string, any> = { limit };
    if (symbol) params.symbol = symbol.toUpperCase();
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;

    return this.sendPublicRequest('/fapi/v1/fundingRate', params);
  }
}

// Xuất instance của MexcApi để sử dụng trong ứng dụng
export default new MexcApi(); 