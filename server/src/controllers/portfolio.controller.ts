import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import Position, { IPosition } from '../models/Position';
import { PositionStatus } from '../types';
import mongoose from 'mongoose';
import { MEXCService } from '../services/mexc';
import { TradingService } from '../services/trading';
import { RiskManagementService } from '../services/riskManagement';
import { AppError } from '../middleware/errorHandler';
import { PortfolioService } from '../services/portfolio.service';
import { NotFoundError, ValidationError } from '../utils/errors';
import PortfolioService from '../services/portfolio.service';
import { IPortfolio } from '../models/portfolio.model';
import { IUser } from '../models/user.model';

/**
 * @desc    Lấy tất cả vị thế của người dùng
 * @route   GET /api/portfolio/positions
 * @access  Private
 */
export const getPositions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status, symbol, startDate, endDate, sort = '-createdAt' } = req.query;
  
  // Tạo query
  let query: any = { user: req.user.id };
  
  // Lọc theo trạng thái
  if (status) {
    query.status = status;
  }
  
  // Lọc theo cặp giao dịch
  if (symbol) {
    query.symbol = symbol;
  }
  
  // Lọc theo khoảng thời gian
  if (startDate && endDate) {
    query.openDate = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    };
  } else if (startDate) {
    query.openDate = { $gte: new Date(startDate as string) };
  } else if (endDate) {
    query.openDate = { $lte: new Date(endDate as string) };
  }
  
  // Thực thi query
  const positions = await Position.find(query).sort(sort as string);
  
  res.status(200).json({
    success: true,
    count: positions.length,
    data: positions
  });
});

/**
 * @desc    Lấy tất cả vị thế đang mở của người dùng
 * @route   GET /api/portfolio/positions/open
 * @access  Private
 */
export const getOpenPositions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const positions = await Position.find({ 
    user: req.user.id,
    status: PositionStatus.OPEN
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: positions.length,
    data: positions
  });
});

/**
 * @desc    Lấy tất cả vị thế đã đóng của người dùng
 * @route   GET /api/portfolio/positions/closed
 * @access  Private
 */
export const getClosedPositions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const positions = await Position.find({
    user: req.user.id,
    status: { $in: [PositionStatus.CLOSED, PositionStatus.LIQUIDATED] }
  }).sort({ exitTime: -1 });

  res.status(200).json({
    success: true,
    count: positions.length,
    data: positions
  });
});

/**
 * @desc    Lấy thông tin một vị thế
 * @route   GET /api/portfolio/positions/:id
 * @access  Private
 */
export const getPosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const position = await Position.findById(req.params.id);
  
  if (!position) {
    return next(new AppError(404, 'Không tìm thấy vị thế'));
  }
  
  // Kiểm tra quyền sở hữu
  if (position.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError(403, 'Không có quyền truy cập vị thế này'));
  }
  
  res.status(200).json({
    success: true,
    data: position
  });
});

/**
 * @desc    Tạo vị thế mới
 * @route   POST /api/portfolio/positions
 * @access  Private
 */
export const createPosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  req.body.user = req.user.id;
  
  // Kiểm tra rủi ro
  const riskManagementService = RiskManagementService.getInstance();
  const isValid = await riskManagementService.validatePosition(req.body);
  
  if (!isValid) {
    return next(new AppError(400, 'Vị thế không hợp lệ hoặc có rủi ro cao'));
  }
  
  // Thực hiện giao dịch
  const tradingService = TradingService.getInstance();
  const result = await tradingService.executeOrder({
    userId: req.user.id,
    symbol: req.body.symbol,
    side: req.body.side,
    type: 'MARKET',
    quantity: req.body.quantity
  });
  
  // Tạo vị thế
  const position = await Position.create({
    ...req.body,
    entryPrice: result.price
  });
  
  res.status(201).json({
    success: true,
    data: position
  });
});

/**
 * @desc    Cập nhật vị thế
 * @route   PUT /api/portfolio/positions/:id
 * @access  Private
 */
