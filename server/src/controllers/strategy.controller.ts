import { Request, Response, NextFunction } from 'express';
import StrategyService from '../services/strategy.service';
import { NotFoundError, ValidationError } from '../errors';
import { IStrategy } from '../models/strategy.model';
import { IUser } from '../models/user.model';

class StrategyController {
  /**
   * Tạo chiến lược mới
   * @route POST /api/strategies
   */
  async createStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyData = { ...req.body, userId };
      
      const strategy = await StrategyService.createStrategy(strategyData);
      
      res.status(201).json({
        success: true,
        data: strategy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy tất cả chiến lược của người dùng
   * @route GET /api/strategies
   */
  async getStrategies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const { status, type, sort, limit = 10, page = 1 } = req.query;
      
      const filter: Partial<IStrategy> = { userId: userId.toString() };
      
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
      
      const strategies = await StrategyService.getStrategies(filter, options);
      
      res.status(200).json({
        success: true,
        count: strategies.length,
        data: strategies
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết chiến lược theo ID
   * @route GET /api/strategies/:id
   */
  async getStrategyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyId = req.params.id;
      
      const strategy = await StrategyService.getStrategyById(strategyId);
      
      if (!strategy) {
        throw new NotFoundError('Không tìm thấy chiến lược');
      }
      
      // Kiểm tra quyền truy cập
      if (strategy.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập chiến lược này'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: strategy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật chiến lược
   * @route PUT /api/strategies/:id
   */
  async updateStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyId = req.params.id;
      const updateData = req.body;
      
      // Kiểm tra chiến lược tồn tại và thuộc về người dùng
      const existingStrategy = await StrategyService.getStrategyById(strategyId);
      
      if (!existingStrategy) {
        throw new NotFoundError('Không tìm thấy chiến lược');
      }
      
      if (existingStrategy.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật chiến lược này'
        });
        return;
      }
      
      // Cập nhật chiến lược
      const updatedStrategy = await StrategyService.updateStrategy(
        strategyId,
        updateData
      );
      
      res.status(200).json({
        success: true,
        data: updatedStrategy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa chiến lược
   * @route DELETE /api/strategies/:id
   */
  async deleteStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyId = req.params.id;
      
      // Kiểm tra chiến lược tồn tại và thuộc về người dùng
      const existingStrategy = await StrategyService.getStrategyById(strategyId);
      
      if (!existingStrategy) {
        throw new NotFoundError('Không tìm thấy chiến lược');
      }
      
      if (existingStrategy.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền xóa chiến lược này'
        });
        return;
      }
      
      // Xóa chiến lược
      await StrategyService.deleteStrategy(strategyId);
      
      res.status(200).json({
        success: true,
        message: 'Chiến lược đã được xóa'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Chạy backtest cho chiến lược
   * @route POST /api/strategies/:id/backtest
   */
  async runBacktest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyId = req.params.id;
      const backtestParams = req.body;
      
      // Kiểm tra chiến lược tồn tại và thuộc về người dùng
      const existingStrategy = await StrategyService.getStrategyById(strategyId);
      
      if (!existingStrategy) {
        throw new NotFoundError('Không tìm thấy chiến lược');
      }
      
      if (existingStrategy.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền chạy backtest cho chiến lược này'
        });
        return;
      }
      
      // Chạy backtest
      const backtestResults = await StrategyService.runBacktest(
        strategyId,
        backtestParams
      );
      
      res.status(200).json({
        success: true,
        data: backtestResults
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tối ưu hóa chiến lược
   * @route POST /api/strategies/:id/optimize
   */
  async optimizeStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyId = req.params.id;
      const optimizationParams = req.body;
      
      // Kiểm tra chiến lược tồn tại và thuộc về người dùng
      const existingStrategy = await StrategyService.getStrategyById(strategyId);
      
      if (!existingStrategy) {
        throw new NotFoundError('Không tìm thấy chiến lược');
      }
      
      if (existingStrategy.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền tối ưu hóa chiến lược này'
        });
        return;
      }
      
      // Tối ưu hóa chiến lược
      const optimizationResults = await StrategyService.optimizeStrategy(
        strategyId,
        optimizationParams
      );
      
      res.status(200).json({
        success: true,
        data: optimizationResults
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Kích hoạt/vô hiệu hóa chiến lược
   * @route PUT /api/strategies/:id/toggle
   */
  async toggleStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyId = req.params.id;
      
      // Kiểm tra chiến lược tồn tại và thuộc về người dùng
      const existingStrategy = await StrategyService.getStrategyById(strategyId);
      
      if (!existingStrategy) {
        throw new NotFoundError('Không tìm thấy chiến lược');
      }
      
      if (existingStrategy.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền kích hoạt/vô hiệu hóa chiến lược này'
        });
        return;
      }
      
      // Kích hoạt hoặc vô hiệu hóa chiến lược
      const newStatus = existingStrategy.status === 'active' ? 'inactive' : 'active';
      const updatedStrategy = await StrategyService.updateStrategy(
        strategyId,
        { status: newStatus }
      );
      
      res.status(200).json({
        success: true,
        data: updatedStrategy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sao chép chiến lược
   * @route POST /api/strategies/:id/clone
   */
  async cloneStrategy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)._id;
      const strategyId = req.params.id;
      
      // Kiểm tra chiến lược tồn tại và thuộc về người dùng
      const existingStrategy = await StrategyService.getStrategyById(strategyId);
      
      if (!existingStrategy) {
        throw new NotFoundError('Không tìm thấy chiến lược');
      }
      
      if (existingStrategy.userId.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Không có quyền sao chép chiến lược này'
        });
        return;
      }
      
      // Sao chép chiến lược
      const clonedStrategy = await StrategyService.cloneStrategy(strategyId, req.body.name);
      
      res.status(201).json({
        success: true,
        data: clonedStrategy
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StrategyController(); 