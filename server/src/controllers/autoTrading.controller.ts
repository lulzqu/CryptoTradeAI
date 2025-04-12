import { Request, Response, NextFunction } from 'express';
import { AutoTradingStrategy } from '../models/AutoTradingStrategy';
import { AutoTradingService } from '../services/autoTrading';
import { asyncHandler } from '../middleware/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';

const autoTradingService = AutoTradingService.getInstance();

// @desc    Tạo chiến lược giao dịch tự động
// @route   POST /api/v1/auto-trading/strategies
// @access  Private
export const createStrategy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const strategy = await AutoTradingStrategy.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    data: strategy
  });
});

// @desc    Lấy danh sách chiến lược
// @route   GET /api/v1/auto-trading/strategies
// @access  Private
export const getStrategies = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const strategies = await AutoTradingStrategy.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    count: strategies.length,
    data: strategies
  });
});

// @desc    Lấy chi tiết chiến lược
// @route   GET /api/v1/auto-trading/strategies/:id
// @access  Private
export const getStrategy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const strategy = await AutoTradingStrategy.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!strategy) {
    return next(new ErrorResponse('Không tìm thấy chiến lược', 404));
  }

  res.status(200).json({
    success: true,
    data: strategy
  });
});

// @desc    Cập nhật chiến lược
// @route   PUT /api/v1/auto-trading/strategies/:id
// @access  Private
export const updateStrategy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let strategy = await AutoTradingStrategy.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!strategy) {
    return next(new ErrorResponse('Không tìm thấy chiến lược', 404));
  }

  strategy = await AutoTradingStrategy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: strategy
  });
});

// @desc    Xóa chiến lược
// @route   DELETE /api/v1/auto-trading/strategies/:id
// @access  Private
export const deleteStrategy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const strategy = await AutoTradingStrategy.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!strategy) {
    return next(new ErrorResponse('Không tìm thấy chiến lược', 404));
  }

  await strategy.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Kích hoạt/vô hiệu hóa chiến lược
// @route   PUT /api/v1/auto-trading/strategies/:id/toggle
// @access  Private
export const toggleStrategy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const strategy = await AutoTradingStrategy.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!strategy) {
    return next(new ErrorResponse('Không tìm thấy chiến lược', 404));
  }

  strategy.status = strategy.status === 'active' ? 'inactive' : 'active';
  await strategy.save();

  res.status(200).json({
    success: true,
    data: strategy
  });
});

// @desc    Thực thi chiến lược
// @route   POST /api/v1/auto-trading/strategies/:id/execute
// @access  Private
export const executeStrategy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const strategy = await AutoTradingStrategy.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!strategy) {
    return next(new ErrorResponse('Không tìm thấy chiến lược', 404));
  }

  await autoTradingService.executeStrategy(strategy);

  res.status(200).json({
    success: true,
    message: 'Đã thực thi chiến lược thành công'
  });
}); 