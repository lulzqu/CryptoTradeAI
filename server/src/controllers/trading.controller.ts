import { Request, Response, NextFunction } from 'express';
import TradingService from '../services/trading.service';
import { NotFoundError, ValidationError, BadRequestError } from '../errors';
import { IOrder } from '../models/order.model';
import { IUser } from '../models/user.model';

class TradingController {
  /**
   * Tạo lệnh giao dịch mới
   * @route POST /api/trading/orders
   */
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const orderData = { ...req.body, userId };
      
      const order = await TradingService.createOrder(orderData);
      
      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách lệnh giao dịch của người dùng
   * @route GET /api/trading/orders
   */
  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { status, symbol, type, side, limit = 10, page = 1, sort } = req.query;
      
      const filter: Partial<IOrder> = { userId: userId.toString() };
      
      if (status) {
        filter.status = status as string;
      }
      
      if (symbol) {
        filter.symbol = symbol as string;
      }
      
      if (type) {
        filter.type = type as string;
      }
      
      if (side) {
        filter.side = side as string;
      }
      
      const options = {
        sort: sort ? JSON.parse(sort as string) : { createdAt: -1 },
        limit: Number(limit),
        page: Number(page)
      };
      
      const orders = await TradingService.getOrders(filter, options);
      
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết lệnh giao dịch theo ID
   * @route GET /api/trading/orders/:id
   */
  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const orderId = req.params.id;
      
      const order = await TradingService.getOrderById(orderId);
      
      if (!order) {
        throw new NotFoundError('Không tìm thấy lệnh giao dịch');
      }
      
      // Kiểm tra quyền truy cập
      if (order.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập lệnh giao dịch này'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Hủy lệnh giao dịch
   * @route DELETE /api/trading/orders/:id
   */
  async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const orderId = req.params.id;
      
      const order = await TradingService.getOrderById(orderId);
      
      if (!order) {
        throw new NotFoundError('Không tìm thấy lệnh giao dịch');
      }
      
      // Kiểm tra quyền truy cập
      if (order.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền hủy lệnh giao dịch này'
        });
        return;
      }
      
      // Kiểm tra xem lệnh có thể hủy được không
      if (order.status !== 'open' && order.status !== 'partially_filled') {
        throw new BadRequestError('Không thể hủy lệnh với trạng thái hiện tại');
      }
      
      const cancelledOrder = await TradingService.cancelOrder(orderId);
      
      res.status(200).json({
        success: true,
        data: cancelledOrder
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách giao dịch đã thực hiện của người dùng
   * @route GET /api/trading/trades
   */
  async getTrades(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { symbol, limit = 10, page = 1, startTime, endTime, sort } = req.query;
      
      const filter: any = { userId: userId.toString() };
      
      if (symbol) {
        filter.symbol = symbol as string;
      }
      
      if (startTime) {
        filter.createdAt = { $gte: new Date(startTime as string) };
      }
      
      if (endTime) {
        if (!filter.createdAt) filter.createdAt = {};
        filter.createdAt.$lte = new Date(endTime as string);
      }
      
      const options = {
        sort: sort ? JSON.parse(sort as string) : { createdAt: -1 },
        limit: Number(limit),
        page: Number(page)
      };
      
      const trades = await TradingService.getTrades(filter, options);
      
      res.status(200).json({
        success: true,
        count: trades.length,
        data: trades
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin các vị thế mở của người dùng
   * @route GET /api/trading/positions
   */
  async getPositions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { symbol } = req.query;
      
      const filter: any = { userId: userId.toString() };
      
      if (symbol) {
        filter.symbol = symbol as string;
      }
      
      const positions = await TradingService.getPositions(filter);
      
      res.status(200).json({
        success: true,
        count: positions.length,
        data: positions
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy lịch sử giao dịch trong một khoảng thời gian
   * @route GET /api/trading/history
   */
  async getTradingHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { startTime, endTime, symbols, limit = 100 } = req.query;
      
      if (!startTime || !endTime) {
        throw new ValidationError('Yêu cầu phải có startTime và endTime');
      }
      
      const filters = {
        userId: userId.toString(),
        startTime: new Date(startTime as string),
        endTime: new Date(endTime as string),
        symbols: symbols ? (symbols as string).split(',') : undefined,
        limit: Number(limit)
      };
      
      const history = await TradingService.getTradingHistory(filters);
      
      res.status(200).json({
        success: true,
        count: history.length,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đóng vị thế
   * @route POST /api/trading/positions/:id/close
   */
  async closePosition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const positionId = req.params.id;
      
      const position = await TradingService.getPositionById(positionId);
      
      if (!position) {
        throw new NotFoundError('Không tìm thấy vị thế');
      }
      
      // Kiểm tra quyền truy cập
      if (position.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền đóng vị thế này'
        });
        return;
      }
      
      const closedPosition = await TradingService.closePosition(positionId);
      
      res.status(200).json({
        success: true,
        data: closedPosition
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật stop loss hoặc take profit cho vị thế
   * @route PUT /api/trading/positions/:id
   */
  async updatePosition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const positionId = req.params.id;
      const { stopLoss, takeProfit } = req.body;
      
      const position = await TradingService.getPositionById(positionId);
      
      if (!position) {
        throw new NotFoundError('Không tìm thấy vị thế');
      }
      
      // Kiểm tra quyền truy cập
      if (position.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật vị thế này'
        });
        return;
      }
      
      const updateData: any = {};
      
      if (stopLoss !== undefined) {
        updateData.stopLoss = stopLoss;
      }
      
      if (takeProfit !== undefined) {
        updateData.takeProfit = takeProfit;
      }
      
      const updatedPosition = await TradingService.updatePosition(positionId, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedPosition
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin tài sản của người dùng
   * @route GET /api/trading/balance
   */
  async getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { exchange } = req.query;
      
      const balance = await TradingService.getBalance(userId.toString(), exchange as string);
      
      res.status(200).json({
        success: true,
        data: balance
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy sổ lệnh cho một cặp giao dịch cụ thể
   * @route GET /api/trading/orderbook/:symbol
   */
  async getOrderBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { symbol } = req.params;
      const { limit = 10, exchange } = req.query;
      
      if (!symbol) {
        throw new ValidationError('Symbol là bắt buộc');
      }
      
      const orderBook = await TradingService.getOrderBook(
        symbol,
        exchange as string,
        Number(limit)
      );
      
      res.status(200).json({
        success: true,
        data: orderBook
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy giá gần đây nhất cho một cặp giao dịch
   * @route GET /api/trading/ticker/:symbol
   */
  async getTicker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { symbol } = req.params;
      const { exchange } = req.query;
      
      if (!symbol) {
        throw new ValidationError('Symbol là bắt buộc');
      }
      
      const ticker = await TradingService.getTicker(symbol, exchange as string);
      
      res.status(200).json({
        success: true,
        data: ticker
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TradingController(); 