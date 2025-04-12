import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service';
import { ValidationError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export class AlertController {
  private alertService: AlertService;

  constructor() {
    this.alertService = new AlertService();
  }

  /**
   * Lấy danh sách alerts của người dùng
   */
  async getAlerts(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { status, type, symbol, page, limit } = req.query;
      
      const options = {
        status: status as string,
        type: type as string,
        symbol: symbol as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };
      
      const alerts = await this.alertService.getAlerts(userId, options);
      
      res.json({
        success: true,
        count: alerts.length,
        data: alerts
      });
    } catch (error) {
      logger.error('Error in getAlerts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Lấy chi tiết alert theo ID
   */
  async getAlertById(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const alertId = req.params.id;
      
      const alert = await this.alertService.getAlertById(alertId, userId);
      
      res.json({
        success: true,
        data: alert
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      logger.error(`Error in getAlertById controller for alert ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Tạo alert mới
   */
  async createAlert(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const alertData = {
        ...req.body,
        user: userId
      };
      
      const newAlert = await this.alertService.createAlert(alertData);
      
      res.status(201).json({
        success: true,
        data: newAlert
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      logger.error('Error in createAlert controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Cập nhật alert
   */
  async updateAlert(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const alertId = req.params.id;
      const updateData = req.body;
      
      const updatedAlert = await this.alertService.updateAlert(alertId, userId, updateData);
      
      res.json({
        success: true,
        data: updatedAlert
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      logger.error(`Error in updateAlert controller for alert ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Xóa alert
   */
  async deleteAlert(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const alertId = req.params.id;
      
      await this.alertService.deleteAlert(alertId, userId);
      
      res.json({
        success: true,
        message: 'Alert deleted successfully'
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      logger.error(`Error in deleteAlert controller for alert ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Kích hoạt alert thủ công
   */
  async triggerAlert(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const alertId = req.params.id;
      
      // Kiểm tra quyền truy cập alert
      await this.alertService.getAlertById(alertId, userId);
      
      const triggeredAlert = await this.alertService.triggerAlert(alertId);
      
      res.json({
        success: true,
        message: 'Alert triggered successfully',
        data: triggeredAlert
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      logger.error(`Error in triggerAlert controller for alert ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Xử lý tất cả alerts (thường được gọi bởi cronjob)
   */
  async processAlerts(req: Request, res: Response) {
    try {
      // Kiểm tra quyền admin (nếu cần)
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied'
        });
      }
      
      const triggeredCount = await this.alertService.processActiveAlerts();
      
      res.json({
        success: true,
        message: `Processed all active alerts`,
        triggeredCount
      });
    } catch (error) {
      logger.error('Error in processAlerts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}