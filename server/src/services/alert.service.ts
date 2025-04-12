import { Alert, IAlert } from '../models/alert.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';
import { NotificationService } from './notification.service';

export class AlertService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Lấy tất cả alerts của người dùng
   */
  async getAlerts(userId: string, options: { 
    status?: string; 
    type?: string;
    symbol?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<IAlert[]> {
    try {
      const { status, type, symbol, page = 1, limit = 50 } = options;
      const query: any = { user: userId };
      
      if (status) query.status = status;
      if (type) query.type = type;
      if (symbol) query.symbol = symbol;
      
      const skip = (page - 1) * limit;
      
      const alerts = await Alert.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      return alerts;
    } catch (error) {
      logger.error(`Error getting alerts for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy alert theo ID
   */
  async getAlertById(alertId: string, userId: string): Promise<IAlert> {
    try {
      if (!Types.ObjectId.isValid(alertId)) {
        throw new ValidationError('Invalid alert ID');
      }

      const alert = await Alert.findOne({ _id: alertId, user: userId });
      
      if (!alert) {
        throw new NotFoundError('Alert not found');
      }
      
      return alert;
    } catch (error) {
      logger.error(`Error getting alert ${alertId}:`, error);
      throw error;
    }
  }

  /**
   * Tạo alert mới
   */
  async createAlert(alertData: Partial<IAlert>): Promise<IAlert> {
    try {
      const newAlert = new Alert(alertData);
      await newAlert.save();
      
      // Log alert creation
      logger.info(`Alert created: ${newAlert._id} for user ${alertData.user}`);
      
      return newAlert;
    } catch (error) {
      logger.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * Cập nhật alert
   */
  async updateAlert(alertId: string, userId: string, updateData: Partial<IAlert>): Promise<IAlert> {
    try {
      if (!Types.ObjectId.isValid(alertId)) {
        throw new ValidationError('Invalid alert ID');
      }

      // Không cho phép cập nhật user hoặc _id
      delete updateData.user;
      delete updateData._id;
      
      const updatedAlert = await Alert.findOneAndUpdate(
        { _id: alertId, user: userId },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
      
      if (!updatedAlert) {
        throw new NotFoundError('Alert not found');
      }
      
      logger.info(`Alert updated: ${alertId}`);
      
      return updatedAlert;
    } catch (error) {
      logger.error(`Error updating alert ${alertId}:`, error);
      throw error;
    }
  }

  /**
   * Xóa alert
   */
  async deleteAlert(alertId: string, userId: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(alertId)) {
        throw new ValidationError('Invalid alert ID');
      }

      const result = await Alert.deleteOne({ _id: alertId, user: userId });
      
      if (result.deletedCount === 0) {
        throw new NotFoundError('Alert not found');
      }
      
      logger.info(`Alert deleted: ${alertId}`);
      
      return true;
    } catch (error) {
      logger.error(`Error deleting alert ${alertId}:`, error);
      throw error;
    }
  }

  /**
   * Kích hoạt alert
   */
  async triggerAlert(alertId: string): Promise<IAlert> {
    try {
      const alert = await Alert.findById(alertId);
      
      if (!alert) {
        throw new NotFoundError('Alert not found');
      }
      
      // Cập nhật trạng thái và thời gian kích hoạt
      alert.status = alert.frequency === 'once' ? 'triggered' : 'active';
      alert.lastTriggered = new Date();
      alert.triggerCount += 1;
      await alert.save();
      
      // Tạo thông báo
      await this.notificationService.createNotification({
        user: alert.user,
        type: 'alert',
        title: `Alert: ${alert.name}`,
        message: alert.message,
        priority: alert.priority,
        data: {
          alertId: alert._id,
          symbol: alert.symbol,
          type: alert.type
        }
      });
      
      logger.info(`Alert triggered: ${alertId}`);
      
      return alert;
    } catch (error) {
      logger.error(`Error triggering alert ${alertId}:`, error);
      throw error;
    }
  }

  /**
   * Kích hoạt nhiều alerts cùng lúc
   */
  async bulkTriggerAlerts(alertIds: string[]): Promise<IAlert[]> {
    const triggeredAlerts: IAlert[] = [];
    
    for (const alertId of alertIds) {
      try {
        const alert = await this.triggerAlert(alertId);
        triggeredAlerts.push(alert);
      } catch (error) {
        logger.error(`Error in bulk trigger for alert ${alertId}:`, error);
      }
    }
    
    return triggeredAlerts;
  }

  /**
   * Xử lý/kiểm tra tất cả alerts hoạt động
   */
  async processActiveAlerts(): Promise<number> {
    try {
      // Tìm tất cả alerts có trạng thái active
      const activeAlerts = await Alert.find({ status: 'active' });
      
      let triggeredCount = 0;
      const triggeredAlertIds: string[] = [];
      
      // Implementation of alert checking logic would go here
      // This would typically involve checking market data, indicators, etc.
      // For now, this is a placeholder
      
      // Kích hoạt alerts nếu có
      if (triggeredAlertIds.length > 0) {
        await this.bulkTriggerAlerts(triggeredAlertIds);
        triggeredCount = triggeredAlertIds.length;
      }
      
      return triggeredCount;
    } catch (error) {
      logger.error('Error processing active alerts:', error);
      throw error;
    }
  }
} 