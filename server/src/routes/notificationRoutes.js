import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { sendNotificationSchema } from '../validators/notificationValidator.js';

const router = Router();
const notificationController = new NotificationController();

router.get('/', notificationController.getAllNotifications.bind(notificationController));
router.post('/send', validateRequest(sendNotificationSchema), notificationController.sendNotification.bind(notificationController));

export default router;
