import { Position, Trade, Order } from '../types/trading';
import { Signal } from '../types/analysis';
import { RiskManagementService } from './riskManagement';
import { MEXCService } from './mexc';
import { logger } from '../utils/logger';
import { SignalType } from '../models/Signal';
import { PositionType, PositionStatus } from '../models/Position';
import { OrderStatus, TradeSide, OrderType, TimeInForce, MarginMode } from '../types/enums';

export class TradingService {
  private static instance: TradingService;
  private riskManagement: RiskManagementService;
  private mexc: MEXCService;

  private constructor() {
    this.riskManagement = RiskManagementService.getInstance();
    this.mexc = MEXCService.getInstance();
  }

  public static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  public async executeSignal(signal: Signal, userId: string): Promise<Trade> {
    try {
      // Kiểm tra rủi ro
      const riskAssessment = await this.riskManagement.assessRisk(signal);
      if (riskAssessment.riskScore > 80) {
        throw new Error(`Giao dịch có rủi ro cao: ${riskAssessment.riskScore}`);
      }

      // Tính toán số lượng
      const quantity = riskAssessment.recommendedPositionSize;

      // Thực hiện giao dịch
      const orderParams: Order = {
        id: '',
        userId,
        symbol: signal.symbol,
        side: signal.type === SignalType.BUY ? TradeSide.BUY : TradeSide.SELL,
        type: OrderType.LIMIT,
        quantity,
        price: signal.entryPrice,
        stopPrice: signal.stopLoss,
        status: OrderStatus.NEW,
        timeInForce: TimeInForce.GTC,
        createdAt: new Date(),
        updatedAt: new Date(),
        filledQuantity: 0,
        remainingQuantity: quantity
      };

      const order = await this.mexc.createOrder(orderParams);

      // Lưu giao dịch
      const position: Position = {
        id: '',
        userId,
        symbol: signal.symbol,
        type: signal.type === SignalType.BUY ? PositionType.LONG : PositionType.SHORT,
        status: PositionStatus.OPEN,
        entryPrice: order.price || signal.entryPrice,
        quantity,
        leverage: 1,
        marginMode: MarginMode.ISOLATED,
        unrealizedPnl: 0,
        realizedPnl: 0,
        liquidationPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        entryTime: new Date(),
        trades: [order.id],
        signalId: signal.id
      };

      await this.savePosition(position);

      return {
        id: order.id,
        userId,
        symbol: signal.symbol,
        side: signal.type === SignalType.BUY ? TradeSide.BUY : TradeSide.SELL,
        quantity,
        price: order.price || signal.entryPrice,
        timestamp: new Date(),
        status: 'COMPLETED',
        fee: 0,
        feeCurrency: 'USDT',
        orderId: order.id,
        positionId: position.id,
        signalId: signal.id
      };
    } catch (error) {
      logger.error('Failed to execute signal:', error);
      throw error;
    }
  }

  public async closePosition(positionId: string, userId: string): Promise<Trade> {
    const position = await this.getPosition(positionId, userId);
    if (!position) {
      throw new Error('Không tìm thấy vị thế');
    }

    if (position.status !== PositionStatus.OPEN) {
      throw new Error('Vị thế đã đóng');
    }

    const trade = await this.mexc.executeTrade({
      symbol: position.symbol,
      side: position.type === PositionType.LONG ? TradeSide.SELL : TradeSide.BUY,
      quantity: position.quantity,
      price: 0 // Market price
    });

    position.status = PositionStatus.CLOSED;
    position.exitPrice = trade.price;
    position.closedAt = new Date();
    position.pnl = this.calculateProfit(position);

    await this.updatePosition(position);

    return trade;
  }

  private async calculateQuantity(signal: Signal): Promise<number> {
    try {
      const accountInfo = await this.mexc.getAccountInfo();
      const balance = accountInfo.reduce((total, b) => total + b.total, 0);
      const riskAmount = balance * 0.01; // 1% rủi ro
      const priceDifference = Math.abs(signal.entryPrice - signal.stopLoss);
      return riskAmount / priceDifference;
    } catch (error) {
      logger.error('Failed to calculate quantity:', error);
      throw error;
    }
  }

  private calculateProfit(position: Position): number {
    if (!position.exitPrice) return 0;
    const priceDifference = position.exitPrice - position.entryPrice;
    return position.type === PositionType.LONG 
      ? priceDifference * position.quantity
      : -priceDifference * position.quantity;
  }

  private async savePosition(position: Position): Promise<void> {
    // TODO: Implement save position to database
  }

  private async getPosition(positionId: string, userId: string): Promise<Position | null> {
    // TODO: Lấy từ database
    return null;
  }

  private async updatePosition(position: Position): Promise<void> {
    // TODO: Cập nhật vào database
  }
} 