export const updatePosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let position = await Position.findById(req.params.id);
  
  if (!position) {
    return next(new AppError(404, 'Không tìm thấy vị thế'));
  }
  
  // Kiểm tra quyền sở hữu
  if (position.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError(403, 'Không có quyền cập nhật vị thế này'));
  }
  
  // Không cho phép cập nhật một số trường
  const protectedFields = ['user', 'entryPrice', 'status', 'closeDate', 'closingPrice', 'profit'];
  for (const field of protectedFields) {
    if (field in req.body) {
      delete req.body[field];
    }
  }
  
  // Cập nhật vị thế
  position = await Position.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: position
  });
});

/**
 * @desc    Đóng vị thế
 * @route   POST /api/portfolio/positions/:id/close
 * @access  Private
 */
export const closePosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const position = await Position.findById(req.params.id);
  
  if (!position) {
    return next(new AppError(404, 'Không tìm thấy vị thế'));
  }
  
  // Kiểm tra quyền sở hữu
  if (position.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError(403, 'Không có quyền đóng vị thế này'));
  }
  
  // Kiểm tra nếu vị thế đã đóng
  if (position.status === 'CLOSED') {
    return next(new AppError(400, 'Vị thế này đã được đóng'));
  }
  
  // Đóng vị thế
  const tradingService = TradingService.getInstance();
  const result = await tradingService.closePosition(position.id, req.user.id);
  
  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * @desc    Xóa vị thế
 * @route   DELETE /api/portfolio/positions/:id
 * @access  Private
 */
export const deletePosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const position = await Position.findById(req.params.id);
  
  if (!position) {
    return next(new AppError(404, 'Không tìm thấy vị thế'));
  }
  
  // Kiểm tra quyền sở hữu
  if (position.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError(403, 'Không có quyền xóa vị thế này'));
  }
  
  // Chỉ cho phép xóa vị thế đã đóng
  if (position.status === 'OPEN') {
    return next(new AppError(400, 'Không thể xóa vị thế đang mở. Hãy đóng vị thế trước.'));
  }
  
  await position.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Lấy thống kê danh mục đầu tư
 * @route   GET /api/portfolio/stats
 * @access  Private
 */
export const getPortfolioStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Tổng số vị thế
  const totalPositions = await Position.countDocuments({ user: req.user.id });
  
  // Vị thế đang mở
  const openPositions = await Position.countDocuments({ 
    user: req.user.id,
    status: 'OPEN'
  });
  
  // Vị thế đã đóng
  const closedPositions = await Position.countDocuments({ 
    user: req.user.id,
    status: 'CLOSED'
  });
  
  // Tổng lợi nhuận/lỗ
  const profitResult = await Position.aggregate([
    { 
      $match: { 
        user: req.user._id,
        status: 'CLOSED'
      } 
    },
    {
      $group: {
        _id: null,
        totalProfit: { $sum: '$profit' }
      }
    }
  ]);
  
  const totalProfit = profitResult.length > 0 ? profitResult[0].totalProfit : 0;
  
  // Thắng/thua
  const winPositions = await Position.countDocuments({ 
    user: req.user.id,
    status: 'CLOSED',
    profit: { $gt: 0 }
  });
  
  const lossPositions = await Position.countDocuments({ 
    user: req.user.id,
    status: 'CLOSED',
    profit: { $lte: 0 }
  });
  
  // Tỷ lệ thắng
  const winRate = closedPositions > 0 ? (winPositions / closedPositions) * 100 : 0;
  
  // Lấy số dư tài khoản
  const mexcService = MEXCService.getInstance();
  const balances = await mexcService.getAccountInfo();
  
  res.status(200).json({
    success: true,
    data: {
      totalPositions,
      openPositions,
      closedPositions,
      totalProfit,
      winPositions,
      lossPositions,
      winRate,
      balances
    }
  });
});

