import express from 'express';
import { authenticate } from '../middleware/auth';
import * as profileController from '../controllers/profileController';

const router = express.Router();

router.use(authenticate);

router.get('/', profileController.getProfile);
router.post('/', profileController.createProfile);
router.put('/', profileController.updateProfile);
router.put('/preferences', profileController.updatePreferences);
router.put('/social-links', profileController.updateSocialLinks);

export default router; 