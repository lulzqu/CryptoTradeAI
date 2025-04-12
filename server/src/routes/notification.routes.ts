import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { notificationSchema } from '../schemas/notification.schema';

const router = Router();
const notificationController = new NotificationController();

// Tạo thông báo mới
router.post(
  '/',
  authMiddleware,
  validateRequest(notificationSchema.create),
  notificationController.createNotification.bind(notificationController)
);

// Lấy thông báo theo ID
router.get(
  '/:id',
  authMiddleware,
  notificationController.getNotification.bind(notificationController)
);

// Lấy tất cả thông báo của người dùng
router.get(
  '/',
  authMiddleware,
  notificationController.getNotifications.bind(notificationController)
);

// Đánh dấu thông báo đã đọc
router.put(
  '/:id/read',
  authMiddleware,
  notificationController.markAsRead.bind(notificationController)
);

// Đánh dấu tất cả thông báo đã đọc
router.put(
  '/read-all',
  authMiddleware,
  notificationController.markAllAsRead.bind(notificationController)
);

// Xóa thông báo
router.delete(
  '/:id',
  authMiddleware,
  notificationController.deleteNotification.bind(notificationController)
);

// Lấy thông báo chưa đọc
router.get(
  '/unread',
  authMiddleware,
  notificationController.getUnreadNotifications.bind(notificationController)
);

// Lấy thông báo theo loại
router.get(
  '/type/:type',
  authMiddleware,
  notificationController.getNotificationsByType.bind(notificationController)
);

// Lấy thông báo theo ngày
router.get(
  '/date',
  authMiddleware,
  validateRequest(notificationSchema.getByDate),
  notificationController.getNotificationsByDate.bind(notificationController)
);

// Tạo thông báo giao dịch
router.post(
  '/trade',
  authMiddleware,
  validateRequest(notificationSchema.createTrade),
  notificationController.createTradeNotification.bind(notificationController)
);

// Tạo thông báo tín hiệu
router.post(
  '/signal',
  authMiddleware,
  validateRequest(notificationSchema.createSignal),
  notificationController.createSignalNotification.bind(notificationController)
);

// Tạo thông báo rủi ro
router.post(
  '/risk',
  authMiddleware,
  validateRequest(notificationSchema.createRisk),
  notificationController.createRiskNotification.bind(notificationController)
);

// Tạo thông báo hệ thống
router.post(
  '/system',
  authMiddleware,
  validateRequest(notificationSchema.createSystem),
  notificationController.createSystemNotification.bind(notificationController)
);

export default router; 