/**
 * @desc    Lấy lịch sử giao dịch
 * @route   GET /api/portfolio/history
 * @access  Private
 */
export const getTradeHistory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { symbol, startDate, endDate, limit = 50, page = 1 } = req.query;
  
  // Tạo query
  let query: any = { 
    user: req.user.id,
    status: 'CLOSED'
  };
  
  // Lọc theo cặp giao dịch
  if (symbol) {
    query.symbol = symbol;
  }
  
  // Lọc theo khoảng thời gian
  if (startDate && endDate) {
    query.closeDate = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    };
  } else if (startDate) {
    query.closeDate = { $gte: new Date(startDate as string) };
  } else if (endDate) {
    query.closeDate = { $lte: new Date(endDate as string) };
  }
  
  // Phân trang
  const pageSize = parseInt(limit as string);
  const skip = (parseInt(page as string) - 1) * pageSize;
  
  // Thực thi query
  const trades = await Position.find(query)
    .sort('-closeDate')
    .skip(skip)
    .limit(pageSize);
  
  // Tổng số kết quả
  const total = await Position.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: trades.length,
    pagination: {
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / pageSize)
    },
    data: trades
  });
});

class PortfolioController {
  /**
   * Tạo danh mục đầu tư mới
   * @route POST /api/portfolios
   */
  async createPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioData = { ...req.body, userId };
      
      const portfolio = await PortfolioService.createPortfolio(portfolioData);
      
      res.status(201).json({
        success: true,
        data: portfolio
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy tất cả danh mục đầu tư của người dùng
   * @route GET /api/portfolios
   */
  async getPortfolios(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { status, type, sort, limit = 10, page = 1 } = req.query;
      
      const filter: Partial<IPortfolio> = { userId: userId.toString() };
      
      if (status) {
        filter.status = status as string;
      }
      
      if (type) {
        filter.type = type as string;
      }
      
      const options = {
        sort: sort ? JSON.parse(sort as string) : { createdAt: -1 },
        limit: Number(limit),
        page: Number(page)
      };
      
      const portfolios = await PortfolioService.getPortfolios(filter, options);
      
      res.status(200).json({
        success: true,
        count: portfolios.length,
        data: portfolios
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết danh mục đầu tư theo ID
   * @route GET /api/portfolios/:id
   */
  async getPortfolioById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      
      const portfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!portfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      // Kiểm tra quyền truy cập
      if (portfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập danh mục đầu tư này'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: portfolio
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật danh mục đầu tư
   * @route PUT /api/portfolios/:id
   */
  async updatePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      const updateData = req.body;
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật danh mục đầu tư này'
        });
        return;
      }
      
      // Cập nhật danh mục đầu tư
      const updatedPortfolio = await PortfolioService.updatePortfolio(
        portfolioId,
        updateData
      );
      
      res.status(200).json({
        success: true,
        data: updatedPortfolio
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa danh mục đầu tư
   * @route DELETE /api/portfolios/:id
   */
  async deletePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền xóa danh mục đầu tư này'
        });
        return;
      }
      
      // Xóa danh mục đầu tư
      await PortfolioService.deletePortfolio(portfolioId);
      
      res.status(200).json({
        success: true,
        message: 'Danh mục đầu tư đã được xóa'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm chiến lược vào danh mục đầu tư
   * @route POST /api/portfolios/:id/strategies
   */
  async addStrategyToPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      const { strategyId, weight } = req.body;
      
      if (!strategyId) {
        throw new ValidationError('ID chiến lược là bắt buộc');
      }
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền thêm chiến lược vào danh mục đầu tư này'
        });
        return;
      }
      
      // Thêm chiến lược vào danh mục đầu tư
      const updatedPortfolio = await PortfolioService.addStrategyToPortfolio(
        portfolioId,
        strategyId,
        weight || 1
      );
      
      res.status(200).json({
        success: true,
        data: updatedPortfolio
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa chiến lược khỏi danh mục đầu tư
   * @route DELETE /api/portfolios/:id/strategies/:strategyId
   */
  async removeStrategyFromPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { id: portfolioId, strategyId } = req.params;
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền xóa chiến lược khỏi danh mục đầu tư này'
        });
        return;
      }
      
