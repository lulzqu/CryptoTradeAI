import { Request, Response, NextFunction } from 'express';
import Position, { 
  IPosition, 
  PositionStatus, 
  PositionType, 
  SignalSource 
} from '../models/Position';
import { IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { createNotification } from './notification.controller';
import { NotificationType, NotificationPriority } from '../models/Notification';

// @desc    Lấy danh sách vị thế
// @route   GET /api/positions
// @access  Private
export const getPositions = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { 
    page = 1, 
    limit = 10, 
    status, 
    type, 
    symbol,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Xây dựng bộ lọc
  const filter: any = { user: user._id };
  
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (symbol) filter.symbol = symbol;

  // Xây dựng tùy chọn sắp xếp
  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  // Truy vấn vị thế
  const positions = await Position.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate('strategy')
    .populate('signal');

  // Đếm tổng số vị thế
  const total = await Position.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: positions.length,
    total,
    page: pageNumber,
    totalPages: Math.ceil(total / limitNumber),
    data: positions
  });
});

// @desc    Lấy chi tiết vị thế theo ID
// @route   GET /api/positions/:id
// @access  Private
export const getPositionById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  const { id } = req.params;

  const position = await Position.findOne({ 
    _id: id, 
    user: user._id 
  })
    .populate('strategy')
    .populate('signal');

  if (!position) {
    return next(new AppError(404, 'Không tìm thấy vị thế'));
  }

  res.status(200).json({
    success: true,
    data: position
  });
});

// @desc    Tạo vị thế mới
// @route   POST /api/positions
// @access  Private
export const createPosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  const { 
    symbol, 
    type, 
    entryPrice, 
    quantity, 
    leverage,
    stopLoss,
    takeProfit,
    strategy,
    signal,
    notes
  } = req.body;

  try {
    // Kiểm tra vị thế đang mở
    const existingOpenPosition = await Position.findOne({
      user: user._id,
      symbol,
      status: PositionStatus.OPEN
    });

    if (existingOpenPosition) {
      return next(new AppError(400, `Đã có vị thế ${symbol} đang mở`));
    }

    // Tạo vị thế mới
    const position = await Position.createPosition({
      user: user._id,
      symbol,
      type,
      entryPrice,
      quantity,
      leverage,
      stopLoss,
      takeProfit,
      strategy,
      signal,
      notes,
      signalSource: SignalSource.MANUAL
    });

    res.status(201).json({
      success: true,
      data: position
    });
  } catch (error) {
    next(new AppError(500, 'Lỗi khi tạo vị thế'));
  }
});

// @desc    Cập nhật vị thế
// @route   PUT /api/positions/:id
// @access  Private
export const updatePosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  const { id } = req.params;
  const updateData = req.body;

  try {
    const position = await Position.findOne({ 
      _id: id, 
      user: user._id 
    });

    if (!position) {
      return next(new AppError(404, 'Không tìm thấy vị thế'));
    }

    // Cập nhật vị thế
    const updatedPosition = await position.updatePosition(updateData);

    // Tạo thông báo
    await createNotification(
      user._id.toString(),
      NotificationType.POSITION_UPDATE,
      `Cập nhật vị thế ${position.symbol}`,
      `Vị thế ${position.type} ${position.symbol} đã được cập nhật`,
      NotificationPriority.LOW,
      {
        objectType: 'Position',
        objectId: position._id,
        metadata: updateData
      }
    );

    res.status(200).json({
      success: true,
      data: updatedPosition
    });
  } catch (error) {
    next(new AppError(500, 'Lỗi khi cập nhật vị thế'));
  }
});

// @desc    Đóng vị thế
// @route   POST /api/positions/:id/close
// @access  Private
export const closePosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  const { id } = req.params;
  const { exitPrice } = req.body;

  try {
    const position = await Position.findOne({ 
      _id: id, 
      user: user._id 
    });

    if (!position) {
      return next(new AppError(404, 'Không tìm thấy vị thế'));
    }

    // Đóng vị thế
    const closedPosition = await position.closePosition(exitPrice);

    res.status(200).json({
      success: true,
      data: closedPosition
    });
  } catch (error) {
    next(new AppError(500, 'Lỗi khi đóng vị thế'));
  }
});

// @desc    Xóa vị thế
// @route   DELETE /api/positions/:id
// @access  Private
export const deletePosition = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  const { id } = req.params;

  try {
    const position = await Position.findOne({ 
      _id: id, 
      user: user._id 
    });

    if (!position) {
      return next(new AppError(404, 'Không tìm thấy vị thế'));
    }

    // Chỉ cho phép xóa vị thế đã đóng
    if (position.status !== PositionStatus.CLOSED) {
      return next(new AppError(400, 'Chỉ được xóa vị thế đã đóng'));
    }

    await position.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vị thế đã được xóa'
    });
  } catch (error) {
    next(new AppError(500, 'Lỗi khi xóa vị thế'));
  }
});

// @desc    Lấy thống kê vị thế
// @route   GET /api/positions/stats
// @access  Private
export const getPositionStats = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;

  // Thống kê tổng quan
  const stats = await Position.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalPositions: { $sum: 1 },
        openPositions: { 
          $sum: { 
            $cond: [{ $eq: ['$status', PositionStatus.OPEN] }, 1, 0] 
          } 
        },
        closedPositions: { 
          $sum: { 
            $cond: [{ $eq: ['$status', PositionStatus.CLOSED] }, 1, 0] 
          } 
        },
        totalRealizedPnl: { $sum: '$realizedPnl' },
        totalUnrealizedPnl: { $sum: '$unrealizedPnl' },
        avgLeverage: { $avg: '$leverage' },
        profitablePositions: { 
          $sum: { 
            $cond: [{ $gt: ['$realizedPnl', 0] }, 1, 0] 
          } 
        }
      }
    }
  ]);

  // Thống kê theo loại vị thế
  const typeStats = await Position.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalRealizedPnl: { $sum: '$realizedPnl' }
      }
    }
  ]);

  // Thống kê theo symbol
  const symbolStats = await Position.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: '$symbol',
        count: { $sum: 1 },
        totalRealizedPnl: { $sum: '$realizedPnl' }
      }
    },
    { $sort: { totalRealizedPnl: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {},
      typeStats,
      symbolStats
    }
  });
}); 