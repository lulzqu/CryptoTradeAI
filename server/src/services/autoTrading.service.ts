import axios from 'axios';
import { logger } from '../utils/logger';
import { Signal, SignalType, SignalSource } from '../models/Signal';
import { User } from '../models/User';
import { Strategy } from '../models/Strategy';
import { Position } from '../models/Position';
import { 
  DEFAULT_AUTO_TRADING_CONFIG, 
  AutoTradingConfig, 
  ExchangeType,
  TradingStrategy 
} from '../config/autoTrading.config';

// Interface cho thông tin API của sàn
interface ExchangeAPI {
  placeOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT';
    quantity: number;
    price?: number;
    stopPrice?: number;
  }): Promise<any>;

  cancelOrder(params: {
    symbol: string;
    orderId: string;
  }): Promise<any>;

  getAccountBalance(): Promise<number>;
}

// Lớp dịch vụ giao dịch tự động
export class AutoTradingService {
  private config: AutoTradingConfig;
  private exchangeAPIs: Record<ExchangeType, ExchangeAPI>;

  constructor(config?: Partial<AutoTradingConfig>) {
    this.config = { 
      ...DEFAULT_AUTO_TRADING_CONFIG, 
      ...(config || {}) 
    };
    
    // Khởi tạo APIs cho các sàn
    this.exchangeAPIs = {
      [ExchangeType.MEXC]: this.initMEXCAPI(),
      [ExchangeType.BINANCE]: this.initBinanceAPI(),
      [ExchangeType.KUCOIN]: this.initKucoinAPI()
    };
  }

  // Khởi tạo API cho MEXC
  private initMEXCAPI(): ExchangeAPI {
    return {
      async placeOrder(params) {
        try {
          // TODO: Implement MEXC-specific order placement
          logger.info(`MEXC Order: ${JSON.stringify(params)}`);
          return {};
        } catch (error) {
          logger.error(`MEXC Order Error: ${error}`);
          throw error;
        }
      },
      async cancelOrder(params) {
        try {
          // TODO: Implement MEXC-specific order cancellation
          logger.info(`MEXC Cancel Order: ${JSON.stringify(params)}`);
          return {};
        } catch (error) {
          logger.error(`MEXC Cancel Order Error: ${error}`);
          throw error;
        }
      },
      async getAccountBalance() {
        try {
          // TODO: Implement MEXC balance retrieval
          return 10000;
        } catch (error) {
          logger.error(`MEXC Balance Error: ${error}`);
          throw error;
        }
      }
    };
  }

  // Khởi tạo API cho Binance
  private initBinanceAPI(): ExchangeAPI {
    return {
      async placeOrder(params) {
        try {
          // TODO: Implement Binance-specific order placement
          logger.info(`Binance Order: ${JSON.stringify(params)}`);
          return {};
        } catch (error) {
          logger.error(`Binance Order Error: ${error}`);
          throw error;
        }
      },
      async cancelOrder(params) {
        try {
          // TODO: Implement Binance-specific order cancellation
          logger.info(`Binance Cancel Order: ${JSON.stringify(params)}`);
          return {};
        } catch (error) {
          logger.error(`Binance Cancel Order Error: ${error}`);
          throw error;
        }
      },
      async getAccountBalance() {
        try {
          // TODO: Implement Binance balance retrieval
          return 10000;
        } catch (error) {
          logger.error(`Binance Balance Error: ${error}`);
          throw error;
        }
      }
    };
  }

  // Khởi tạo API cho Kucoin
  private initKucoinAPI(): ExchangeAPI {
    return {
      async placeOrder(params) {
        try {
          // TODO: Implement Kucoin-specific order placement
          logger.info(`Kucoin Order: ${JSON.stringify(params)}`);
          return {};
        } catch (error) {
          logger.error(`Kucoin Order Error: ${error}`);
          throw error;
        }
      },
      async cancelOrder(params) {
        try {
          // TODO: Implement Kucoin-specific order cancellation
          logger.info(`Kucoin Cancel Order: ${JSON.stringify(params)}`);
          return {};
        } catch (error) {
          logger.error(`Kucoin Cancel Order Error: ${error}`);
          throw error;
        }
      },
      async getAccountBalance() {
        try {
          // TODO: Implement Kucoin balance retrieval
          return 10000;
        } catch (error) {
          logger.error(`Kucoin Balance Error: ${error}`);
          throw error;
        }
      }
    };
  }

  // Kiểm tra điều kiện giao dịch
  private async validateTradingConditions(
    signal: Signal, 
    user: User
  ): Promise<boolean> {
    try {
      // Kiểm tra cấu hình giao dịch tự động
      if (!this.config.enabled) {
        logger.warn('Giao dịch tự động đã bị tắt');
        return false;
      }

      // Kiểm tra độ tin cậy của tín hiệu
      if (signal.confidence < this.config.signalFilters.minConfidence) {
        logger.warn(`Độ tin cậy tín hiệu không đủ: ${signal.confidence}`);
        return false;
      }

      // Kiểm tra danh sách loại trừ/cho phép
      const { excludedSymbols, includedSymbols } = this.config.signalFilters;
      if (
        (excludedSymbols && excludedSymbols.includes(signal.symbol)) ||
        (includedSymbols && !includedSymbols.includes(signal.symbol))
      ) {
        logger.warn(`Ký hiệu ${signal.symbol} không được phép giao dịch`);
        return false;
      }

      // Kiểm tra số lượng giao dịch đang mở
      const openPositions = await Position.countDocuments({
        user: user._id,
        status: 'OPEN'
      });

      if (openPositions >= this.config.tradeSettings.maxConcurrentTrades) {
        logger.warn('Đã đạt giới hạn số lượng giao dịch đồng thời');
        return false;
      }

      return true;
    } catch (error) {
      logger.error(`Lỗi kiểm tra điều kiện giao dịch: ${error}`);
      return false;
    }
  }