      // Xóa chiến lược khỏi danh mục đầu tư
      const updatedPortfolio = await PortfolioService.removeStrategyFromPortfolio(
        portfolioId,
        strategyId
      );
      
      res.status(200).json({
        success: true,
        data: updatedPortfolio
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật trọng số của chiến lược trong danh mục đầu tư
   * @route PUT /api/portfolios/:id/strategies/:strategyId/weight
   */
  async updateStrategyWeight(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { id: portfolioId, strategyId } = req.params;
      const { weight } = req.body;
      
      if (weight === undefined || weight < 0) {
        throw new ValidationError('Trọng số phải là một số không âm');
      }
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật trọng số chiến lược trong danh mục đầu tư này'
        });
        return;
      }
      
      // Cập nhật trọng số chiến lược
      const updatedPortfolio = await PortfolioService.updateStrategyWeight(
        portfolioId,
        strategyId,
        weight
      );
      
      res.status(200).json({
        success: true,
        data: updatedPortfolio
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cân bằng lại danh mục đầu tư
   * @route POST /api/portfolios/:id/rebalance
   */
  async rebalancePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền cân bằng lại danh mục đầu tư này'
        });
        return;
      }
      
      // Cân bằng lại danh mục đầu tư
      const rebalancedPortfolio = await PortfolioService.rebalancePortfolio(portfolioId);
      
      res.status(200).json({
        success: true,
        data: rebalancedPortfolio
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tính toán hiệu suất danh mục đầu tư
   * @route GET /api/portfolios/:id/performance
   */
  async getPortfolioPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      const { startDate, endDate, interval = 'daily' } = req.query;
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền xem hiệu suất danh mục đầu tư này'
        });
        return;
      }
      
      // Thiết lập các tham số tính toán hiệu suất
      const options: any = { interval: interval as string };
      
      if (startDate) {
        options.startDate = new Date(startDate as string);
      }
      
      if (endDate) {
        options.endDate = new Date(endDate as string);
      }
      
      // Tính toán hiệu suất danh mục đầu tư
      const performance = await PortfolioService.getPortfolioPerformance(portfolioId, options);
      
      res.status(200).json({
        success: true,
        data: performance
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tính toán các chỉ số rủi ro của danh mục đầu tư
   * @route GET /api/portfolios/:id/risk
   */
  async getPortfolioRiskMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền xem chỉ số rủi ro danh mục đầu tư này'
        });
        return;
      }
      
      // Tính toán các chỉ số rủi ro
      const riskMetrics = await PortfolioService.getPortfolioRiskMetrics(portfolioId);
      
      res.status(200).json({
        success: true,
        data: riskMetrics
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo bản sao của danh mục đầu tư
   * @route POST /api/portfolios/:id/clone
   */
  async clonePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const portfolioId = req.params.id;
      const { name } = req.body;
      
      if (!name) {
        throw new ValidationError('Tên danh mục đầu tư mới là bắt buộc');
      }
      
      // Kiểm tra danh mục đầu tư tồn tại và thuộc về người dùng
      const existingPortfolio = await PortfolioService.getPortfolioById(portfolioId);
      
      if (!existingPortfolio) {
        throw new NotFoundError('Không tìm thấy danh mục đầu tư');
      }
      
      if (existingPortfolio.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền sao chép danh mục đầu tư này'
        });
        return;
      }
      
      // Tạo bản sao danh mục đầu tư
      const clonedPortfolio = await PortfolioService.clonePortfolio(portfolioId, name);
      
      res.status(201).json({
        success: true,
        data: clonedPortfolio
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PortfolioController(); 