import { NotificationService } from '../services/notificationService.js';

export class NotificationController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  async getAllNotifications(req, res, next) {
    try {
      const notifications = await this.notificationService.getAllNotifications();
      const response = {
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async sendNotification(req, res, next) {
    try {
      const notification = await this.notificationService.sendNotification(req.body);
      const response = {
        success: true,
        message: 'Notification sent successfully',
        data: {
          status: 'sent',
          notification,
        },
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
