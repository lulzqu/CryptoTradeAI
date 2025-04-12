import { Request, Response, NextFunction } from 'express';
import Notification, { 
  NotificationType, 
  NotificationPriority 
} from '../models/Notification';
import User, { IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';
import { NotFoundError, ValidationError } from '../utils/errors';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // @desc    Lấy danh sách thông báo
  // @route   GET /api/notifications
  // @access  Private
  getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { limit, offset, unreadOnly } = req.query;

      const notifications = await this.notificationService.getNotifications(
        userId, 
        {
          limit: limit ? parseInt(limit as string) : undefined,
          offset: offset ? parseInt(offset as string) : undefined,
          unreadOnly: unreadOnly === 'true'
        }
      );

      res.status(200).json({
        success: true,
        data: notifications,
        metadata: {
          total: notifications.length,
          unreadCount: notifications.filter(n => !n.read).length
        }
      });
    } catch (error) {
      logger.error(`Lỗi lấy thông báo: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy danh sách thông báo'
      });
    }
  }

  // @desc    Đánh dấu thông báo đã đọc
  // @route   PUT /api/notifications/:id/read
  // @access  Private
  markNotificationAsRead = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      const result = await this.notificationService.markNotificationAsRead(
        userId, 
        notificationId
      );

      if (result) {
        res.status(200).json({
          success: true,
          message: 'Đánh dấu thông báo đã đọc thành công'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông báo'
        });
      }
    } catch (error) {
      logger.error(`Lỗi đánh dấu thông báo: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Không thể đánh dấu thông báo'
      });
    }
  }

  // @desc    Xóa thông báo
  // @route   DELETE /api/notifications/:id
  // @access  Private
  deleteNotification = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      const result = await this.notificationService.deleteNotification(
        userId, 
        notificationId
      );

      if (result) {
        res.status(200).json({
          success: true,
          message: 'Xóa thông báo thành công'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông báo'
        });
      }
    } catch (error) {
      logger.error(`Lỗi xóa thông báo: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Không thể xóa thông báo'
      });
    }
  }

  // @desc    Lấy số lượng thông báo chưa đọc
  // @route   GET /api/notifications/unread/count
  // @access  Private
  getUnreadNotificationsCount = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as IUser;

    const unreadCount = await Notification.countDocuments({
      user: user._id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount
    });
  });

  // @desc    Cập nhật cài đặt thông báo
  // @route   PUT /api/notifications/settings
  // @access  Private
  updateNotificationSettings = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { 
        email = true, 
        push = true, 
        types = Object.values(NotificationType) 
      } = req.body;

      // Cập nhật cài đặt thông báo trong model người dùng
      const user = await User.findByIdAndUpdate(
        userId, 
        {
          'settings.notifications': {
            email,
            push,
            types
          }
        },
        { new: true }
      );

      if (user) {
        res.status(200).json({
          success: true,
          message: 'Cập nhật cài đặt thông báo thành công',
          data: user.settings.notifications
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }
    } catch (error) {
      logger.error(`Lỗi cập nhật cài đặt thông báo: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Không thể cập nhật cài đặt thông báo'
      });
    }
  }

  // Hàm tiện ích để tạo thông báo
  createNotification = async (
    userId: string, 
    type: NotificationType, 
    title: string, 
    message: string,
    priority: NotificationPriority = NotificationPriority.LOW,
    metadata?: Record<string, any>
  ) => {
    try {
      const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        priority,
        metadata
      });

      return notification;
    } catch (error) {
      console.error('Lỗi tạo thông báo:', error);
      return null;
    }
  };

  // Lấy chi tiết thông báo theo ID
  getNotificationById = asyncHandler(async (
    req: Request, 
    res: Response
  ) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      throw new AppError('Không tìm thấy thông báo', 404);
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  });

  // Xóa tất cả thông báo
  deleteAllNotifications = asyncHandler(async (
    req: Request, 
    res: Response
  ) => {
    await Notification.deleteMany({ 
      user: req.user.id 
    });

    res.status(200).json({
      success: true,
      message: 'Tất cả thông báo đã được xóa'
    });
  });

  // Cập nhật cài đặt thông báo
  updateNotificationPreferences = asyncHandler(async (
    req: Request, 
    res: Response
  ) => {
    const { 
      email, 
      sms, 
      push, 
      tradingSignals, 
      accountActivity 
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          'notificationSettings.email': email,
          'notificationSettings.sms': sms,
          'notificationSettings.push': push,
          'notificationSettings.tradingSignals': tradingSignals,
          'notificationSettings.accountActivity': accountActivity
        } 
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!user) {
      throw new AppError('Người dùng không tồn tại', 404);
    }

    // Tạo thông báo
    await this.createNotification(
      user._id.toString(),
      NotificationType.ACCOUNT,
      'Cập nhật cài đặt thông báo',
      'Cài đặt thông báo của bạn đã được cập nhật',
      NotificationPriority.LOW
    );

    res.status(200).json({
      success: true,
      data: user.notificationSettings
    });
  });

  // Xóa tất cả thông báo đã đọc
  clearReadNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      const result = await this.notificationService.clearReadNotifications(userId);

      if (result) {
        res.status(200).json({
          success: true,
          message: 'Xóa tất cả thông báo đã đọc thành công'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Không thể xóa thông báo'
        });
      }
    } catch (error) {
      logger.error(`Lỗi xóa thông báo đã đọc: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Không thể xóa thông báo'
      });
    }
  }

  async createNotification(req: Request, res: Response) {
    try {
      const notification = await this.notificationService.createNotification({
        ...req.body,
        user: req.user._id
      });
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getNotification(req: Request, res: Response) {
    try {
      const notification = await this.notificationService.getNotificationById(req.params.id);
      res.json(notification);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getNotificationsByType(req: Request, res: Response) {
    try {
      const notifications = await this.notificationService.getNotificationsByType(
        req.user._id,
        req.params.type
      );
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getNotificationsByDate(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const notifications = await this.notificationService.getNotificationsByDate(
        req.user._id,
        startDate as string,
        endDate as string
      );
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTradeNotification(req: Request, res: Response) {
    try {
      const notification = await this.notificationService.createTradeNotification(
        req.user._id,
        req.body.tradeId,
        req.body.message
      );
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createSignalNotification(req: Request, res: Response) {
    try {
      const notification = await this.notificationService.createSignalNotification(
        req.user._id,
        req.body.signalId,
        req.body.message
      );
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createRiskNotification(req: Request, res: Response) {
    try {
      const notification = await this.notificationService.createRiskNotification(
        req.user._id,
        req.body.message,
        req.body.level
      );
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createSystemNotification(req: Request, res: Response) {
    try {
      const notification = await this.notificationService.createSystemNotification(
        req.user._id,
        req.body.message,
        req.body.level
      );
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 