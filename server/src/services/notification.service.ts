import { Notification, INotification } from '../models/notification.model';
import { User } from '../models/user.model';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { EmailService } from './email.service';

// Enum cho loại thông báo
export enum NotificationType {
  SIGNAL_SHARED = 'SIGNAL_SHARED',
  TRADE_EXECUTED = 'TRADE_EXECUTED',
  POSITION_OPENED = 'POSITION_OPENED',
  POSITION_CLOSED = 'POSITION_CLOSED',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
  SECURITY_ALERT = 'SECURITY_ALERT',
  VERIFICATION = 'VERIFICATION'
}

export class NotificationService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async createNotification(data: Partial<INotification>): Promise<INotification> {
    // Validate user exists
    const user = await User.findById(data.user);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Create notification
    const notification = new Notification(data);
    return notification.save();
  }

  async getNotificationById(id: string): Promise<INotification> {
    const notification = await Notification.findById(id)
      .populate('user', 'username email')
      .exec();
    
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    return notification;
  }

  async getNotificationsByUser(userId: string): Promise<INotification[]> {
    return Notification.find({ user: userId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUnreadNotifications(userId: string): Promise<INotification[]> {
    return Notification.find({ 
      user: userId,
      status: 'unread'
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string): Promise<INotification> {
    const notification = await Notification.findById(id);
    
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    notification.status = 'read';
    notification.readAt = new Date();
    return notification.save();
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await Notification.updateMany(
      { user: userId, status: 'unread' },
      { 
        status: 'read',
        readAt: new Date()
      }
    );
    return result.modifiedCount > 0;
  }

  async archiveNotification(id: string): Promise<INotification> {
    const notification = await Notification.findById(id);
    
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    notification.status = 'archived';
    return notification.save();
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await Notification.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async deleteExpiredNotifications(): Promise<boolean> {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount > 0;
  }

  async getNotificationsByType(userId: string, type: string): Promise<INotification[]> {
    return Notification.find({ 
      user: userId,
      type
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getNotificationsByPriority(userId: string, priority: string): Promise<INotification[]> {
    return Notification.find({ 
      user: userId,
      priority
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async createTradeNotification(userId: string, tradeId: string, message: string): Promise<INotification> {
    return this.createNotification({
      user: userId,
      type: 'trade',
      title: 'Trade Update',
      message,
      priority: 'medium',
      data: { tradeId },
      actions: [
        {
          label: 'View Trade',
          url: `/trades/${tradeId}`
        }
      ]
    });
  }

  async createSignalNotification(userId: string, signalId: string, message: string): Promise<INotification> {
    return this.createNotification({
      user: userId,
      type: 'signal',
      title: 'New Signal',
      message,
      priority: 'high',
      data: { signalId },
      actions: [
        {
          label: 'View Signal',
          url: `/signals/${signalId}`
        }
      ]
    });
  }

  async createRiskNotification(userId: string, message: string): Promise<INotification> {
    return this.createNotification({
      user: userId,
      type: 'risk',
      title: 'Risk Alert',
      message,
      priority: 'critical',
      actions: [
        {
          label: 'View Risk Dashboard',
          url: '/risk'
        }
      ]
    });
  }

  async createSystemNotification(userId: string, message: string): Promise<INotification> {
    return this.createNotification({
      user: userId,
      type: 'system',
      title: 'System Notification',
      message,
      priority: 'low'
    });
  }

  // Tạo thông báo mới
  async createNotificationForUser(
    userId: string, 
    notification: Omit<INotification, 'createdAt' | 'read'>
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        logger.error(`Người dùng không tồn tại: ${userId}`);
        return false;
      }

      // Thêm thông báo vào mảng thông báo của người dùng
      const newNotification = {
        ...notification,
        read: false,
        createdAt: new Date()
      };

      user.notifications.push(newNotification);
      await user.save();

      // Gửi email nếu người dùng có cài đặt
      if (user.settings.notifications.email) {
        await this.sendEmailNotification(user.email, newNotification);
      }

      logger.info(`Tạo thông báo cho người dùng: ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi tạo thông báo: ${error}`);
      return false;
    }
  }

  // Lấy danh sách thông báo
  async getNotifications(
    userId: string, 
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    }
  ): Promise<INotification[]> {
    try {
      const { 
        limit = 10, 
        offset = 0, 
        unreadOnly = false 
      } = options || {};

      const user = await User.findById(userId);
      
      if (!user) {
        logger.error(`Người dùng không tồn tại: ${userId}`);
        return [];
      }

      // Lọc và phân trang thông báo
      let notifications = user.notifications;
      
      if (unreadOnly) {
        notifications = notifications.filter(n => !n.read);
      }

      return notifications
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(offset, offset + limit);
    } catch (error) {
      logger.error(`Lỗi lấy thông báo: ${error}`);
      return [];
    }
  }

  // Đánh dấu thông báo đã đọc
  async markNotificationAsRead(
    userId: string, 
    notificationId: string
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        logger.error(`Người dùng không tồn tại: ${userId}`);
        return false;
      }

      const notificationIndex = user.notifications.findIndex(
        n => n._id.toString() === notificationId
      );

      if (notificationIndex === -1) {
        logger.error(`Không tìm thấy thông báo: ${notificationId}`);
        return false;
      }

      user.notifications[notificationIndex].read = true;
      await user.save();

      logger.info(`Đánh dấu thông báo đã đọc: ${notificationId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi đánh dấu thông báo: ${error}`);
      return false;
    }
  }

  // Xóa thông báo
  async deleteNotificationForUser(
    userId: string, 
    notificationId: string
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        logger.error(`Người dùng không tồn tại: ${userId}`);
        return false;
      }

      user.notifications = user.notifications.filter(
        n => n._id.toString() !== notificationId
      );

      await user.save();

      logger.info(`Xóa thông báo: ${notificationId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi xóa thông báo: ${error}`);
      return false;
    }
  }

  // Gửi email thông báo
  private async sendEmailNotification(
    email: string, 
    notification: INotification
  ): Promise<void> {
    try {
      // Gửi email dựa trên loại thông báo
      switch (notification.type) {
        case NotificationType.SIGNAL_SHARED:
          await this.emailService.sendSignalNotificationEmail(
            email, 
            notification.data as { 
              symbol: string; 
              type: string; 
              price: number 
            }
          );
          break;
        
        case NotificationType.TRADE_EXECUTED:
        case NotificationType.POSITION_OPENED:
        case NotificationType.POSITION_CLOSED:
          // TODO: Implement specific email templates for these types
          break;

        default:
          // Gửi email thông báo chung
          await this.emailService.sendEmail({
            to: email,
            subject: notification.title,
            html: `
              <h1>${notification.title}</h1>
              <p>${notification.content}</p>
            `
          });
      }
    } catch (error) {
      logger.error(`Lỗi gửi email thông báo: ${error}`);
    }
  }

  // Xóa tất cả thông báo đã đọc
  async clearReadNotifications(userId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        logger.error(`Người dùng không tồn tại: ${userId}`);
        return false;
      }

      user.notifications = user.notifications.filter(n => !n.read);
      await user.save();

      logger.info(`Xóa tất cả thông báo đã đọc cho người dùng: ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Lỗi xóa thông báo đã đọc: ${error}`);
      return false;
    }
  }
} 