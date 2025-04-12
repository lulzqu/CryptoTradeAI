import express from 'express';
import {
  getUserSettings,
  updateUserSettings,
  getApiKeys,
  updateApiKeys,
  getNotificationSettings,
  updateNotificationSettings,
  updateNotificationPreferences,
  updateAPIKeys,
  updateSecuritySettings,
  resetTwoFactorAuthentication
} from '../controllers/settings.controller';
import {
  authenticateUser,
  authorizeRoles
} from '../middleware/auth.middleware';
import {
  validateUpdateSettings,
  validateAPIKeys,
  validateSecuritySettings
} from '../middleware/validation.middleware';

const router = express.Router();

// Tất cả routes yêu cầu xác thực
router.use(authenticateUser);

// Routes cho cài đặt người dùng
router.route('/user')
  .get(getUserSettings)
  .put(validateUpdateSettings, updateUserSettings);

// Routes cho API keys
router.route('/api-keys')
  .get(getApiKeys)
  .put(validateAPIKeys, updateAPIKeys);

// Routes cho thông báo
router.route('/notifications')
  .get(getNotificationSettings)
  .put(updateNotificationPreferences);

// Cập nhật cài đặt bảo mật
router.put(
  '/security',
  validateSecuritySettings,
  updateSecuritySettings
);

// Đặt lại xác thực hai yếu tố
router.post(
  '/reset-2fa',
  resetTwoFactorAuthentication
);

// Cài đặt nâng cao (chỉ dành cho admin)
router.put(
  '/advanced',
  authorizeRoles('admin'),
  (req, res) => {
    // Xử lý cài đặt nâng cao
    res.status(200).json({
      message: 'Cài đặt nâng cao đã được cập nhật'
    });
  }
);

export default router; 