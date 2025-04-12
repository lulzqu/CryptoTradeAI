import { Notification } from '../models/Notification';
import { EmailService } from './email';
import { WebSocketService } from './websocket';

export class NotificationService {
  private static instance: NotificationService;
  private emailService: EmailService;
  private websocketService: WebSocketService;

  private constructor() {
    this.emailService = EmailService.getInstance();
    this.websocketService = WebSocketService.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async sendNotification(
    userId: string,
    type: 'SIGNAL' | 'TRADE' | 'SYSTEM' | 'ALERT',
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<void> {
    // Lưu thông báo vào database
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data,
      read: false
    });

    await notification.save();

    // Gửi email nếu cần
    if (type === 'SIGNAL' || type === 'ALERT') {
      await this.emailService.sendNotificationEmail(userId, title, message);
    }

    // Gửi thông báo real-time qua WebSocket
    this.websocketService.sendNotification(userId, {
      id: notification._id,
      type,
      title,
      message,
      data,
      timestamp: notification.createdAt
    });
  }

  public async markAsRead(notificationId: string, userId: string): Promise<void> {
    await Notification.updateOne(
      { _id: notificationId, userId },
      { read: true }
    );
  }

  public async getUnreadNotifications(userId: string): Promise<any[]> {
    return Notification.find({
      userId,
      read: false
    }).sort({ createdAt: -1 });
  }

  public async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any[]> {
    return Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }
} 