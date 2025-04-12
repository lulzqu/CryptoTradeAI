import { Position, IPosition, PositionStatus, PositionType } from '../models/Position';
import { Signal, ISignal, SignalType } from '../models/Signal';
import { User } from '../models/User';
import { TradingSocket } from '../socket/trading.socket';
import { Order, IOrder } from '../models/order.model';
import { Trade, ITrade } from '../models/trade.model';
import { Strategy } from '../models/strategy.model';
import { Exchange } from '../models/exchange.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { RiskManagementService } from './riskManagement';
import { MEXCService } from './mexc';
import { logger } from '../utils/logger';
import { Balance } from '../types/trading';

export class TradingService {
  private static instance: TradingService;
  private tradingSocket: TradingSocket;
  private riskManagement: RiskManagementService;
  private mexc: MEXCService;

  private constructor(tradingSocket?: TradingSocket) {
    if (tradingSocket) {
      this.tradingSocket = tradingSocket;
    }
    this.riskManagement = RiskManagementService.getInstance();
    this.mexc = MEXCService.getInstance();
  }

  public static getInstance(tradingSocket?: TradingSocket): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService(tradingSocket);
    }
    return TradingService.instance;
  }

  async createPosition(positionData: any): Promise<Position> {
    try {
      const position = new Position(positionData);
      await position.save();

      if (this.tradingSocket) {
        this.tradingSocket.broadcastPositionUpdate(position.userId.toString(), position);
      }

      return position;
    } catch (error) {
      throw new Error('Failed to create position');
    }
  }

  async updatePosition(positionData: any): Promise<Position> {
    try {
      const position = await Position.findByIdAndUpdate(
        positionData._id,
        positionData,
        { new: true }
      );

      if (!position) {
        throw new Error('Position not found');
      }

      if (this.tradingSocket) {
        this.tradingSocket.broadcastPositionUpdate(position.userId.toString(), position);
      }

      return position;
    } catch (error) {
      throw new Error('Failed to update position');
    }
  }

  async closePosition(positionId: string, exitPrice: number): Promise<IPosition> {
    try {
      const position = await Position.findById(positionId);
      if (!position) {
        throw new NotFoundError('Không tìm thấy vị thế');
      }

      position.exitPrice = exitPrice;
      position.status = PositionStatus.CLOSED;
      position.exitTime = new Date();
      
      // Tính PnL
      const pnl = position.calculateProfitLoss();
      position.realizedPnl = pnl;

      await position.save();

      if (this.tradingSocket) {
        this.tradingSocket.broadcastPositionUpdate(position.user.toString(), position);
      }

      logger.info(`Closed position ${positionId}:`, {
        exitPrice,
        pnl
      });

      return position;
    } catch (error) {
      logger.error('Failed to close position:', error);
      throw error;
    }
  }

  async createSignal(signalData: Partial<ISignal>): Promise<ISignal> {
    try {
      const signal = new Signal(signalData);
      await signal.save();

      if (this.tradingSocket) {
        this.tradingSocket.broadcastSignalUpdate(signal.user?.toString() || '', signal);
      }

      return signal;
    } catch (error) {
      logger.error('Failed to create signal:', error);
      throw new Error('Failed to create signal');
    }
  }

  async getOpenPositions(userId: string): Promise<IPosition[]> {
    try {
      return Position.find({
        user: userId,
        status: PositionStatus.OPEN
      }).populate('signal').exec();
    } catch (error) {
      logger.error('Failed to get open positions:', error);
      throw error;
    }
  }

  async getClosedPositions(userId: string): Promise<Position[]> {
    try {
      return await Position.find({
        userId,
        status: 'closed'
      }).sort({ closedAt: -1 });
    } catch (error) {
      throw new Error('Failed to get closed positions');
    }
  }

  async getSignals(userId: string): Promise<Signal[]> {
    try {
      return await Signal.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error('Failed to get signals');
    }
  }

  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    // Validate strategy exists
    if (data.strategy) {
      const strategy = await Strategy.findById(data.strategy);
      if (!strategy) {
        throw new NotFoundError('Strategy not found');
      }
    }

    // Validate exchange exists
    const exchange = await Exchange.findById(data.exchange);
    if (!exchange) {
      throw new NotFoundError('Exchange not found');
    }

    // Create order
    const order = new Order(data);
    return order.save();
  }

  async getOrderById(id: string): Promise<IOrder> {
    const order = await Order.findById(id)
      .populate('strategy', 'name')
      .populate('trade', 'symbol')
      .exec();
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  }

  async getOrdersByUser(userId: string): Promise<IOrder[]> {
    return Order.find({ user: userId })
      .populate('strategy', 'name')
      .populate('trade', 'symbol')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateOrder(id: string, data: Partial<IOrder>): Promise<IOrder> {
    const order = await Order.findById(id);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Update fields
    Object.assign(order, data);
    return order.save();
  }

  async cancelOrder(id: string): Promise<IOrder> {
    const order = await Order.findById(id);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.status !== 'open') {
      throw new ValidationError('Order is not open');
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    return order.save();
  }

  async createTrade(data: Partial<ITrade>): Promise<ITrade> {
    // Validate strategy exists
    if (data.strategy) {
      const strategy = await Strategy.findById(data.strategy);
      if (!strategy) {
        throw new NotFoundError('Strategy not found');
      }
    }

    // Create trade
    const trade = new Trade(data);
    return trade.save();
  }

  async getTradeById(id: string): Promise<ITrade> {
    const trade = await Trade.findById(id)
      .populate('strategy', 'name')
      .exec();
    
    if (!trade) {
      throw new NotFoundError('Trade not found');
    }

    return trade;
  }

  async getTradesByUser(userId: string): Promise<ITrade[]> {
    return Trade.find({ user: userId })
      .populate('strategy', 'name')
      .sort({ entryTime: -1 })
      .exec();
  }

  async updateTrade(id: string, data: Partial<ITrade>): Promise<ITrade> {
    const trade = await Trade.findById(id);
    
    if (!trade) {
      throw new NotFoundError('Trade not found');
    }

    // Update fields
    Object.assign(trade, data);
    return trade.save();
  }

  async closeTrade(id: string, exitPrice: number): Promise<ITrade> {
    const trade = await Trade.findById(id);
    
    if (!trade) {
      throw new NotFoundError('Trade not found');
    }

    if (trade.status !== 'open') {
      throw new ValidationError('Trade is not open');
    }

    trade.status = 'closed';
    trade.exitPrice = exitPrice;
    trade.exitTime = new Date();
    trade.duration = trade.exitTime.getTime() - trade.entryTime.getTime();
    
    // Calculate PnL
    const priceDiff = trade.side === 'long' 
      ? exitPrice - trade.entryPrice 
      : trade.entryPrice - exitPrice;
    
    trade.pnl = priceDiff * trade.quantity * trade.leverage;
    trade.pnlPercentage = (trade.pnl / (trade.entryPrice * trade.quantity)) * 100;

    return trade.save();
  }

  async getOpenTrades(userId: string): Promise<ITrade[]> {
    return Trade.find({ 
      user: userId,
      status: 'open'
    })
      .populate('strategy', 'name')
      .sort({ entryTime: -1 })
      .exec();
  }

  async getClosedTrades(userId: string): Promise<ITrade[]> {
    return Trade.find({ 
      user: userId,
      status: 'closed'
    })
      .populate('strategy', 'name')
      .sort({ exitTime: -1 })
      .exec();
  }

  async getTradesByStrategy(strategyId: string): Promise<ITrade[]> {
    return Trade.find({ strategy: strategyId })
      .sort({ entryTime: -1 })
      .exec();
  }

  async getTradesBySymbol(userId: string, symbol: string): Promise<ITrade[]> {
    return Trade.find({ 
      user: userId,
      symbol
    })
      .populate('strategy', 'name')
      .sort({ entryTime: -1 })
      .exec();
  }

  async executeSignal(signal: ISignal, userId: string): Promise<ITrade> {
    try {
      // Kiểm tra rủi ro
      const riskAssessment = await this.riskManagement.assessRisk(signal, userId);
      if (riskAssessment.riskScore > 80) {
        throw new Error(`Giao dịch có rủi ro cao: ${riskAssessment.riskScore}`);
      }

      // Tính toán số lượng
      const quantity = riskAssessment.recommendedPositionSize;

      // Thực hiện giao dịch
      const orderParams: Partial<IOrder> = {
        user: userId as any,
        symbol: signal.symbol,
        type: 'limit',
        side: signal.type === SignalType.BUY ? 'buy' : 'sell',
        quantity,
        price: signal.entryPrice,
        exchange: 'MEXC',
        timeInForce: 'GTC',
        metadata: {
          stopLoss: riskAssessment.stopLoss,
          takeProfit: riskAssessment.takeProfit
        }
      };

      const order = await this.mexc.createOrder(orderParams);

      // Tạo trade từ order
      const trade: Partial<ITrade> = {
        user: userId as any,
        strategy: signal.strategy as any,
        symbol: signal.symbol,
        type: signal.type === SignalType.BUY ? 'buy' : 'sell',
        side: signal.type === SignalType.BUY ? 'long' : 'short',
        status: 'open',
        entryPrice: signal.entryPrice,
        quantity,
        leverage: signal.leverage,
        stopLoss: riskAssessment.stopLoss,
        takeProfit: riskAssessment.takeProfit,
        fees: {
          entry: order.fees?.maker + order.fees?.taker || 0
        },
        exchange: 'MEXC',
        orderId: order.id,
        entryTime: new Date()
      };

      const createdTrade = await Trade.create(trade);

      // Lưu vị thế
      const position = await Position.create({
        user: userId,
        symbol: signal.symbol,
        type: signal.type === SignalType.BUY ? PositionType.LONG : PositionType.SHORT,
        entryPrice: signal.entryPrice,
        quantity,
        stopLoss: riskAssessment.stopLoss,
        takeProfit: riskAssessment.takeProfit,
        status: PositionStatus.OPEN,
        signal: signal._id,
        leverage: signal.leverage,
        initialMargin: quantity * signal.entryPrice / signal.leverage,
        entryTime: new Date()
      });

      // Cập nhật thông tin giao dịch
      if (this.tradingSocket) {
        this.tradingSocket.broadcastPositionUpdate(userId, position);
      }

      logger.info(`Created trade for signal ${signal._id}:`, {
        trade: createdTrade._id,
        position: position._id
      });

      return createdTrade;
    } catch (error) {
      logger.error('Failed to execute signal:', error);
      throw error;
    }
  }

  private async calculateQuantity(signal: ISignal, userId: string): Promise<number> {
    try {
      const accountInfo = await this.mexc.getAccountInfo();
      const balance = accountInfo.reduce((total: number, b: Balance) => total + b.total, 0);
      const riskAmount = balance * 0.01; // 1% rủi ro
      const priceDifference = Math.abs(signal.entryPrice - signal.stopLoss);
      return riskAmount / priceDifference;
    } catch (error) {
      logger.error('Failed to calculate quantity:', error);
      throw error;
    }
  }
} 