  // Thực hiện giao dịch
  async executeTradeFromSignal(
    signalId: string, 
    userId: string
  ): Promise<Position | null> {
    try {
      // Lấy tín hiệu và người dùng
      const signal = await Signal.findById(signalId);
      const user = await User.findById(userId);

      if (!signal || !user) {
        logger.error('Không tìm thấy tín hiệu hoặc người dùng');
        return null;
      }

      // Kiểm tra điều kiện giao dịch
      const isValidTrade = await this.validateTradingConditions(signal, user);
      if (!isValidTrade) return null;

      // Lấy API của sàn
      const exchangeAPI = this.exchangeAPIs[this.config.exchange];
      if (!exchangeAPI) {
        logger.error(`Không hỗ trợ sàn: ${this.config.exchange}`);
        return null;
      }

      // Tính toán số lượng giao dịch
      const accountBalance = await exchangeAPI.getAccountBalance();
      const tradeAmount = accountBalance * (this.config.tradeSettings.fundAllocation / 100);
      const quantity = tradeAmount / signal.entryPrice;

      // Đặt lệnh
      const orderParams = {
        symbol: signal.symbol,
        side: signal.type === SignalType.BUY ? 'BUY' : 'SELL',
        type: this.config.tradeSettings.orderType === 'market' ? 'MARKET' : 'LIMIT',
        quantity,
        price: signal.type === SignalType.BUY ? signal.entryPrice : undefined,
        stopPrice: signal.stopLoss
      };

      const orderResult = await exchangeAPI.placeOrder(orderParams);

      // Tạo vị thế
      const position = await Position.create({
        user: userId,
        signal: signalId,
        symbol: signal.symbol,
        type: signal.type,
        entryPrice: signal.entryPrice,
        quantity,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        leverage: signal.leverage,
        status: 'OPEN',
        exchange: this.config.exchange,
        strategy: signal.strategy,
        orderDetails: orderResult
      });

      // Ghi log và trả về
      logger.info(`Đã thực hiện giao dịch: ${position._id}`);
      return position;

    } catch (error) {
      logger.error(`Lỗi thực hiện giao dịch: ${error}`);
      return null;
    }
  }

  // Đóng vị thế
  async closePosition(
    positionId: string, 
    reason: string = 'Đóng theo kế hoạch'
  ): Promise<boolean> {
    try {
      const position = await Position.findById(positionId);
      if (!position) {
        logger.error(`Không tìm thấy vị thế: ${positionId}`);
        return false;
      }

      const exchangeAPI = this.exchangeAPIs[position.exchange as ExchangeType];
      if (!exchangeAPI) {
        logger.error(`Không hỗ trợ sàn: ${position.exchange}`);
        return false;
      }

      // Hủy lệnh và đóng vị thế
      await exchangeAPI.cancelOrder({
        symbol: position.symbol,
        orderId: position.orderDetails?.orderId || ''
      });

      position.status = 'CLOSED';
      position.closedAt = new Date();
      position.closingReason = reason;

      await position.save();

      logger.info(`Đã đóng vị thế: ${positionId}`);
      return true;

    } catch (error) {
      logger.error(`Lỗi đóng vị thế: ${error}`);
      return false;
    }
  }

  // Quản lý rủi ro
  async manageRisk(): Promise<void> {
    try {
      // Lấy tất cả vị thế đang mở
      const openPositions = await Position.find({ 
        status: 'OPEN',
        user: this.config.user 
      });

      for (const position of openPositions) {
        // Kiểm tra điều kiện dừng lỗ
        if (position.currentPrice <= position.stopLoss) {
          await this.closePosition(
            position._id.toString(), 
            'Dừng lỗ'
          );
        }

        // Kiểm tra điều kiện chốt lời
        if (position.currentPrice >= position.takeProfit) {
          await this.closePosition(
            position._id.toString(), 
            'Chốt lời'
          );
        }

        // Kiểm tra giới hạn lỗ theo ngày
        const dailyLoss = await this.calculateDailyLoss(position.user);
        if (dailyLoss > this.config.riskManagement.maxLossPerDay) {
          await this.closePosition(
            position._id.toString(), 
            'Vượt giới hạn lỗ hàng ngày'
          );
        }
      }
    } catch (error) {
      logger.error(`Lỗi quản lý rủi ro: ${error}`);
    }
  }

  // Tính tổng lỗ trong ngày
  private async calculateDailyLoss(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyPositions = await Position.find({
      user: userId,
      closedAt: { $gte: today },
      status: 'CLOSED'
    });

    return dailyPositions.reduce((total, pos) => total + pos.totalLoss, 0);
  }
}

// Xuất service để sử dụng
export default new AutoTradingService(); 